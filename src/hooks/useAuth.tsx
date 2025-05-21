
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Company, initialCompany } from "@/types/company";

interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_id?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  company: Company | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  createCompany: (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dynamisch die aktuelle URL für Supabase verwenden
const getCurrentUrl = () => {
  return window.location.origin;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  
  // Supabase-Sitzung beim Laden prüfen
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoadingAuth(true);
        
        // Session abrufen
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        if (session) {
          const { user } = session;
          setIsAuthenticated(true);
          
          // Nutzerdaten aus dem Profil laden
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileData) {
            setUser({
              id: user.id,
              email: user.email || '',
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              company_id: profileData.company_id
            });
            
            // Wenn der Nutzer einem Unternehmen zugeordnet ist, lade die Unternehmensdaten
            if (profileData.company_id) {
              const { data: companyData } = await supabase
                .from('companies')
                .select('*')
                .eq('id', profileData.company_id)
                .single();
                
              if (companyData) {
                setCompany(companyData as Company);
              }
            }
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setCompany(null);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Sitzung:", error);
      } finally {
        setLoadingAuth(false);
      }
    };
    
    checkSession();
    
    // Auf Änderungen der Authentifizierung hören
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          
          // Nutzerdaten setzen
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileData) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              company_id: profileData.company_id
            });
            
            // Wenn der Nutzer einem Unternehmen zugeordnet ist, lade die Unternehmensdaten
            if (profileData.company_id) {
              const { data: companyData } = await supabase
                .from('companies')
                .select('*')
                .eq('id', profileData.company_id)
                .single();
                
              if (companyData) {
                setCompany(companyData as Company);
              }
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
          setCompany(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Login mit Supabase
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error("Anmeldefehler: " + error.message);
        return false;
      }
      
      toast.success("Erfolgreich angemeldet!");
      return true;
    } catch (error) {
      console.error("Fehler bei der Anmeldung:", error);
      toast.error("Ein Fehler ist aufgetreten");
      return false;
    }
  };
  
  // Registrierung mit Supabase - ohne E-Mail-Bestätigung
  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Registrierung ohne E-Mail-Bestätigung
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          },
          // Keine E-Mail-Bestätigung mehr erforderlich
          emailRedirectTo: undefined
        }
      });
      
      if (error) {
        toast.error("Registrierungsfehler: " + error.message);
        return false;
      }
      
      // Automatisch einloggen
      await login(email, password);
      
      toast.success("Registrierung erfolgreich! Sie sind jetzt angemeldet.");
      return true;
    } catch (error) {
      console.error("Fehler bei der Registrierung:", error);
      toast.error("Ein Fehler ist aufgetreten");
      return false;
    }
  };
  
  // Unternehmen erstellen
  const createCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error("Sie müssen angemeldet sein, um ein Unternehmen zu erstellen");
      return false;
    }
    
    try {
      // Unternehmen erstellen
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single();
      
      if (companyError) {
        toast.error("Fehler beim Erstellen des Unternehmens: " + companyError.message);
        return false;
      }
      
      // Nutzerprofil mit Unternehmen verknüpfen
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ company_id: newCompany.id })
        .eq('id', user.id);
      
      if (profileError) {
        toast.error("Fehler beim Verknüpfen des Profils: " + profileError.message);
        return false;
      }
      
      // Lokale Zustandsaktualisierung
      setUser(prev => prev ? { ...prev, company_id: newCompany.id } : null);
      setCompany(newCompany as Company);
      
      toast.success("Unternehmen erfolgreich erstellt");
      return true;
    } catch (error) {
      console.error("Fehler beim Erstellen des Unternehmens:", error);
      toast.error("Ein Fehler ist aufgetreten");
      return false;
    }
  };
  
  // Abmelden
  const logout = () => {
    supabase.auth.signOut().then(() => {
      setIsAuthenticated(false);
      setUser(null);
      setCompany(null);
      toast.info("Abgemeldet");
    }).catch(error => {
      console.error("Fehler beim Abmelden:", error);
    });
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        signup,
        logout, 
        user,
        company,
        createCompany,
        loadingAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
