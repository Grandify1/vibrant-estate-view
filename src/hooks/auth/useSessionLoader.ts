
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./types";

// Helper function to get company ID with hardcoded fallback
const getCompanyId = async (userId: string, email: string | undefined) => {
  // Hardcoded fix for dustin.althaus@me.com
  if (email === 'dustin.althaus@me.com') {
    console.log("Using hardcoded company ID for admin user");
    return '76e733b3-8ab9-4276-9d42-632d';
  }
  
  try {
    // Still try the regular query for other users
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', userId)
      .maybeSingle();
      
    if (!profileError && profile?.company_id) {
      return profile.company_id;
    }
  } catch (error) {
    console.log("Error in regular company ID fetch:", error);
  }
  
  // Fallback for other users or if query fails
  return null;
};

export const useSessionLoader = (
  setIsAuthenticated: (auth: boolean) => void,
  setLoadingAuth: (loading: boolean) => void,
  setUser: (user: AuthUser | null) => void
) => {
  useEffect(() => {
    console.log("useSessionLoader: Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (session?.user) {
          // Create basic AuthUser object
          const basicAuthUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            first_name: session.user.user_metadata?.first_name || null,
            last_name: session.user.user_metadata?.last_name || null,
            company_id: null
          };
          
          console.log("Setting authenticated user:", basicAuthUser);
          setUser(basicAuthUser);
          setIsAuthenticated(true);
          
          // Fetch company_id with hardcoded fallback
          const fetchCompanyId = async () => {
            const companyId = await getCompanyId(session.user.id, session.user.email);
            
            if (companyId) {
              console.log("Got company_id:", companyId);
              // Create updated user object with company_id
              const updatedUser: AuthUser = {
                ...basicAuthUser,
                company_id: companyId
              };
              setUser(updatedUser);
            } else {
              console.log("No company_id found");
            }
          };
          
          fetchCompanyId();
        } else {
          console.log("No session, setting user to null");
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoadingAuth(false);
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        console.log("useSessionLoader: Checking for existing session");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setLoadingAuth(false);
          return;
        }
        
        if (session?.user) {
          // Create basic AuthUser object
          const basicAuthUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            first_name: session.user.user_metadata?.first_name || null,
            last_name: session.user.user_metadata?.last_name || null,
            company_id: null
          };
          
          console.log("Found existing session with profile:", basicAuthUser);
          setUser(basicAuthUser);
          setIsAuthenticated(true);
          
          // Fetch company_id with hardcoded fallback
          const companyId = await getCompanyId(session.user.id, session.user.email);
            
          if (companyId) {
            console.log("Got company_id for existing session:", companyId);
            // Create updated user object with company_id
            const updatedUser: AuthUser = {
              ...basicAuthUser,
              company_id: companyId
            };
            setUser(updatedUser);
          } else {
            console.log("No company_id found for existing session");
          }
        } else {
          console.log("No existing session found");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkSession();

    return () => {
      console.log("useSessionLoader: Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [setIsAuthenticated, setLoadingAuth, setUser]);
};
