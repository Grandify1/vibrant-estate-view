
import React from "react";
import { useAgents } from "@/hooks/useAgents";
import { Agent } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AgentListProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const AgentList: React.FC<AgentListProps> = ({ onEdit, onDelete }) => {
  const { agents, loading } = useAgents();

  const handleDelete = async (id: string) => {
    if (confirm("Möchten Sie diesen Makler wirklich löschen?")) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error("Error deleting agent:", error);
      }
    }
  };

  // Formatierungsfunktion für Telefonnummern
  const formatPhone = (phone: string | null) => {
    if (!phone) return "-";
    return phone;
  };

  // Initialen für Avatar-Fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-700">Keine Makler gefunden</h3>
        <p className="text-gray-500 mt-2">
          Erstellen Sie Ihren ersten Makler, um ihn Immobilien zuzuordnen.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {agents.map((agent) => (
        <Card key={agent.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <Avatar className="h-16 w-16">
                {agent.image_url ? (
                  <AvatarImage src={agent.image_url} alt={`${agent.first_name} ${agent.last_name}`} />
                ) : null}
                <AvatarFallback>
                  {getInitials(agent.first_name, agent.last_name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-lg">{agent.first_name} {agent.last_name}</h3>
                <p className="text-sm text-gray-500">{agent.position || "-"}</p>
                <div className="flex flex-col space-y-1 mt-2 text-sm">
                  <span>{agent.email}</span>
                  <span>{formatPhone(agent.phone)}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(agent.id)}
                >
                  Bearbeiten
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(agent.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Löschen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AgentList;
