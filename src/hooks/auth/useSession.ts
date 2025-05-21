
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./types";
import { Company } from "@/types/company";

export const useSession = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  // Load company data helper function
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

  // Check Supabase session on load
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
                const { data: profileData, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .maybeSingle();
                  
                if (profileData) {
                  console.log("Profildaten nach Event:", profileData);
                  setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    first_name: profileData.first_name,
                    last_name: profileData.last_name,
                    company_id: profileData.company_id
                  });
                  
                  // If user is associated with a company, load company data
                  if (profileData.company_id) {
                    loadCompanyData(profileData.company_id);
                  } else {
                    console.log("Benutzer hat kein Unternehmen nach Event");
                    setCompany(null);
                  }
                } else {
                  console.error("Profile error:", error);
                  
                  // Create profile if none exists
                  if (error && error.code === 'PGRST116') {
                    const { error: createProfileError } = await supabase
                      .from('profiles')
                      .insert({
                        id: session.user.id,
                        first_name: session.user.user_metadata?.first_name || null,
                        last_name: session.user.user_metadata?.last_name || null
                      });
                      
                    if (createProfileError) {
                      console.error("Fehler beim Erstellen des Profils nach Event:", createProfileError);
                    } else {
                      console.log("Profil erfolgreich erstellt nach Event");
                    }
                  }
                  
                  // Set basic user data
                  setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    first_name: session.user.user_metadata?.first_name,
                    last_name: session.user.user_metadata?.last_name
                  });
                }
              }, 0);
            } else {
              setIsAuthenticated(false);
              setUser(null);
              setCompany(null);
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
            
            // Create profile if none exists
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
    
    return () => {
      // Clean up will be handled by the subscription.unsubscribe() in onAuthStateChange
    };
  }, []);

  return {
    isAuthenticated,
    loadingAuth,
    user,
    setUser,
    company,
    setCompany
  };
};
