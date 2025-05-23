
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser, Company } from "./types";
import { toast } from "sonner";

export const useCompany = (user: AuthUser | null) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  // Load company data if user is authenticated
  const loadCompany = async () => {
    if (!user) return;
    
    try {
      setLoadingCompany(true);
      
      console.log("useCompany: Loading company for user:", user.id);
      
      // Use the safe RPC function to get profile data
      const { data: profileData, error: profileError } = await supabase
        .rpc('safe_update_user_profile', {
          user_id_param: user.id,
          first_name_param: user.first_name || '',
          last_name_param: user.last_name || '',
          company_id_param: null // Don't update company_id, just get current data
        });
      
      if (profileError) {
        console.error("Error fetching profile via RPC:", profileError);
        setLoadingCompany(false);
        return;
      }
      
      // Parse the JSON response and type it correctly
      const profile = profileData as { company_id?: string } | null;
      
      if (profile?.company_id) {
        console.log("Found company_id in profile:", profile.company_id);
        
        // Fetch company data
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profile.company_id)
          .maybeSingle();
          
        if (companyError) {
          console.error("Error fetching company:", companyError);
          setLoadingCompany(false);
          return;
        }
          
        if (companyData) {
          console.log("Company data loaded successfully:", companyData);
          setCompany(companyData);
          
          // Update the user object with company_id
          user.company_id = profile.company_id;
        } else {
          console.warn("No company found with ID:", profile.company_id);
        }
      } else {
        console.log("User has no company assigned in profile");
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
      
      // Step 1: Insert company data with our open RLS policy
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
        toast.warning("Unternehmen erstellt, aber Profil konnte nicht aktualisiert werden");
        // Don't return null here, we already created the company
      } else {
        // Parse the JSON response and update user object with company_id
        const profile = profileData as { company_id?: string } | null;
        if (profile?.company_id) {
          user.company_id = profile.company_id;
        }
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
