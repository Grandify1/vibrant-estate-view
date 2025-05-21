
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Agent } from '@/types/agent';
import { useAgents } from '@/hooks/useAgents';
import AgentList from './AgentList';
import AgentForm from './AgentForm';
import { useAuth } from '@/hooks/useAuth';

const AgentTab: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { agents, addAgent, updateAgent, deleteAgent } = useAgents();
  const { company } = useAuth();
  
  const handleCreateClick = () => {
    setIsCreating(true);
    setEditingAgent(undefined);
  };
  
  const handleEditClick = (agent: Agent) => {
    setIsCreating(false);
    setEditingAgent(agent);
  };
  
  const handleFormCancel = () => {
    setIsCreating(false);
    setEditingAgent(undefined);
  };
  
  const handleSubmit = async (data: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsSubmitting(true);
      
      if (isCreating) {
        // Ensure company_id is included
        await addAgent({
          ...data,
          company_id: company?.id || ''
        });
      } else if (editingAgent) {
        await updateAgent(editingAgent.id, data);
      }
      
      setIsCreating(false);
      setEditingAgent(undefined);
    } catch (error) {
      console.error("Error submitting agent:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fix the type mismatch by extracting id from the agent
  const handleDelete = async (agentId: string) => {
    if (window.confirm("Sind Sie sicher, dass Sie diesen Makler löschen möchten?")) {
      await deleteAgent(agentId);
    }
  };
  
  return (
    <div className="space-y-6">
      {(isCreating || editingAgent) ? (
        <AgentForm 
          agent={editingAgent}
          onSubmit={handleSubmit}
          onCancel={handleFormCancel}
          isEditing={!!editingAgent}
          isSubmitting={isSubmitting}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Makler verwalten</h2>
            <Button onClick={handleCreateClick}>
              Neuen Makler erstellen
            </Button>
          </div>
          
          <AgentList 
            agents={agents}
            onEdit={(id: string) => {
              const agent = agents.find(a => a.id === id);
              if (agent) handleEditClick(agent);
            }}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default AgentTab;
