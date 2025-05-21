
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
      // Get user email directly
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email || '';
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (profileData) {
        console.log("Profildaten gefunden:", profileData);
        
        setUser({
          id: userId,
          email: email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          company_id: profileData.company_id // Make sure to include company_id
        });
      } else {
        if (error) {
          console.log("Profil error:", error);
        }
        
        // Create profile if none exists
        if (!profileData) {
          console.log("Erstelle neues Profil für Benutzer:", userId);
          
          // Get user metadata from session
          const metadata = data.user?.user_metadata;
          
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              first_name: metadata?.first_name || null,
              last_name: metadata?.last_name || null
            });
            
          if (createError) {
            console.error("Fehler beim Erstellen des Profils:", createError);
          } else {
            console.log("Profil erfolgreich erstellt");
            
            // Set basic user data after creating profile
            setUser({
              id: userId,
              email: email,
              first_name: metadata?.first_name,
              last_name: metadata?.last_name,
              company_id: null // Initialize company_id as null for new users
            });
          }
        }
      }
    } catch (error) {
      console.error("Error handling profile data:", error);
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
          console.log("Session gefunden:", session.user.id);
          setIsAuthenticated(true);
          
          // Load user data from profile
          await handleProfileData(session.user.id);
        } else {
          console.log("Keine Session gefunden");
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
        console.error("Fehler beim Laden der Session:", error);
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
