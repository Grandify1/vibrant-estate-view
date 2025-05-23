
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
      // Get user email from session
      const { data: sessionData } = await supabase.auth.getSession();
      const email = sessionData?.session?.user?.email || '';
      const metadata = sessionData?.session?.user?.user_metadata || {};
      
      // Versuchen, das vorhandene Profil mit direkter ID-Abfrage abzurufen
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.log("Fehler beim Abrufen des Profils, versuche es zu erstellen:", profileError.message);
        
        // Wenn das Profil nicht gefunden wurde oder ein Berechtigungsfehler auftrat,
        // eine sichere Upsert-Operation durchführen
        try {
          // Werte aus Metadaten vorbereiten
          const firstName = metadata?.first_name || null;
          const lastName = metadata?.last_name || null;
          
          // Verwende die "upsert" Methode
          const { data: newProfile, error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              first_name: firstName,
              last_name: lastName,
              // Keine company_id setzen, wenn nicht vorhanden
            })
            .select()
            .single();
            
          if (upsertError) {
            console.error("Fehler beim Erstellen/Aktualisieren des Profils:", upsertError);
            // Fallback: Grundlegende Benutzerdaten setzen
            setUser({
              id: userId,
              email: email,
              first_name: firstName,
              last_name: lastName,
              company_id: null
            });
          } else if (newProfile) {
            // Profil wurde erfolgreich erstellt/aktualisiert
            setUser({
              id: userId,
              email: email,
              first_name: newProfile.first_name,
              last_name: newProfile.last_name,
              company_id: newProfile.company_id
            });
          }
        } catch (e) {
          console.error("Unerwarteter Fehler beim Verarbeiten des Profils:", e);
          // Fallback: Grundlegende Benutzerdaten setzen
          setUser({
            id: userId,
            email: email,
            first_name: metadata?.first_name,
            last_name: metadata?.last_name,
            company_id: null
          });
        }
      } else if (profileData) {
        // Vorhandenes Profil gefunden
        setUser({
          id: userId,
          email: email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          company_id: profileData.company_id
        });
      }
    } catch (error) {
      console.error("Fehler bei der Profilverarbeitung:", error);
      // Fallback: Versuche grundlegende Benutzerdaten zu setzen
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const email = sessionData?.session?.user?.email || '';
        const metadata = sessionData?.session?.user?.user_metadata || {};
        
        setUser({
          id: userId,
          email: email,
          first_name: metadata?.first_name,
          last_name: metadata?.last_name,
          company_id: null
        });
      } catch (fallbackError) {
        console.error("Kritischer Fehler beim Abrufen der Benutzerdaten:", fallbackError);
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
        
        // Get initial session
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        if (session && mounted) {
          setIsAuthenticated(true);
          
          // Load user data from profile
          await handleProfileData(session.user.id);
        } else {
          if (mounted) {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
        
        if (mounted) setLoadingAuth(false);
        
        // Set up auth state listener AFTER initial check
        if (mounted) {
          const { data } = supabase.auth.onAuthStateChange(
            (event, session) => {
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
