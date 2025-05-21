
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface AdminHeaderProps {
  onCreateNew: () => void;
  onLogout: () => void;
  isListView: boolean;
  isOffline: boolean;
  lastError: string | null;
  onRetry: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onCreateNew, 
  onLogout, 
  isListView, 
  isOffline, 
  lastError, 
  onRetry 
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Immobilien Admin-Portal</h1>
        <div className="flex space-x-4">
          {isListView && (
            <Button 
              onClick={onCreateNew}
              disabled={isOffline}
            >
              Neue Immobilie
            </Button>
          )}
          <Button variant="outline" onClick={onLogout}>
            Abmelden
          </Button>
        </div>
      </div>
      
      {isOffline && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Sie sind offline. Einige Funktionen sind möglicherweise nicht verfügbar. 
                <button 
                  onClick={onRetry}
                  className="ml-2 font-medium text-yellow-700 underline"
                >
                  Erneut versuchen
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {lastError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {lastError}
                <button 
                  onClick={onRetry}
                  className="ml-2 font-medium text-red-700 underline"
                >
                  Erneut versuchen
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
