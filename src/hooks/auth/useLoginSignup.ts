
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useLoginSignup = () => {
  // Login with Supabase
  const login = async (email: string, password: string) => {
    try {
      console.log("Login versuchen mit Email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login Fehler:", error);
        
        // Benutzerfreundlichere Fehlermeldungen
        if (error.message.includes('Email not confirmed')) {
          toast.error("Bitte bestätigen Sie Ihre E-Mail-Adresse. Prüfen Sie Ihren Posteingang.");
        } else {
          toast.error("Login Fehler: " + error.message);
        }
        return false;
      }
      
      console.log("Login erfolgreich:", data.user?.id);
      toast.success("Erfolgreich eingeloggt!");
      return true;
    } catch (error) {
      console.error("Fehler beim Login:", error);
      toast.error("Ein Fehler ist aufgetreten");
      return false;
    }
  };
  
  // Register with Supabase - no email confirmation
  const signup = async (email: string, password: string, firstName: string, lastName: string, selectedPlan?: string) => {
    try {
      // Register with email confirmation disabled
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          },
          emailRedirectTo: window.location.origin + "/auth?tab=login"
        }
      });
      
      if (error) {
        toast.error("Registrierungsfehler: " + error.message);
        return false;
      }
      
      // Check if email confirmation is required
      if (data.user && data.session) {
        // No email confirmation required, user is automatically logged in
        toast.success("Registrierung erfolgreich! Sie sind jetzt angemeldet.");
        return true;
      } else {
        // Email confirmation required - direct user to payment page if plan selected
        if (selectedPlan) {
          toast.info("Registrierung erfolgreich! Bitte wählen Sie Ihr Paket aus.");
        } else {
          toast.info("Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse.");
        }
        return true;
      }
    } catch (error) {
      console.error("Fehler bei der Registrierung:", error);
      toast.error("Ein Fehler ist aufgetreten");
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info("Abgemeldet");
      return true;
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
      toast.error("Fehler beim Abmelden");
      return false;
    }
  };

  return {
    login,
    signup,
    logout
  };
};
