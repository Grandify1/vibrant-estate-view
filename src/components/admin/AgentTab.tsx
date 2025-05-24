
import React, { useState } from 'react';
import { useAgents } from '@/hooks/useAgents';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, User, Edit } from 'lucide-react';
import { AgentForm } from './AgentForm';

interface Agent {
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

export const AgentTab = () => {
  const { company } = useAuth();
  const { agents, loading, addAgent, updateAgent, deleteAgent } = useAgents(company?.id || '');
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const handleSubmit = async (formData: any) => {
    console.log("Submitting form data:", formData);
    
    let result;
    if (editingAgent) {
      // Bearbeiten
      result = await updateAgent(editingAgent.id, formData);
    } else {
      // Neu hinzufügen
      result = await addAgent({
        ...formData,
        company_id: company?.id || ''
      });
    }

    if (result.success) {
      setShowForm(false);
      setEditingAgent(null);
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAgent(null);
  };

  const handleDelete = async (agentId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Makler löschen möchten?')) {
      await deleteAgent(agentId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Makler verwalten</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Neuen Makler hinzufügen
        </Button>
      </div>

      {showForm && (
        <AgentForm
          agent={editingAgent || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={!!editingAgent}
        />
      )}

      <div className="grid gap-4">
        {agents.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-muted-foreground font-medium">Keine Makler gefunden</p>
              <p className="text-sm text-muted-foreground mt-2">
                Fügen Sie Ihren ersten Makler hinzu, um loszulegen.
              </p>
            </CardContent>
          </Card>
        ) : (
          agents.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      {agent.image_url ? (
                        <img 
                          src={agent.image_url} 
                          alt={`${agent.first_name} ${agent.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {agent.first_name} {agent.last_name}
                      </h3>
                      {agent.position && (
                        <p className="text-sm text-muted-foreground">{agent.position}</p>
                      )}
                      <div className="flex flex-col space-y-1 mt-2 text-sm">
                        {agent.email && (
                          <span className="text-muted-foreground">{agent.email}</span>
                        )}
                        {agent.phone && (
                          <span className="text-muted-foreground">{agent.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(agent)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(agent.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AgentTab;
