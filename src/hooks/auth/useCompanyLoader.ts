
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";

export const useCompanyLoader = (
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

  return {
    loadCompanyData
  };
};
