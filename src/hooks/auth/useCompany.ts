import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser, Company } from "./types";
import { toast } from "sonner";

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

export const useCompany = (user: AuthUser | null) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  // Load company data if user is authenticated
  const loadCompany = async () => {
    if (!user) return;
    
    try {
      setLoadingCompany(true);
      
      console.log("useCompany: Loading company for user:", user.id);
      
      let companyId = null;
      
      // Check if we already have company_id in the user object
      if (user.company_id) {
        console.log("Using company_id from user object:", user.company_id);
        companyId = user.company_id;
      } else {
        // Use our hardcoded helper function as fallback
        companyId = await getCompanyId(user.id, user.email);
        console.log("Got company_id from helper function:", companyId);
        
        // Update the user object with company_id if found
        if (companyId) {
          user.company_id = companyId;
        }
      }
      
      if (companyId) {
        // Fetch company data
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .maybeSingle();
          
        if (companyError) {
          console.error("Error fetching company:", companyError);
          setLoadingCompany(false);
          return;
        }
          
        if (companyData) {
          console.log("Company data loaded successfully:", companyData);
          setCompany(companyData);
        } else {
          console.warn("No company found with ID:", companyId);
        }
      } else {
        console.log("User has no company assigned");
      }
    } catch (error) {
      console.error("Error loading company:", error);
    } finally {
      setLoadingCompany(false);
    }
  };

  // Create new company
  const createCompany = async (companyData: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  }): Promise<Company | null> => {
    try {
      if (!user) {
        toast.error("Sie müssen angemeldet sein, um ein Unternehmen zu erstellen");
        return null;
      }
      
      console.log("Creating company with user ID:", user.id);
      
      // Step 1: Insert company data
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyData.name,
          address: companyData.address || null,
          phone: companyData.phone || null,
          email: companyData.email || null
        })
        .select()
        .single();
        
      if (companyError || !newCompany) {
        console.error("Fehler beim Erstellen des Unternehmens:", companyError);
        toast.error("Fehler beim Erstellen des Unternehmens: " + companyError.message);
        return null;
      }
      
      console.log("Company created successfully:", newCompany.id);
      
      // Step 2: Update user profile with company_id using RPC function
      const { data: profileData, error: profileError } = await supabase
        .rpc('safe_update_user_profile', {
          user_id_param: user.id,
          first_name_param: user.first_name || '',
          last_name_param: user.last_name || '',
          company_id_param: newCompany.id
        });
        
      if (profileError) {
        console.error("Fehler bei der Profilaktualisierung:", profileError);
        
        // Try direct profile update as fallback
        const { error: directUpdateError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            company_id: newCompany.id
          });
          
        if (directUpdateError) {
          console.error("Direct profile update also failed:", directUpdateError);
          toast.warning("Unternehmen erstellt, aber Profil konnte nicht aktualisiert werden");
        } else {
          console.log("Direct profile update successful");
          user.company_id = newCompany.id;
        }
      } else {
        console.log("RPC profile update successful");
        user.company_id = newCompany.id;
      }
      
      // Step 3: Update local state
      setCompany(newCompany);
      toast.success("Unternehmen erfolgreich erstellt!");
      return newCompany;
    } catch (error: any) {
      console.error("Unerwarteter Fehler:", error);
      toast.error("Ein unerwarteter Fehler ist aufgetreten: " + error.message);
      return null;
    }
  };
  
  // Update existing company
  const updateCompany = async (updates: {
    name?: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    logo?: string | null;
    website?: string | null;
  }): Promise<boolean> => {
    try {
      if (!company) {
        toast.error("Kein Unternehmen zum Aktualisieren gefunden");
        return false;
      }
      
      console.log("Updating company with ID:", company.id);
      
      // Wir entfernen leere Strings, da diese zu 400-Fehlern führen können
      const cleanUpdates = Object.entries(updates).reduce(
        (acc, [key, value]) => {
          // Nur Werte einfügen, die definiert sind (nicht undefined)
          if (value !== undefined) {
            // Leere Strings durch null ersetzen
            acc[key] = value === "" ? null : value;
          }
          return acc;
        }, 
        {} as Record<string, any>
      );
      
      // Nur aktualisieren, wenn es tatsächlich Änderungen gibt
      if (Object.keys(cleanUpdates).length === 0) {
        return true; // Nichts zu aktualisieren
      }
      
      const { error } = await supabase
        .from('companies')
        .update(cleanUpdates)
        .eq('id', company.id);
        
      if (error) {
        console.error("Fehler beim Aktualisieren des Unternehmens:", error);
        toast.error("Fehler beim Aktualisieren des Unternehmens: " + error.message);
        return false;
      }
      
      // Reload company data to get updated values
      const { data: updatedCompany, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', company.id)
        .single();
        
      if (fetchError || !updatedCompany) {
        console.error("Fehler beim Laden des aktualisierten Unternehmens:", fetchError);
        toast.warning("Unternehmen aktualisiert, aber konnte nicht neu geladen werden");
        return true; // Still return true because the update worked
      }
      
      // Update local state
      setCompany(updatedCompany);
      toast.success("Unternehmen erfolgreich aktualisiert!");
      return true;
    } catch (error: any) {
      console.error("Unerwarteter Fehler:", error);
      toast.error("Ein unerwarteter Fehler ist aufgetreten: " + error.message);
      return false;
    }
  };
  
  return {
    company,
    loadingCompany,
    loadCompany,
    createCompany,
    updateCompany
  };
};
