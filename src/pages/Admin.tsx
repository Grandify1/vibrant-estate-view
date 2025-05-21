import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyForm from "@/components/admin/PropertyForm";
import PropertyList from "@/components/admin/PropertyList";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/types/property";
import { toast } from "sonner";

enum AdminView {
  LIST = "list",
  CREATE = "create",
  EDIT = "edit",
}

const AdminPage = () => {
  const { isAuthenticated, login, logout, setAdminPassword, hasSetPassword } = useAuth();
  const { properties, addProperty, updateProperty, deleteProperty, getProperty, setPropertyStatus } = useProperties();
  
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adminView, setAdminView] = useState<AdminView>(AdminView.LIST);
  const [editPropertyId, setEditPropertyId] = useState<string | null>(null);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(password);
    setPassword("");
  };
  
  const handlePasswordSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      toast.error("Das Passwort sollte mindestens 4 Zeichen lang sein.");
      return;
    }
    setAdminPassword(newPassword);
    setNewPassword("");
  };
  
  const handlePropertySubmit = (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    try {
      // Ensure propertyData contains the status field
      const dataWithStatus = {
        ...propertyData,
        status: propertyData.status || 'active'
      };
      
      console.log("Property data before saving:", dataWithStatus);
      
      if (adminView === AdminView.CREATE) {
        console.log("Adding new property:", dataWithStatus);
        addProperty(dataWithStatus);
      } else if (adminView === AdminView.EDIT && editPropertyId) {
        console.log("Updating property:", editPropertyId, dataWithStatus);
        updateProperty(editPropertyId, dataWithStatus);
      }
      setAdminView(AdminView.LIST);
      setEditPropertyId(null);
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error("Ein Fehler ist aufgetreten");
    }
  };
  
  const handleEditProperty = (id: string) => {
    setEditPropertyId(id);
    setAdminView(AdminView.EDIT);
  };
  
  const handleDeleteProperty = (id: string) => {
    deleteProperty(id);
  };
  
  const getEditProperty = () => {
    if (!editPropertyId) return undefined;
    return getProperty(editPropertyId);
  };
  
  const handleCancel = () => {
    setAdminView(AdminView.LIST);
    setEditPropertyId(null);
  };

  const renderSetPassword = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin-Portal einrichten</CardTitle>
          <CardDescription>
            Bitte legen Sie ein Passwort für den Zugriff auf das Admin-Portal fest.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSet}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Passwort festlegen"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Passwort festlegen
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );

  const renderLogin = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin-Portal</CardTitle>
          <CardDescription>
            Bitte geben Sie Ihr Admin-Passwort ein, um fortzufahren.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Anmelden
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );

  const renderAdmin = () => (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Immobilien Admin-Portal</h1>
        <div className="flex space-x-4">
          {adminView === AdminView.LIST && (
            <Button onClick={() => setAdminView(AdminView.CREATE)}>
              Neue Immobilie
            </Button>
          )}
          <Button variant="outline" onClick={logout}>
            Abmelden
          </Button>
        </div>
      </div>
      
      {adminView === AdminView.LIST && (
        <Tabs defaultValue="properties">
          <TabsList className="mb-6">
            <TabsTrigger value="properties">Immobilien</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties">
            <PropertyList 
              properties={properties} 
              onEdit={handleEditProperty} 
              onDelete={handleDeleteProperty}
              onChangeStatus={setPropertyStatus}
            />
          </TabsContent>
          
          <TabsContent value="embed">
            <Card>
              <CardHeader>
                <CardTitle>Embed Code</CardTitle>
                <CardDescription>
                  Kopieren Sie diesen Code und fügen Sie ihn auf Ihrer Website ein, um die Immobilienübersicht anzuzeigen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                  <pre className="text-sm"><code>{`<iframe src="${window.location.origin}/embed" width="100%" height="800" frameborder="0"></iframe>`}</code></pre>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {
                  navigator.clipboard.writeText(`<iframe src="${window.location.origin}/embed" width="100%" height="800" frameborder="0"></iframe>`);
                  alert("Code in die Zwischenablage kopiert!");
                }}>
                  In Zwischenablage kopieren
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {(adminView === AdminView.CREATE || adminView === AdminView.EDIT) && (
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
              {adminView === AdminView.CREATE ? 'Neue Immobilie erstellen' : 'Immobilie bearbeiten'}
            </h2>
          </div>
          <PropertyForm 
            property={getEditProperty()}
            onSubmit={handlePropertySubmit}
            onCancel={handleCancel}
            isEditing={adminView === AdminView.EDIT}
          />
        </>
      )}
    </div>
  );

  // Render flow based on auth state
  if (!hasSetPassword) {
    return renderSetPassword();
  }

  if (!isAuthenticated) {
    return renderLogin();
  }

  return renderAdmin();
};

export default AdminPage;
