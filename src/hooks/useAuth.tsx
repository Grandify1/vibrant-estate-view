
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
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        if (session) {
          console.log("Session found:", session.user.id);
          setIsAuthenticated(true);
          
          // Load user data from profile
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileData) {
            console.log("Profile data:", profileData);
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
            }
          } else {
            console.log("No profile found or error:", error);
            setUser({
              id: session.user.id,
              email: session.user.email || ''
            });
          }
        } else {
          console.log("No session found");
          setIsAuthenticated(false);
          setUser(null);
          setCompany(null);
        }
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        console.log("Session check complete, setting loadingAuth to false");
        setLoadingAuth(false);
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          
          // Set user data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileData) {
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
            }
          } else {
            console.error("Profile error:", error);
            setUser({
              id: session.user.id,
              email: session.user.email || ''
            });
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
  
  // Load company data
  const loadCompanyData = async (companyId: string) => {
    try {
      console.log("Loading company data for ID:", companyId);
      const { data: companyData, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .maybeSingle();
      
      if (error) {
        console.error("Error loading company data:", error);
        return;
      }
      
      if (companyData) {
        console.log("Company data loaded:", companyData);
        setCompany(companyData as Company);
      } else {
        console.log("No company found with ID:", companyId);
      }
    } catch (error) {
      console.error("Error loading company data:", error);
    }
  };
  
  // Login with Supabase
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error("Login error: " + error.message);
        return false;
      }
      
      toast.success("Successfully logged in!");
      return true;
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred");
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
        toast.error("Registration error: " + error.message);
        return false;
      }
      
      // Automatically login
      await login(email, password);
      
      toast.success("Registration successful! You are now logged in.");
      return true;
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred");
      return false;
    }
  };
  
  // Create company
  const createCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error("You must be logged in to create a company");
      return false;
    }
    
    try {
      console.log("Creating company with data:", companyData);
      
      // Create company
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single();
      
      if (companyError) {
        console.error("Company creation error:", companyError);
        toast.error("Error creating company: " + companyError.message);
        return false;
      }
      
      console.log("Company created successfully:", newCompany);
      
      // Link user profile with company
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ company_id: newCompany.id })
        .eq('id', user.id);
      
      if (profileError) {
        console.error("Profile linking error:", profileError);
        toast.error("Error linking profile: " + profileError.message);
        return false;
      }
      
      // Update local state
      setUser(prev => prev ? { ...prev, company_id: newCompany.id } : null);
      setCompany(newCompany as Company);
      
      toast.success("Company created successfully");
      return true;
    } catch (error: any) {
      console.error("Error creating company:", error);
      toast.error("An error occurred");
      return false;
    }
  };

  // Update company
  const updateCompany = async (companyData: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !company) {
      toast.error("You must be logged in and have a company to make changes");
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('companies')
        .update(companyData)
        .eq('id', company.id);
      
      if (error) {
        toast.error("Error updating company: " + error.message);
        return false;
      }
      
      // Update local state
      setCompany(prev => prev ? { ...prev, ...companyData } as Company : null);
      
      return true;
    } catch (error: any) {
      console.error("Error updating company:", error);
      toast.error("An error occurred");
      return false;
    }
  };
  
  // Logout
  const logout = () => {
    supabase.auth.signOut().then(() => {
      setIsAuthenticated(false);
      setUser(null);
      setCompany(null);
      toast.info("Logged out");
    }).catch(error => {
      console.error("Error during logout:", error);
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
