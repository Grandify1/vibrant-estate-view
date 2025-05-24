
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position?: string;
  image_url?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export const useAgents = (companyId: string) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    if (!companyId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log("Fetching agents for company:", companyId);
      
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching agents:", error);
        throw error;
      }
      
      console.log("Agents fetched successfully:", data?.length || 0);
      setAgents(data || []);
    } catch (error: any) {
      console.error('Fehler beim Laden der Makler:', error);
      toast.error('Fehler beim Laden der Makler: ' + error.message);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const addAgent = async (agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log("Adding agent with data:", agentData);
      
      // Explizit sicherstellen, dass company_id gesetzt ist
      const agentWithCompany = {
        ...agentData,
        company_id: companyId
      };
      
      const { data, error } = await supabase
        .from('agents')
        .insert([agentWithCompany])
        .select()
        .single();

      if (error) {
        console.error("Error adding agent:", error);
        toast.error('Fehler beim Hinzufügen des Maklers: ' + error.message);
        return { success: false, error };
      }
      
      console.log("Agent added successfully:", data);
      setAgents(prev => [data, ...prev]);
      toast.success('Makler erfolgreich hinzugefügt');
      return { success: true, data };
    } catch (error: any) {
      console.error('Fehler beim Hinzufügen des Maklers:', error);
      toast.error('Fehler beim Hinzufügen des Maklers: ' + error.message);
      return { success: false, error };
    }
  };

  const updateAgent = async (agentId: string, agentData: Partial<Omit<Agent, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      console.log("Updating agent:", agentId, agentData);
      
      const { data, error } = await supabase
        .from('agents')
        .update(agentData)
        .eq('id', agentId)
        .select()
        .single();

      if (error) {
        console.error("Error updating agent:", error);
        throw error;
      }
      
      console.log("Agent updated successfully:", data);
      setAgents(prev => prev.map(agent => agent.id === agentId ? data : agent));
      toast.success('Makler erfolgreich aktualisiert');
      return { success: true, data };
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren des Maklers:', error);
      toast.error('Fehler beim Aktualisieren des Maklers: ' + error.message);
      return { success: false, error };
    }
  };

  const deleteAgent = async (agentId: string) => {
    try {
      console.log("Deleting agent:", agentId);
      
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) {
        console.error("Error deleting agent:", error);
        throw error;
      }
      
      console.log("Agent deleted successfully");
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
      toast.success('Makler erfolgreich gelöscht');
      return { success: true };
    } catch (error: any) {
      console.error('Fehler beim Löschen des Maklers:', error);
      toast.error('Fehler beim Löschen des Maklers: ' + error.message);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [companyId]);

  return {
    agents,
    loading,
    addAgent,
    updateAgent,
    deleteAgent,
    refetch: fetchAgents
  };
};
