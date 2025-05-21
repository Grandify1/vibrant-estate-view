
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Agent, initialAgent } from "@/types/agent";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface AgentsContextType {
  agents: Agent[];
  addAgent: (agent: Omit<Agent, "id" | "created_at" | "updated_at">) => Promise<Agent | null>;
  updateAgent: (id: string, agent: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  getAgent: (id: string) => Agent | undefined;
  loading: boolean;
  lastError: string | null;
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export function AgentsProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);
  const { company } = useAuth();
  
  // Makler aus Supabase laden
  const fetchAgents = async () => {
    if (!company) {
      setAgents([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setLastError(null);
      
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching agents:', error);
        setLastError(`Fehler beim Laden der Makler: ${error.message}`);
        toast.error("Fehler beim Laden der Makler");
        return;
      }
      
      setAgents(data as Agent[]);
    } catch (error: any) {
      console.error('Error in fetchAgents:', error);
      setLastError(`Fehler beim Laden der Makler: ${error.message}`);
      toast.error("Fehler beim Laden der Makler");
    } finally {
      setLoading(false);
    }
  };
  
  // Beim Laden der Komponente oder Änderung des Unternehmens Makler laden
  useEffect(() => {
    fetchAgents();
  }, [company]);
  
  // Neuen Makler hinzufügen
  const addAgent = async (agentData: Omit<Agent, "id" | "created_at" | "updated_at">): Promise<Agent | null> => {
    if (!company) {
      toast.error("Sie müssen einem Unternehmen angehören, um Makler hinzuzufügen");
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('agents')
        .insert({
          ...agentData,
          company_id: company.id
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error adding agent:", error);
        setLastError(`Fehler beim Hinzufügen des Maklers: ${error.message}`);
        toast.error("Fehler beim Hinzufügen des Maklers");
        return null;
      }
      
      const newAgent = data as Agent;
      setAgents(prev => [newAgent, ...prev]);
      toast.success("Makler erfolgreich hinzugefügt");
      setLastError(null);
      
      return newAgent;
    } catch (error: any) {
      console.error("Error in addAgent:", error);
      setLastError(`Fehler beim Hinzufügen des Maklers: ${error.message}`);
      toast.error("Fehler beim Hinzufügen des Maklers");
      return null;
    }
  };
  
  // Makler aktualisieren
  const updateAgent = async (id: string, agentData: Partial<Agent>) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update(agentData)
        .eq('id', id);
      
      if (error) {
        console.error("Error updating agent:", error);
        setLastError(`Fehler beim Aktualisieren des Maklers: ${error.message}`);
        toast.error("Fehler beim Aktualisieren des Maklers");
        return;
      }
      
      // Lokale Zustandsaktualisierung
      setAgents(prev => 
        prev.map(agent => 
          agent.id === id ? { ...agent, ...agentData } : agent
        )
      );
      
      toast.success("Makler erfolgreich aktualisiert");
      setLastError(null);
    } catch (error: any) {
      console.error("Error in updateAgent:", error);
      setLastError(`Fehler beim Aktualisieren des Maklers: ${error.message}`);
      toast.error("Fehler beim Aktualisieren des Maklers");
    }
  };
  
  // Makler löschen
  const deleteAgent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting agent:", error);
        setLastError(`Fehler beim Löschen des Maklers: ${error.message}`);
        toast.error("Fehler beim Löschen des Maklers");
        return;
      }
      
      // Lokale Zustandsaktualisierung
      setAgents(prev => prev.filter(agent => agent.id !== id));
      toast.success("Makler erfolgreich gelöscht");
      setLastError(null);
    } catch (error: any) {
      console.error("Error in deleteAgent:", error);
      setLastError(`Fehler beim Löschen des Maklers: ${error.message}`);
      toast.error("Fehler beim Löschen des Maklers");
    }
  };
  
  // Makler nach ID abrufen
  const getAgent = (id: string) => {
    return agents.find(agent => agent.id === id);
  };
  
  return (
    <AgentsContext.Provider
      value={{
        agents,
        addAgent,
        updateAgent,
        deleteAgent,
        getAgent,
        loading,
        lastError
      }}
    >
      {children}
    </AgentsContext.Provider>
  );
}

export function useAgents() {
  const context = useContext(AgentsContext);
  if (!context) {
    throw new Error("useAgents must be used within an AgentsProvider");
  }
  return context;
}
