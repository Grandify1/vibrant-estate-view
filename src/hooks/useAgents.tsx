
import { useState, useEffect } from 'react';
import { Agent, initialAgent } from '@/types/agent';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AgentsContextType = {
  agents: Agent[];
  loading: boolean;
  addAgent: (agent: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => Promise<Agent | null>;
  updateAgent: (id: string, updates: Partial<Omit<Agent, 'id' | 'created_at' | 'updated_at'>>) => Promise<boolean>;
  deleteAgent: (id: string) => Promise<boolean>;
};

export const useAgents = (): AgentsContextType => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const { company } = useAuth();

  // Load agents when company changes
  useEffect(() => {
    if (!company?.id) {
      setAgents([]);
      setLoading(false);
      return;
    }

    loadAgents();
  }, [company?.id]);

  // Load agents from database
  const loadAgents = async () => {
    if (!company?.id) return;

    try {
      setLoading(true);
      console.log("Loading agents for company:", company.id);

      // Fetch agents data
      const { data: agentsData, error } = await supabase
        .from('agents')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
        return;
      }

      console.log("Agents loaded:", agentsData?.length || 0);
      setAgents(agentsData || []);
    } catch (error) {
      console.error("Error loading agents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new agent
  const addAgent = async (agent: Omit<Agent, 'id' | 'created_at' | 'updated_at'>): Promise<Agent | null> => {
    if (!company?.id) {
      toast.error("Kein Unternehmen zugeordnet");
      return null;
    }

    try {
      console.log("Adding agent to company:", company.id, agent);

      // Ensure company_id is set
      const newAgent = {
        ...agent,
        company_id: company.id
      };

      const { data, error } = await supabase
        .from('agents')
        .insert(newAgent)
        .select();

      if (error) {
        console.error("Error adding agent:", error);
        toast.error(`Fehler beim Erstellen des Maklers: ${error.message}`);
        return null;
      }

      if (!data || data.length === 0) {
        toast.error("Fehler beim Erstellen des Maklers");
        return null;
      }

      // Update local state
      const createdAgent = data[0] as Agent;
      setAgents(prevAgents => [createdAgent, ...prevAgents]);
      toast.success("Makler erfolgreich erstellt!");
      return createdAgent;
    } catch (error: any) {
      console.error("Unexpected error adding agent:", error);
      toast.error(`Ein unerwarteter Fehler ist aufgetreten: ${error.message}`);
      return null;
    }
  };

  // Update existing agent
  const updateAgent = async (
    id: string,
    updates: Partial<Omit<Agent, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> => {
    try {
      console.log("Updating agent:", id, updates);

      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        console.error("Error updating agent:", error);
        toast.error(`Fehler beim Aktualisieren des Maklers: ${error.message}`);
        return false;
      }

      if (!data || data.length === 0) {
        toast.error("Fehler beim Aktualisieren des Maklers");
        return false;
      }

      // Update local state
      const updatedAgent = data[0] as Agent;
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === id ? updatedAgent : agent
        )
      );
      
      toast.success("Makler erfolgreich aktualisiert!");
      return true;
    } catch (error: any) {
      console.error("Unexpected error updating agent:", error);
      toast.error(`Ein unerwarteter Fehler ist aufgetreten: ${error.message}`);
      return false;
    }
  };

  // Delete agent
  const deleteAgent = async (id: string): Promise<boolean> => {
    try {
      console.log("Deleting agent:", id);

      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting agent:", error);
        toast.error(`Fehler beim Löschen des Maklers: ${error.message}`);
        return false;
      }

      // Update local state
      setAgents(prevAgents => 
        prevAgents.filter(agent => agent.id !== id)
      );
      
      toast.success("Makler erfolgreich gelöscht!");
      return true;
    } catch (error: any) {
      console.error("Unexpected error deleting agent:", error);
      toast.error(`Ein unerwarteter Fehler ist aufgetreten: ${error.message}`);
      return false;
    }
  };

  return {
    agents,
    loading,
    addAgent,
    updateAgent,
    deleteAgent
  };
};

export function AgentsProvider({ children }: { children: React.ReactNode }) {
  const agents = useAgents();
  
  return (
    <AgentsContext.Provider value={agents}>
      {children}
    </AgentsContext.Provider>
  );
}

// Create context for agents
import { createContext, useContext } from 'react';

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export const useAgentsContext = () => {
  const context = useContext(AgentsContext);
  if (context === undefined) {
    throw new Error("useAgentsContext must be used within an AgentsProvider");
  }
  return context;
};
