
import React, { useState } from 'react';
import AgentList from '@/components/admin/AgentList';
import AgentForm from '@/components/admin/AgentForm';
import { Button } from '@/components/ui/button';
import { useAgents } from '@/hooks/useAgents';
import { Agent } from '@/types/agent';

enum AgentView {
  LIST = 'list',
  CREATE = 'create',
  EDIT = 'edit',
}

const AgentTab: React.FC = () => {
  const [view, setView] = useState<AgentView>(AgentView.LIST);
  const [editAgentId, setEditAgentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addAgent, updateAgent, deleteAgent, getAgent } = useAgents();
  
  const handleCreateNew = () => {
    setView(AgentView.CREATE);
  };
  
  const handleEdit = (id: string) => {
    setEditAgentId(id);
    setView(AgentView.EDIT);
  };
  
  const handleDelete = async (id: string) => {
    await deleteAgent(id);
  };
  
  const handleSubmit = async (data: Omit<Agent, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsSubmitting(true);
      
      if (view === AgentView.CREATE) {
        await addAgent(data);
      } else if (view === AgentView.EDIT && editAgentId) {
        await updateAgent(editAgentId, data);
      }
      
      setView(AgentView.LIST);
      setEditAgentId(null);
    } catch (error) {
      console.error('Error submitting agent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setView(AgentView.LIST);
    setEditAgentId(null);
  };
  
  const getAgentForEdit = () => {
    if (!editAgentId) return undefined;
    return getAgent(editAgentId);
  };
  
  return (
    <div>
      {view === AgentView.LIST && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Makler</h2>
            <Button onClick={handleCreateNew}>+ Neuer Makler</Button>
          </div>
          <AgentList 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
      
      {(view === AgentView.CREATE || view === AgentView.EDIT) && (
        <>
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="mr-4"
            >
              ← Zurück zur Übersicht
            </Button>
            <h2 className="text-2xl font-bold">
              {view === AgentView.CREATE ? 'Neuen Makler erstellen' : 'Makler bearbeiten'}
            </h2>
          </div>
          
          <AgentForm 
            agent={getAgentForEdit()}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={view === AgentView.EDIT}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </div>
  );
};

export default AgentTab;
