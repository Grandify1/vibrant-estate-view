
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { AuthUser } from "./types";
import { toast } from "sonner";

export const useCompanyCreator = (
  user: AuthUser | null,
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>
) => {
  const createCompany = async (
    companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>
  ): Promise<boolean> => {
    try {
      if (!user || !user.id) {
        toast.error("Benutzer nicht angemeldet");
        console.error("Kein Benutzer gefunden beim Erstellen des Unternehmens");
        return false;
      }

      console.log("Erstelle Unternehmen mit Daten:", companyData);
      console.log("User ID:", user.id);

      // Insert company data directly using RPC
      const { data: company, error } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single();

      if (error) {
        console.error("Fehler beim Erstellen des Unternehmens:", error);
        toast.error("Fehler beim Erstellen des Unternehmens");
        return false;
      }

      console.log("Unternehmen erfolgreich erstellt:", company);

      // Update user profile with company_id
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ company_id: company.id })
        .eq('id', user.id);

      if (updateError) {
        console.error("Fehler beim Aktualisieren des Profils:", updateError);
        toast.error("Unternehmen erstellt, aber Fehler bei der Profilaktualisierung");
      } else {
        // Update local state
        if (user) {
          setUser({
            ...user,
            company_id: company.id
          });
        }
        
        setCompany(company);
        toast.success("Unternehmen erfolgreich erstellt!");
      }

      return true;
    } catch (error) {
      console.error("Unerwarteter Fehler beim Erstellen des Unternehmens:", error);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
      return false;
    }
  };

  return { createCompany };
};
