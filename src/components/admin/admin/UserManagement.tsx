
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Copy, Key, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  company_id?: string;
  created_at: string;
  companies?: {
    name: string;
  };
}

interface UserWithAuth {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_id?: string;
  company_name?: string;
  created_at: string;
}

interface Company {
  id: string;
  name: string;
}

interface UserForm {
  email: string;
  first_name: string;
  last_name: string;
  company_id: string;
  password: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithAuth[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithAuth | null>(null);
  const [formData, setFormData] = useState<UserForm>({
    email: '',
    first_name: '',
    last_name: '',
    company_id: '',
    password: ''
  });

  const DEFAULT_PASSWORD = 'PasswortZurücksetzen123#';

  useEffect(() => {
    loadUsers();
    loadCompanies();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log("Loading users...");
      
      // Get profiles with company information
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          company_id,
          created_at,
          companies (
            name
          )
        `)
        .order('created_at', { ascending: false });

      console.log("Profiles response:", { profiles, profilesError });

      if (profilesError) throw profilesError;

      // Since we can't access auth.users directly, we'll work with profiles only
      const mergedUsers: UserWithAuth[] = (profiles || []).map((profile: any) => ({
        id: profile.id,
        email: `user-${profile.id.slice(0, 8)}@example.com`, // Fallback email display
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        company_id: profile.company_id || '',
        company_name: profile.companies?.name || '',
        created_at: profile.created_at
      }));

      console.log("Merged users:", mergedUsers);
      setUsers(mergedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Fehler beim Laden der Benutzer');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      console.log("Loading companies...");
      
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');

      console.log("Companies response:", { data, error });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Fehler beim Laden der Unternehmen');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      first_name: '',
      last_name: '',
      company_id: '',
      password: DEFAULT_PASSWORD
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission started with data:", formData);
    
    // CRITICAL FIX: Validate all required fields
    if (!formData.email.trim()) {
      toast.error('E-Mail ist erforderlich');
      return;
    }
    
    if (!formData.first_name.trim()) {
      toast.error('Vorname ist erforderlich');
      return;
    }
    
    if (!formData.last_name.trim()) {
      toast.error('Nachname ist erforderlich');
      return;
    }

    // CRITICAL FIX: Ensure password is not empty
    if (!editingUser && !formData.password.trim()) {
      toast.error('Passwort ist erforderlich');
      return;
    }

    setLoading(true);
    try {
      if (editingUser) {
        console.log("Updating existing user:", editingUser.id);
        
        // Update existing user profile
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            company_id: formData.company_id || null
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        toast.success('Benutzer erfolgreich aktualisiert');
      } else {
        console.log("Creating new user with payload:", {
          email: formData.email,
          password: formData.password ? "***" : "EMPTY PASSWORD",
          first_name: formData.first_name,
          last_name: formData.last_name,
          company_id: formData.company_id || null
        });
        
        // CRITICAL FIX: Create new user via admin API function with proper payload
        const payload = {
          email: formData.email,
          password: formData.password, // Ensure this is the actual password, not empty
          first_name: formData.first_name,
          last_name: formData.last_name,
          company_id: formData.company_id || null
        };
        
        console.log("Invoking create-user function with payload:", payload);
        
        const { data, error } = await supabase.functions.invoke('create-user', {
          body: payload
        });

        console.log("Create-user response:", { data, error });

        if (error) {
          console.error("Edge function error:", error);
          throw error;
        }
        
        if (!data?.success) {
          const errorMessage = data?.message || 'Unbekannter Fehler beim Erstellen des Benutzers';
          console.error("Edge function returned error:", errorMessage);
          throw new Error(errorMessage);
        }
        
        console.log("User created successfully:", data);
        toast.success('Benutzer erfolgreich erstellt');
      }

      await loadUsers();
      setShowCreateDialog(false);
      setEditingUser(null);
      resetForm();
    } catch (error: any) {
      console.error('Error saving user:', error);
      
      // Enhanced error logging for debugging
      if (error.message) {
        console.error('Error message:', error.message);
      }
      if (error.context) {
        console.error('Error context:', error.context);
      }
      
      toast.error('Fehler beim Speichern des Benutzers: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserWithAuth) => {
    console.log("Editing user:", user);
    
    setEditingUser(user);
    setFormData({
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      company_id: user.company_id || '',
      password: DEFAULT_PASSWORD
    });
    setShowCreateDialog(true);
  };

  const handleResetPassword = async (userId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie das Passwort zurücksetzen möchten?')) {
      try {
        setLoading(true);
        console.log("Resetting password for user:", userId);
        
        const { data, error } = await supabase.functions.invoke('reset-password', {
          body: {
            user_id: userId,
            new_password: DEFAULT_PASSWORD
          }
        });
        
        console.log("Reset password response:", { data, error });
        
        if (error) throw error;
        if (!data?.success) throw new Error(data?.message || 'Fehler beim Zurücksetzen des Passwortes');
        
        // Show the default password to admin
        navigator.clipboard.writeText(DEFAULT_PASSWORD);
        toast.success(`Passwort erfolgreich zurückgesetzt und in die Zwischenablage kopiert`);
      } catch (error: any) {
        console.error('Error resetting password:', error);
        toast.error('Fehler beim Zurücksetzen des Passwortes: ' + error.message);
        
        // Fallback: show default password anyway
        navigator.clipboard.writeText(DEFAULT_PASSWORD);
        toast.info(`Standard-Passwort wurde in die Zwischenablage kopiert: ${DEFAULT_PASSWORD}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      console.log("Deleting user:", userId);
      
      // Delete user via admin API function
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: userId }
      });
      
      console.log("Delete user response:", { data, error });
      
      if (error) throw error;
      if (!data?.success) throw new Error(data?.message || 'Unbekannter Fehler beim Löschen des Benutzers');
      
      toast.success('Benutzer erfolgreich gelöscht');
      await loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error('Fehler beim Löschen des Benutzers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('In Zwischenablage kopiert');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Benutzer verwalten</CardTitle>
            <CardDescription>
              Alle Benutzer im System verwalten und Unternehmen zuordnen
            </CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={(open) => {
            console.log("Dialog open state changed:", open);
            setShowCreateDialog(open);
            if (!open) {
              setEditingUser(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                console.log("Creating new user dialog opened");
                resetForm(); // CRITICAL FIX: Reset form when opening dialog
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Neuer Benutzer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen'}
                </DialogTitle>
                <DialogDescription>
                  Geben Sie die Benutzerdaten ein
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      console.log("Email changed:", e.target.value);
                      setFormData({ ...formData, email: e.target.value });
                    }}
                    placeholder="benutzer@example.com"
                    disabled={!!editingUser}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Vorname *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => {
                        console.log("First name changed:", e.target.value);
                        setFormData({ ...formData, first_name: e.target.value });
                      }}
                      placeholder="Max"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Nachname *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => {
                        console.log("Last name changed:", e.target.value);
                        setFormData({ ...formData, last_name: e.target.value });
                      }}
                      placeholder="Mustermann"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_id">Unternehmen</Label>
                  <Select 
                    value={formData.company_id} 
                    onValueChange={(value) => {
                      console.log("Company changed:", value);
                      setFormData({ ...formData, company_id: value === "none" ? "" : value });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unternehmen auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Kein Unternehmen</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!editingUser && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Standard-Passwort *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="password"
                        type="text"
                        value={formData.password}
                        onChange={(e) => {
                          console.log("Password changed:", e.target.value ? "***" : "EMPTY");
                          setFormData({ ...formData, password: e.target.value });
                        }}
                        placeholder="Passwort eingeben"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formData.password)}
                        disabled={!formData.password}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingUser ? 'Aktualisieren' : 'Erstellen'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Keine Benutzer vorhanden.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Unternehmen</TableHead>
                <TableHead>Erstellt am</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-semibold">
                        {user.first_name} {user.last_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">{user.email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(user.email)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.company_name ? (
                      <Badge variant="outline">{user.company_name}</Badge>
                    ) : (
                      <span className="text-gray-500">Kein Unternehmen</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(DEFAULT_PASSWORD)}
                        title="Standard-Passwort kopieren"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 hover:bg-red-100 border-red-200"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Benutzer löschen</AlertDialogTitle>
                            <AlertDialogDescription>
                              Sind Sie sicher, dass Sie diesen Benutzer löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
