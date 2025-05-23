
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
            // Create basic AuthUser object first
            const basicAuthUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name || null,
              last_name: session.user.user_metadata?.last_name || null,
              company_id: null
            };
            
            // Try to fetch company_id from profile
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('company_id')
                .eq('id', session.user.id)
                .maybeSingle();
                
              if (!profileError && profile?.company_id) {
                console.log("Found company_id in profile:", profile.company_id);
                basicAuthUser.company_id = profile.company_id;
              } else {
                console.log("No company_id found in profile or error:", profileError);
              }
            } catch (profileFetchError) {
              console.log("Error fetching profile, continuing without company_id:", profileFetchError);
            }
            
            console.log("Setting authenticated user:", basicAuthUser);
            setUser(basicAuthUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Error in auth state change:", error);
            // Still set basic user without company_id
            const basicAuthUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name || null,
              last_name: session.user.user_metadata?.last_name || null,
              company_id: null
            };
            
            setUser(basicAuthUser);
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
            // Create basic AuthUser object first
            const basicAuthUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name || null,
              last_name: session.user.user_metadata?.last_name || null,
              company_id: null
            };
            
            // Try to fetch company_id from profile
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('company_id')
                .eq('id', session.user.id)
                .maybeSingle();
                
              if (!profileError && profile?.company_id) {
                console.log("Found company_id in existing session profile:", profile.company_id);
                basicAuthUser.company_id = profile.company_id;
              } else {
                console.log("No company_id found in existing session profile or error:", profileError);
              }
            } catch (profileFetchError) {
              console.log("Error fetching existing session profile, continuing without company_id:", profileFetchError);
            }
            
            console.log("Found existing session with profile:", basicAuthUser);
            setUser(basicAuthUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Error processing existing session:", error);
            // Still set basic user without company_id
            const basicAuthUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name || null,
              last_name: session.user.user_metadata?.last_name || null,
              company_id: null
            };
            
            console.log("Found existing session without profile:", basicAuthUser);
            setUser(basicAuthUser);
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
