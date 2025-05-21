
import { Company } from "@/types/company";
import { AuthUser } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CompanyInput = Omit<Company, 'id' | 'created_at' | 'updated_at'>;

export const useCompanyCreator = (
  user: AuthUser | null,
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>
) => {
  const createCompany = async (companyData: CompanyInput): Promise<boolean> => {
    if (!user) {
      console.error("Kein Benutzer gefunden");
      toast.error("Sie müssen angemeldet sein, um ein Unternehmen zu erstellen");
      return false;
    }

    try {
      console.log("Erstelle Unternehmen mit Daten:", companyData);
      console.log("User ID:", user.id);

      // Prüfe, ob der Benutzer eine aktive Session hat
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error("Keine aktive Session gefunden");
        toast.error("Sie sind nicht angemeldet. Bitte melden Sie sich erneut an.");
        return false;
      }

      console.log("Session beim Erstellen des Unternehmens:", sessionData.session.user.id);

      // Methode 1: Verwende die Edge-Funktion, um das Unternehmen zu erstellen
      const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke(
        'create-company',
        {
          body: { companyData },
        }
      );

      if (edgeFunctionError) {
        console.error("Fehler beim Aufrufen der Edge-Funktion:", edgeFunctionError);
      } else if (edgeFunctionData?.company) {
        // Aktualisiere den lokalen Benutzer- und Unternehmenszustand
        setUser({
          ...user,
          company_id: edgeFunctionData.company.id
        });
        setCompany(edgeFunctionData.company);

        toast.success("Unternehmen erfolgreich erstellt!");
        return true;
      }

      // Methode 2: Direktes Einfügen in die Datenbank (falls Edge-Funktion fehlschlägt)
      const { data: newCompany, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();

      if (error) {
        console.error("Fehler beim Erstellen des Unternehmens:", error);
        
        // Wenn beide Methoden fehlschlagen, zeige einen Fehler an
        if (edgeFunctionError) {
          toast.error(`Fehler beim Erstellen des Unternehmens. Bitte kontaktieren Sie den Support.`);
          return false;
        }

        toast.error(`Fehler beim Erstellen des Unternehmens: ${error.message}`);
        return false;
      }

      if (newCompany) {
        // Aktualisiere Benutzerprofil mit der Unternehmens-ID
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ company_id: newCompany.id })
          .eq('id', user.id);

        if (profileError) {
          console.error("Fehler beim Verknüpfen des Benutzers mit dem Unternehmen:", profileError);
          return false;
        }

        // Aktualisiere den lokalen Benutzer- und Unternehmenszustand
        setUser({
          ...user,
          company_id: newCompany.id
        });
        setCompany(newCompany);

        toast.success("Unternehmen erfolgreich erstellt!");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Unerwarteter Fehler beim Erstellen des Unternehmens:", error);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
      return false;
    }
  };

  return {
    createCompany
  };
};
