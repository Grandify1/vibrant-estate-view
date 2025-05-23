
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
      
      console.log('Attempting to fetch profile for user:', userId);
      
      // Try to get existing profile first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (profileError) {
        console.log("Profile fetch error:", profileError.message);
        // If it's a permission error, we'll handle it gracefully
        if (profileError.code === '42501') {
          console.log("Permission denied for profiles table, setting basic user data");
          // Set basic user data without profile
          setUser({
            id: userId,
            email: email,
            first_name: metadata?.first_name || null,
            last_name: metadata?.last_name || null,
            company_id: null
          });
          return;
        }
        throw profileError;
      }
        
      if (profileData) {
        console.log("Profile found:", profileData);
        // Profile exists, use it
        setUser({
          id: userId,
          email: email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          company_id: profileData.company_id
        });
      } else {
        console.log("No profile found, creating new one");
        // No profile exists, try to create one
        const firstName = metadata?.first_name || null;
        const lastName = metadata?.last_name || null;
        
        // For admin, try to assign to first company
        let companyId = null;
        if (email === 'dustin.althaus@me.com') {
          try {
            const { data: companies } = await supabase
              .from('companies')
              .select('id')
              .limit(1);
            
            if (companies && companies.length > 0) {
              companyId = companies[0].id;
              console.log("Admin user assigned to company:", companyId);
            }
          } catch (companyError) {
            console.log("Could not fetch companies:", companyError);
          }
        }
        
        // Try to create profile
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              first_name: firstName,
              last_name: lastName,
              company_id: companyId
            })
            .select()
            .single();
            
          if (createError) {
            console.log("Could not create profile:", createError);
            // Fallback to basic user data
            setUser({
              id: userId,
              email: email,
              first_name: firstName,
              last_name: lastName,
              company_id: companyId
            });
          } else {
            console.log("Profile created successfully:", newProfile);
            setUser({
              id: userId,
              email: email,
              first_name: newProfile.first_name,
              last_name: newProfile.last_name,
              company_id: newProfile.company_id
            });
          }
        } catch (createException) {
          console.log("Exception creating profile, using fallback:", createException);
          // Final fallback
          setUser({
            id: userId,
            email: email,
            first_name: firstName,
            last_name: lastName,
            company_id: companyId
          });
        }
      }
    } catch (error) {
      console.error("Critical error in profile handling:", error);
      // Emergency fallback - just set basic auth data
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const email = sessionData?.session?.user?.email || '';
        const metadata = sessionData?.session?.user?.user_metadata || {};
        
        setUser({
          id: userId,
          email: email,
          first_name: metadata?.first_name || null,
          last_name: metadata?.last_name || null,
          company_id: null
        });
      } catch (emergencyError) {
        console.error("Emergency fallback failed:", emergencyError);
        setUser({
          id: userId,
          email: '',
          first_name: null,
          last_name: null,
          company_id: null
        });
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
          await handleProfileData(session.user.id);
        } else {
          if (mounted) {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
        
        if (mounted) setLoadingAuth(false);
        
        // Set up auth state listener
        if (mounted) {
          const { data } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              console.log('Auth state changed:', event, session?.user?.id);
              if (session) {
                setIsAuthenticated(true);
                setTimeout(async () => {
                  if (mounted) {
                    await handleProfileData(session.user.id);
                  }
                }, 100);
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
