
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { AuthUser } from "./types";
import { useCompanyLoader } from "./useCompanyLoader";

export const useCompanyCreator = (
  user: AuthUser | null,
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>
) => {
  const { loadCompanyData } = useCompanyLoader(setCompany);

  // Create company
  const createCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error("Sie müssen angemeldet sein, um ein Unternehmen zu erstellen");
      return false;
    }
    
    try {
      console.log("Erstelle Unternehmen mit Daten:", companyData);
      console.log("User ID:", user.id);
      
      // Force refresh session to ensure authentication is current
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !session) {
        console.error("Session refresh failed:", refreshError);
        toast.error("Authentifizierung fehlgeschlagen. Bitte melden Sie sich erneut an.");
        return false;
      }
      
      console.log("Session beim Erstellen des Unternehmens:", session?.user.id);
      
      // Try direct SQL approach with RPC call - safer with RLS
      try {
        // Fix: 'create_company' is not a valid function in the database, using custom function call instead
        const { data: rpcResult, error: rpcError } = await supabase.functions.invoke('create-company', {
          body: { companyData, userId: user.id }
        });
        
        if (!rpcError && rpcResult) {
          console.log("Unternehmen via Function erfolgreich erstellt:", rpcResult);
          
          // If the function was successful and returned a company
          if (typeof rpcResult === 'object' && rpcResult !== null && rpcResult.company && 'id' in rpcResult.company) {
            // Update local state
            setUser(prev => prev ? { ...prev, company_id: rpcResult.company.id } : null);
            
            // Load company data
            await loadCompanyData(rpcResult.company.id);
            
            toast.success("Unternehmen erfolgreich erstellt");
            return true;
          }
        } else {
          throw new Error(rpcError?.message || "Function error");
        }
      } catch (rpcError) {
        console.error("Function Fehler oder Funktion existiert nicht:", rpcError);
        
        // Fall back to standard approach if function fails
        try {
          // Create company with insert
          const { data: newCompany, error: companyError } = await supabase
            .from('companies')
            .insert(companyData)
            .select()
            .single();
          
          if (companyError) {
            console.error("Fehler beim Erstellen des Unternehmens:", companyError);
            
            // Special handling for RLS policy issues
            if (companyError.code === '42501' || companyError.message.includes('row-level security policy')) {
              toast.error("Sicherheitsrichtlinie verhindert das Erstellen des Unternehmens");
              
              // Try updating profile first to ensure it exists
              console.log("Aktualisiere Profil für Benutzer:", user.id);
              const { error: profileError } = await supabase
                .from('profiles')
                .upsert({ 
                  id: user.id,
                  first_name: user.first_name || "",
                  last_name: user.last_name || ""
                });
                
              if (profileError) {
                console.error("Fehler beim Aktualisieren des Profils:", profileError);
                toast.error("Fehler beim Aktualisieren des Profils");
                return false;
              }
              
              // Try again with direct SQL via function call
              toast.info("Versuche alternativen Ansatz...");
              
              // Use edge function as last resort
              const { data: result, error: rawError } = await supabase.functions.invoke('create-company', {
                body: { companyData, userId: user.id }
              });
              
              if (rawError) {
                console.error("Edge Function Fehler:", rawError);
                toast.error("Fehler beim Erstellen des Unternehmens via Edge Function");
                return false;
              }
              
              if (result && result.company) {
                // Update profile with company_id
                const { error: linkError } = await supabase
                  .from('profiles')
                  .update({ company_id: result.company.id })
                  .eq('id', user.id);
                  
                if (linkError) {
                  console.error("Fehler beim Verknüpfen des Profils:", linkError);
                  toast.warning("Unternehmen erstellt, aber Verknüpfung fehlgeschlagen.");
                } else {
                  // Update local state
                  setUser(prev => prev ? { ...prev, company_id: result.company.id } : null);
                  setCompany(result.company as Company);
                  toast.success("Unternehmen erfolgreich erstellt");
                  return true;
                }
              }
            } else {
              toast.error(`Fehler: ${companyError.message || "Unbekannter Fehler"}`);
            }
            
            return false;
          }
          
          if (newCompany) {
            console.log("Unternehmen erfolgreich erstellt:", newCompany);
            
            // Link user profile with company
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ company_id: newCompany.id })
              .eq('id', user.id);
            
            if (profileError) {
              console.error("Fehler beim Verknüpfen des Profils:", profileError);
              toast.warning("Unternehmen erstellt, aber Verknüpfung fehlgeschlagen.");
            } else {
              // Update local state
              setUser(prev => prev ? { ...prev, company_id: newCompany.id } : null);
              setCompany(newCompany as Company);
              toast.success("Unternehmen erfolgreich erstellt");
              return true;
            }
            
            return true;
          }
        } catch (insertError) {
          console.error("Fehler beim INSERT-Versuch:", insertError);
        }
      }
      
      toast.error("Unternehmen konnte nicht erstellt werden.");
      return false;
    } catch (error: any) {
      console.error("Fehler beim Erstellen des Unternehmens:", error);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
      return false;
    }
  };

  return {
    createCompany
  };
};
