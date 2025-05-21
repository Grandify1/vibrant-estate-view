
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
      
      // First, check if user has a company_id in profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileData?.company_id) {
        // Fetch company data
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profileData.company_id)
          .maybeSingle();
          
        if (companyData) {
          setCompany(companyData);
        }
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
  }): Promise<boolean> => {
    try {
      if (!user) {
        toast.error("Sie müssen angemeldet sein, um ein Unternehmen zu erstellen");
        return false;
      }
      
      console.log("Creating company with user ID:", user.id);
      
      // Insert company data - this should be allowed by our new RLS policy
      const { data: newCompany, error } = await supabase
        .from('companies')
        .insert({
          name: companyData.name,
          address: companyData.address || null,
          phone: companyData.phone || null,
          email: companyData.email || null
        })
        .select()
        .single();
        
      if (error || !newCompany) {
        console.error("Fehler beim Erstellen des Unternehmens:", error);
        toast.error("Fehler beim Erstellen des Unternehmens");
        return false;
      }
      
      console.log("Company created successfully:", newCompany.id);
      
      // Now handle the profile update/creation
      try {
        // Check if profile exists first
        const { data: profileExists } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
          
        if (profileExists) {
          // Update existing profile with company_id
          console.log("Updating existing profile with company ID");
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ company_id: newCompany.id })
            .eq('id', user.id);
            
          if (updateError) {
            console.error("Fehler beim Aktualisieren des Profils:", updateError);
            toast.error("Unternehmen erstellt, aber Fehler bei der Profilaktualisierung");
            // Continue anyway as the company was created
          }
        } else {
          // Create new profile with company_id
          console.log("Creating new profile with company ID");
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              company_id: newCompany.id,
              first_name: user.first_name || null,
              last_name: user.last_name || null
            });
            
          if (insertError) {
            console.error("Fehler beim Erstellen des Profils:", insertError);
            toast.error("Unternehmen erstellt, aber Fehler beim Erstellen des Profils");
            // Continue anyway as the company was created
          }
        }
      } catch (profileError) {
        console.error("Fehler bei der Profilverwaltung:", profileError);
        // Continue anyway as the company was created
      }
      
      // Update local state
      setCompany(newCompany);
      toast.success("Unternehmen erfolgreich erstellt!");
      return true;
    } catch (error) {
      console.error("Unerwarteter Fehler:", error);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
      return false;
    }
  };
  
  return {
    company,
    loadingCompany,
    loadCompany,
    createCompany
  };
};
