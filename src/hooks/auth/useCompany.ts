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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setLoadingCompany(false);
        return;
      }
      
      if (profileData?.company_id) {
        // Fetch company data
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profileData.company_id)
          .maybeSingle();
          
        if (companyError) {
          console.error("Error fetching company:", companyError);
          setLoadingCompany(false);
          return;
        }
          
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
      
      // Step 2: Update user profile with company_id
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          company_id: newCompany.id,
          first_name: user.first_name || null,
          last_name: user.last_name || null
        });
        
      if (profileError) {
        console.error("Fehler bei der Profilaktualisierung:", profileError);
        toast.warning("Unternehmen erstellt, aber Profil konnte nicht aktualisiert werden");
        // Don't return null here, we already created the company
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
