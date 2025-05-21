
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { AuthUser } from "./types";

export const useCompanyManagement = (
  user: AuthUser | null,
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>
) => {
  // Load company data
  const loadCompanyData = async (companyId: string) => {
    try {
      console.log("Lade Unternehmensdaten für ID:", companyId);
      const { data: companyData, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .maybeSingle();
      
      if (error) {
        console.error("Fehler beim Laden der Unternehmensdaten:", error);
        return;
      }
      
      if (companyData) {
        console.log("Unternehmensdaten geladen:", companyData);
        setCompany(companyData as Company);
      } else {
        console.log("Kein Unternehmen mit ID gefunden:", companyId);
        setCompany(null);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Unternehmensdaten:", error);
      setCompany(null);
    }
  };

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
        // Try to use the RPC function if it exists
        const { data: rpcResult, error: rpcError } = await supabase.rpc('create_company', {
          name_param: companyData.name,
          address_param: companyData.address || null,
          phone_param: companyData.phone || null,
          email_param: companyData.email || null,
          logo_param: companyData.logo || null
        });
        
        if (!rpcError && rpcResult) {
          console.log("Unternehmen via RPC erfolgreich erstellt:", rpcResult);
          
          // If the RPC was successful and returned a company_id
          if (typeof rpcResult === 'object' && rpcResult.company_id) {
            // Update local state
            setUser(prev => prev ? { ...prev, company_id: rpcResult.company_id } : null);
            
            // Load company data
            await loadCompanyData(rpcResult.company_id);
            
            toast.success("Unternehmen erfolgreich erstellt");
            return true;
          }
        } else {
          throw new Error(rpcError?.message || "RPC error");
        }
      } catch (rpcError) {
        console.error("RPC Fehler oder Funktion existiert nicht:", rpcError);
        
        // Fall back to standard approach if RPC fails
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
  
  // Update company
  const updateCompany = async (companyData: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>, currentCompany: Company | null) => {
    if (!user || !currentCompany) {
      toast.error("Sie müssen angemeldet sein und ein Unternehmen haben, um Änderungen vorzunehmen");
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('companies')
        .update(companyData)
        .eq('id', currentCompany.id);
      
      if (error) {
        toast.error("Fehler beim Aktualisieren des Unternehmens: " + error.message);
        return false;
      }
      
      // Update local state
      setCompany(prev => prev ? { ...prev, ...companyData } as Company : null);
      
      return true;
    } catch (error: any) {
      console.error("Fehler beim Aktualisieren des Unternehmens:", error);
      toast.error("Ein Fehler ist aufgetreten");
      return false;
    }
  };

  return {
    loadCompanyData,
    createCompany,
    updateCompany
  };
};
