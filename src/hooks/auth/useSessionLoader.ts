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
      
      // Try to get existing profile first (this will work for all users including admin)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (profileError) {
        console.error("Profile fetch error:", profileError.message);
        
        // Special case for the admin user - don't throw, try to create a profile
        if (email === 'dustin.althaus@me.com') {
          console.log("Admin user detected, attempting to create profile");
          await createAdminProfile(userId, email, metadata);
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
        return;
      }

      // No profile exists, create one
      console.log("No profile found, creating new one");
      const firstName = metadata?.first_name || null;
      const lastName = metadata?.last_name || null;
      
      // For admin, try to assign to first company (Grandify)
      let companyId = null;
      if (email === 'dustin.althaus@me.com') {
        console.log("Admin user detected, fetching Grandify company");
        try {
          const { data: companies, error: companiesError } = await supabase
            .from('companies')
            .select('id, name')
            .eq('name', 'Grandify')
            .maybeSingle();
          
          if (!companiesError && companies) {
            companyId = companies.id;
            console.log("Admin user assigned to Grandify company:", companyId);
          } else {
            // Fallback: get first company
            const { data: fallbackCompanies } = await supabase
              .from('companies')
              .select('id, name')
              .order('created_at', { ascending: false })
              .limit(1);
            
            if (fallbackCompanies && fallbackCompanies.length > 0) {
              companyId = fallbackCompanies[0].id;
              console.log("Admin user assigned to first company:", companyId, fallbackCompanies[0].name);
            }
          }
        } catch (companyError) {
          console.error("Could not fetch companies:", companyError);
        }
      }
      
      // Try to create profile with direct insert
      try {
        console.log("Creating profile with data:", { id: userId, first_name: firstName, last_name: lastName, company_id: companyId });
        
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
          console.error("Could not create profile:", createError);
          // Try RPC for admin user
          if (email === 'dustin.althaus@me.com') {
            await createAdminProfile(userId, email, metadata);
            return;
          }
          
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
        console.error("Exception creating profile, using fallback:", createException);
        
        // Try RPC for admin user
        if (email === 'dustin.althaus@me.com') {
          await createAdminProfile(userId, email, metadata);
          return;
        }
        
        // Final fallback
        setUser({
          id: userId,
          email: email,
          first_name: firstName,
          last_name: lastName,
          company_id: companyId
        });
      }
    } catch (error) {
      console.error("Critical error in profile handling:", error);
      // Emergency fallback - just set basic auth data
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const email = sessionData?.session?.user?.email || '';
        const metadata = sessionData?.session?.user?.user_metadata || {};
        
        // Special handling for admin user as a last resort
        if (email === 'dustin.althaus@me.com') {
          await createAdminProfile(userId, email, metadata);
          return;
        }
        
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
  
  // Special function to create admin profile using RPC
  const createAdminProfile = async (userId: string, email: string, metadata: any) => {
    console.log("Attempting to create admin profile using RPC function");
    
    try {
      // Get Grandify company first
      const { data: companies } = await supabase
        .from('companies')
        .select('id')
        .eq('name', 'Grandify')
        .maybeSingle();
        
      const companyId = companies?.id;
      
      if (!companyId) {
        console.error("Could not find Grandify company for admin user");
      }
      
      // Use RPC function to create/update profile with admin privileges
      const { data, error } = await supabase.rpc('safe_update_user_profile', {
        user_id_param: userId,
        first_name_param: metadata?.first_name || 'Dustin',
        last_name_param: metadata?.last_name || 'Althaus',
        company_id_param: companyId
      });
      
      if (error) {
        console.error("Error creating admin profile via RPC:", error);
        throw error;
      }
      
      console.log("Admin profile created/updated via RPC:", data);
      
      // Set user with company ID
      setUser({
        id: userId,
        email: email,
        first_name: metadata?.first_name || 'Dustin',
        last_name: metadata?.last_name || 'Althaus',
        company_id: companyId
      });
      
      // Show success message
      if (companyId) {
        toast.success("Admin-Zugriff auf Grandify hergestellt");
      } else {
        toast.warning("Admin-Profil erstellt, aber keine Firma gefunden");
      }
    } catch (rpcError) {
      console.error("Admin profile creation via RPC failed:", rpcError);
      
      // Last fallback
      setUser({
        id: userId,
        email: email,
        first_name: metadata?.first_name || 'Dustin',
        last_name: metadata?.last_name || 'Althaus',
        company_id: null
      });
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
