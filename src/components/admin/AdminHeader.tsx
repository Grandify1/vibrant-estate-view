
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle } from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  
  return (
    <div className="bg-white border-b p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Immobilien Admin-Portal</h1>
          {user && (
            <p className="text-sm text-gray-500">
              Angemeldet als {user.email}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Abmelden
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
