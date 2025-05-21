
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./types";

export const useSessionLoader = (
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  setLoadingAuth: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  loadCompanyData: (companyId: string) => Promise<void>
) => {
  // Handle profile creation or loading
  const handleProfileData = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (profileData) {
        console.log("Profildaten:", profileData);
        
        // Get user email asynchronously
        const { data } = await supabase.auth.getUser();
        const email = data.user?.email || '';
        
        setUser({
          id: userId,
          email: email, // Fix: Assign email directly instead of a Promise
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
        }
      } else {
        console.error("Kein Profil gefunden oder Fehler:", error);
        
        // Create profile if none exists
        if (error && error.code === 'PGRST116') {
          console.log("Erstelle neues Profil für Benutzer:", userId);
          
          // Get user metadata from session
          const { data: userData } = await supabase.auth.getUser();
          const metadata = userData.user?.user_metadata;
          
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
          }
        }
        
        // Set basic user data
        const { data: userData } = await supabase.auth.getUser();
        setUser({
          id: userId,
          email: userData.user?.email || '',
          first_name: userData.user?.user_metadata?.first_name,
          last_name: userData.user?.user_metadata?.last_name
        });
      }
    } catch (error) {
      console.error("Error handling profile data:", error);
    }
  };

  // Initialize session
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        setLoadingAuth(true);
        
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.id);
            
            if (session) {
              setIsAuthenticated(true);
              
              // Set user data
              setTimeout(async () => {
                await handleProfileData(session.user.id);
              }, 0);
            } else {
              setIsAuthenticated(false);
              setUser(null);
            }
          }
        );

        // THEN check for existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        if (sessionError) {
          console.error("Fehler beim Abrufen der Session:", sessionError);
          setIsAuthenticated(false);
          setUser(null);
          setLoadingAuth(false);
          return;
        }
        
        if (session) {
          console.log("Session gefunden:", session.user.id);
          setIsAuthenticated(true);
          
          // Load user data from profile
          await handleProfileData(session.user.id);
        } else {
          console.log("Keine Session gefunden");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Session:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        console.log("Session check complete, setting loadingAuth to false");
        setLoadingAuth(false);
      }
    };
    
    checkSession();
    
    return () => {
      // Clean up will be handled by the subscription.unsubscribe() in onAuthStateChange
    };
  }, [setIsAuthenticated, setLoadingAuth, setUser, loadCompanyData]);
};
