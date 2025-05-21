
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
        toast.error("Login Fehler: " + error.message);
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
  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Register without email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          },
          // No email confirmation required
          emailRedirectTo: undefined
        }
      });
      
      if (error) {
        toast.error("Registrierungsfehler: " + error.message);
        return false;
      }
      
      // Automatically login
      await login(email, password);
      
      toast.success("Registrierung erfolgreich! Sie sind jetzt angemeldet.");
      return true;
    } catch (error) {
      console.error("Fehler bei der Registrierung:", error);
      toast.error("Ein Fehler ist aufgetreten");
      return false;
    }
  };

  const logout = () => {
    return supabase.auth.signOut().then(() => {
      toast.info("Abgemeldet");
      return true;
    }).catch(error => {
      console.error("Fehler beim Abmelden:", error);
      return false;
    });
  };

  return {
    login,
    signup,
    logout
  };
};
