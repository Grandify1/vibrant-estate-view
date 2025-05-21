
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
  updateCompany: (companyData: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>) => Promise<boolean>;
  loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  
  // Check Supabase session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        setLoadingAuth(true);
        
        // Get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        if (sessionError) {
          console.error("Fehler beim Abrufen der Session:", sessionError);
          setIsAuthenticated(false);
          setUser(null);
          setCompany(null);
          setLoadingAuth(false);
          return;
        }
        
        if (session) {
          console.log("Session gefunden:", session.user.id);
          setIsAuthenticated(true);
          
          // Load user data from profile
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileData) {
            console.log("Profildaten:", profileData);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              company_id: profileData.company_id
            });
            
            // If user is associated with a company, load company data
            if (profileData.company_id) {
              console.log("Lade Unternehmensdaten für ID:", profileData.company_id);
              await loadCompanyData(profileData.company_id);
            } else {
              console.log("Benutzer hat kein Unternehmen");
              setCompany(null);
            }
          } else {
            console.error("Kein Profil gefunden oder Fehler:", error);
            
            // Automatisch ein Profil erstellen, wenn keins existiert
            if (error && error.code === 'PGRST116') {
              console.log("Erstelle neues Profil für Benutzer:", session.user.id);
              const { error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  first_name: session.user.user_metadata?.first_name || null,
                  last_name: session.user.user_metadata?.last_name || null
                });
                
              if (createError) {
                console.error("Fehler beim Erstellen des Profils:", createError);
              } else {
                console.log("Profil erfolgreich erstellt");
              }
            }
            
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name,
              last_name: session.user.user_metadata?.last_name
            });
          }
        } else {
          console.log("Keine Session gefunden");
          setIsAuthenticated(false);
          setUser(null);
          setCompany(null);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Session:", error);
        setIsAuthenticated(false);
        setUser(null);
        setCompany(null);
      } finally {
        console.log("Session check complete, setting loadingAuth to false");
        setLoadingAuth(false);
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user.id);
        
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          
          // Set user data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileData) {
            console.log("Profildaten nach SIGNED_IN:", profileData);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              company_id: profileData.company_id
            });
            
            // If user is associated with a company, load company data
            if (profileData.company_id) {
              await loadCompanyData(profileData.company_id);
            } else {
              console.log("Benutzer hat kein Unternehmen nach SIGNED_IN");
              setCompany(null);
            }
          } else {
            console.error("Profile error:", error);
            
            // Automatisch ein Profil erstellen, wenn keins existiert
            if (error && error.code === 'PGRST116') {
              console.log("Erstelle neues Profil für Benutzer nach SIGNED_IN:", session.user.id);
              const { error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  first_name: session.user.user_metadata?.first_name || null,
                  last_name: session.user.user_metadata?.last_name || null
                });
                
              if (createError) {
                console.error("Fehler beim Erstellen des Profils nach SIGNED_IN:", createError);
              } else {
                console.log("Profil erfolgreich erstellt nach SIGNED_IN");
              }
            }
            
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name,
              last_name: session.user.user_metadata?.last_name
            });
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("Benutzer hat sich abgemeldet");
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
  
  // Create company
  const createCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error("Sie müssen angemeldet sein, um ein Unternehmen zu erstellen");
      return false;
    }
    
    try {
      console.log("Erstelle Unternehmen mit Daten:", companyData);
      
      // Überprüfen der Authentifizierung
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error("Keine aktive Sitzung:", sessionError);
        toast.error("Sie sind nicht angemeldet. Bitte melden Sie sich erneut an.");
        return false;
      }
      
      // Create company
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single();
      
      if (companyError) {
        console.error("Fehler beim Erstellen des Unternehmens:", companyError);
        toast.error("Fehler beim Erstellen des Unternehmens: " + companyError.message);
        
        // Wenn es ein RLS-Fehler ist, versuchen wir einen alternativen Ansatz
        if (companyError.code === '42501' || companyError.message.includes('row-level security policy')) {
          console.log("RLS-Fehler beim Erstellen des Unternehmens, versuche alternativen Ansatz...");
          
          // Aktualisieren des Profils vor dem Erstellen des Unternehmens
          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({ 
              first_name: user.first_name || "",
              last_name: user.last_name || ""
            })
            .eq('id', user.id);
            
          if (profileUpdateError) {
            console.error("Fehler beim Aktualisieren des Profils:", profileUpdateError);
          } else {
            // Zweiter Versuch, das Unternehmen zu erstellen
            const { data: retryCompany, error: retryError } = await supabase
              .from('companies')
              .insert(companyData)
              .select()
              .single();
              
            if (retryError) {
              console.error("Wiederholter Fehler beim Erstellen des Unternehmens:", retryError);
            } else if (retryCompany) {
              console.log("Unternehmen erfolgreich erstellt (2. Versuch):", retryCompany);
              
              // Benutzerprofil mit der Unternehmens-ID aktualisieren
              const { error: linkError } = await supabase
                .from('profiles')
                .update({ company_id: retryCompany.id })
                .eq('id', user.id);
                
              if (!linkError) {
                // Update local state
                setUser(prev => prev ? { ...prev, company_id: retryCompany.id } : null);
                setCompany(retryCompany as Company);
                
                toast.success("Unternehmen erfolgreich erstellt");
                return true;
              }
            }
          }
        }
        
        return false;
      }
      
      console.log("Unternehmen erfolgreich erstellt:", newCompany);
      
      // Link user profile with company
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ company_id: newCompany.id })
        .eq('id', user.id);
      
      if (profileError) {
        console.error("Fehler beim Verknüpfen des Profils:", profileError);
        toast.error("Fehler beim Verknüpfen des Profils: " + profileError.message);
        return false;
      }
      
      // Update local state
      setUser(prev => prev ? { ...prev, company_id: newCompany.id } : null);
      setCompany(newCompany as Company);
      
      toast.success("Unternehmen erfolgreich erstellt");
      return true;
    } catch (error: any) {
      console.error("Fehler beim Erstellen des Unternehmens:", error);
      toast.error("Ein Fehler ist aufgetreten");
      return false;
    }
  };

  // Update company
  const updateCompany = async (companyData: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !company) {
      toast.error("Sie müssen angemeldet sein und ein Unternehmen haben, um Änderungen vorzunehmen");
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('companies')
        .update(companyData)
        .eq('id', company.id);
      
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
  
  // Logout
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
        updateCompany,
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
