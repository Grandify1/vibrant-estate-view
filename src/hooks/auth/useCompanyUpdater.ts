
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { AuthUser } from "./types";

export const useCompanyUpdater = (
  user: AuthUser | null,
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>
) => {
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
    updateCompany
  };
};
