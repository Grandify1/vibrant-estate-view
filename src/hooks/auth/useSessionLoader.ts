
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./types";
import { toast } from "sonner";

export const useSessionLoader = (
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  setLoadingAuth: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
) => {
  // Handle profile creation or loading
  const handleProfileData = async (userId: string) => {
    try {
      console.log("Handling profile data for user:", userId);
      
      // Get user email from session (NOT from auth.users table!)
      const { data: sessionData } = await supabase.auth.getSession();
      const email = sessionData?.session?.user?.email || '';
      
      console.log("User email from session:", email);
      
      // First try to get existing profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      console.log("Profile query result:", { profileData, profileError });
        
      if (profileData) {
        console.log("Existing profile found:", profileData);
        
        setUser({
          id: userId,
          email: email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          company_id: profileData.company_id
        });
      } else {
        console.log("No profile found, creating new one...");
        
        // Get user metadata from session
        const metadata = sessionData?.session?.user?.user_metadata;
        console.log("User metadata:", metadata);
        
        try {
          // Use UPSERT to create or update profile
          const { data: newProfile, error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              first_name: metadata?.first_name || null,
              last_name: metadata?.last_name || null,
              company_id: null
            }, {
              onConflict: 'id'
            })
            .select()
            .single();
            
          console.log("Upsert result:", { newProfile, upsertError });
            
          if (upsertError) {
            console.error("Upsert error:", upsertError);
            // If upsert fails, still set basic user data
            setUser({
              id: userId,
              email: email,
              first_name: metadata?.first_name,
              last_name: metadata?.last_name,
              company_id: null
            });
          } else {
            console.log("Profile successfully created/updated");
            setUser({
              id: userId,
              email: email,
              first_name: newProfile.first_name,
              last_name: newProfile.last_name,
              company_id: newProfile.company_id
            });
          }
        } catch (e) {
          console.error("Error during profile upsert:", e);
          // Fallback: set basic user data even if profile creation fails
          setUser({
            id: userId,
            email: email,
            first_name: metadata?.first_name,
            last_name: metadata?.last_name,
            company_id: null
          });
        }
      }
    } catch (error) {
      console.error("Error handling profile data:", error);
      // Even on error, try to set basic user data
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const email = sessionData?.session?.user?.email || '';
        const metadata = sessionData?.session?.user?.user_metadata;
        
        setUser({
          id: userId,
          email: email,
          first_name: metadata?.first_name,
          last_name: metadata?.last_name,
          company_id: null
        });
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
    }
  };

  // Initialize session
  useEffect(() => {
    let mounted = true;
    let authListener: any;
    
    const checkSession = async () => {
      if (!mounted) return;
      
      try {
        setLoadingAuth(true);
        console.log("Checking session...");
        
        // Get initial session
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        if (session && mounted) {
          console.log("Session found:", session.user.id);
          setIsAuthenticated(true);
          
          // Load user data from profile
          await handleProfileData(session.user.id);
        } else {
          console.log("No session found");
          if (mounted) {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
        
        console.log("Session check complete, setting loadingAuth to false");
        if (mounted) setLoadingAuth(false);
        
        // Set up auth state listener AFTER initial check
        if (mounted) {
          const { data } = supabase.auth.onAuthStateChange(
            (event, session) => {
              console.log("Auth state changed:", event, session?.user?.id);
              
              if (session) {
                setIsAuthenticated(true);
                
                // Use setTimeout to prevent auth deadlock
                setTimeout(async () => {
                  if (mounted) {
                    await handleProfileData(session.user.id);
                  }
                }, 0);
              } else {
                setIsAuthenticated(false);
                setUser(null);
              }
            }
          );
          
          authListener = data.subscription;
        }
      } catch (error) {
        console.error("Error during session check:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setUser(null);
          setLoadingAuth(false);
        }
      }
    };
    
    checkSession();
    
    return () => {
      mounted = false;
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, [setIsAuthenticated, setLoadingAuth, setUser]);
};
