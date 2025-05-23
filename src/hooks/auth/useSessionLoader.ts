
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./types";

export const useSessionLoader = (
  setIsAuthenticated: (auth: boolean) => void,
  setLoadingAuth: (loading: boolean) => void,
  setUser: (user: AuthUser | null) => void
) => {
  useEffect(() => {
    console.log("useSessionLoader: Setting up auth state listener");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (session?.user) {
          try {
            // Fetch user profile to get company_id
            const { data: profile, error: profileError } = await supabase
              .rpc('safe_update_user_profile', {
                user_id_param: session.user.id,
                first_name_param: session.user.user_metadata?.first_name || '',
                last_name_param: session.user.user_metadata?.last_name || '',
                company_id_param: null // Don't update company_id, just get current data
              });
              
            if (profileError) {
              console.error("Error fetching profile:", profileError);
            }
            
            // Create AuthUser object from session user data
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name || null,
              last_name: session.user.user_metadata?.last_name || null,
              company_id: profile ? (profile as any).company_id : null
            };
            
            console.log("Setting authenticated user:", authUser);
            setUser(authUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Error in auth state change:", error);
            // Still set user but without company_id
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name || null,
              last_name: session.user.user_metadata?.last_name || null,
              company_id: null
            };
            
            setUser(authUser);
            setIsAuthenticated(true);
          }
        } else {
          console.log("No session, setting user to null");
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoadingAuth(false);
      }
    );

    // Check for existing session
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
          try {
            // Fetch user profile to get company_id
            const { data: profile, error: profileError } = await supabase
              .rpc('safe_update_user_profile', {
                user_id_param: session.user.id,
                first_name_param: session.user.user_metadata?.first_name || '',
                last_name_param: session.user.user_metadata?.last_name || '',
                company_id_param: null // Don't update company_id, just get current data
              });
              
            if (profileError) {
              console.error("Error fetching profile:", profileError);
            }
            
            // Create AuthUser object from session user data
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name || null,
              last_name: session.user.user_metadata?.last_name || null,
              company_id: profile ? (profile as any).company_id : null
            };
            
            console.log("Found existing session with profile:", authUser);
            setUser(authUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Error fetching profile data:", error);
            // Still set user but without company_id
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name || null,
              last_name: session.user.user_metadata?.last_name || null,
              company_id: null
            };
            
            console.log("Found existing session without profile:", authUser);
            setUser(authUser);
            setIsAuthenticated(true);
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
