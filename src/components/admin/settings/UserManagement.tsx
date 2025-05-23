
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Copy, Key, Loader2, Trash2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithAuth | null>(null);
  const [companySearch, setCompanySearch] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [formData, setFormData] = useState<UserForm>({
    email: '',
    first_name: '',
    last_name: '',
    company_id: '',
    password: ''
  });

  const DEFAULT_PASSWORD = 'PasswortZurücksetzen123#';

  useEffect(() => {
    console.log("UserManagement: Loading data...");
    loadUsers();
    loadCompanies();
  }, []);

  useEffect(() => {
    // Filter companies based on search
    if (companySearch.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(companySearch.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [companySearch, companies]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log("Loading users...");
      
      // Use the RPC function
      const { data: users, error } = await supabase.rpc('get_all_users_with_profiles');

      if (error) throw error;

      console.log("Users loaded:", users?.length || 0);
      setUsers(users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Fehler beim Laden der Benutzer');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');

      if (error) {
        throw error;
      }
      
      if (data && Array.isArray(data)) {
        setCompanies(data);
        setFilteredCompanies(data);
      } else {
        setCompanies([]);
        setFilteredCompanies([]);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Fehler beim Laden der Unternehmen');
      setCompanies([]);
      setFilteredCompanies([]);
    } finally {
      setCompaniesLoading(false);
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
    setCompanySearch('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("UserManagement: Form submission started");
    
    // Validate all required fields
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

    // Ensure password is not empty for new users
    if (!editingUser && !formData.password.trim()) {
      toast.error('Passwort ist erforderlich');
      return;
    }

    setLoading(true);
    try {
      if (editingUser) {
        console.log("UserManagement: Updating user:", editingUser.id, "with company:", formData.company_id);
        
        // Use the safe update function
        const { data, error } = await supabase.rpc('safe_update_user_profile', {
          user_id_param: editingUser.id,
          first_name_param: formData.first_name,
          last_name_param: formData.last_name,
          company_id_param: formData.company_id || null
        });

        console.log("UserManagement: Update result:", { success: !error, hasData: !!data });

        if (error) {
          throw error;
        }
        
        toast.success('Benutzer erfolgreich aktualisiert');
      } else {
        console.log("UserManagement: Creating new user");
        
        // Create new user via admin API function with proper payload
        const payload = {
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          company_id: formData.company_id || null
        };
        
        const { data, error } = await supabase.functions.invoke('create-user', {
          body: payload
        });

        if (error) {
          throw error;
        }
        
        if (!data?.success) {
          const errorMessage = data?.message || 'Unbekannter Fehler beim Erstellen des Benutzers';
          throw new Error(errorMessage);
        }
        
        console.log("UserManagement: User created successfully");
        toast.success('Benutzer erfolgreich erstellt');
      }

      await loadUsers();
      setShowCreateDialog(false);
      setEditingUser(null);
      resetForm();
    } catch (error: any) {
      console.error('UserManagement: Error saving user:', error);
      toast.error('Fehler beim Speichern des Benutzers: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserWithAuth) => {
    console.log("UserManagement: Editing user:", user.id);
    
    setEditingUser(user);
    setFormData({
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      company_id: user.company_id || '',
      password: DEFAULT_PASSWORD
    });
    setCompanySearch(user.company_name || '');
    setShowCreateDialog(true);
  };

  const handleCompanySelect = (company: Company) => {
    console.log("UserManagement: Company selected:", company.name);
    setFormData({ ...formData, company_id: company.id });
    setCompanySearch(company.name);
    setShowCompanyDropdown(false);
  };

  const clearCompanySelection = () => {
    console.log("UserManagement: Company selection cleared");
    setFormData({ ...formData, company_id: '' });
    setCompanySearch('');
    setShowCompanyDropdown(false);
  };

  const handleResetPassword = async (userId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie das Passwort zurücksetzen möchten?')) {
      try {
        setLoading(true);
        
        const { data, error } = await supabase.functions.invoke('reset-password', {
          body: {
            user_id: userId,
            new_password: DEFAULT_PASSWORD
          }
        });
        
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
      
      // Delete user via admin API function
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: userId }
      });
      
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
              Alle Benutzer aus der Authentifizierung verwalten und Unternehmen zuordnen
            </CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={(open) => {
            setShowCreateDialog(open);
            if (!open) {
              setEditingUser(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                resetForm();
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Max"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Nachname *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Mustermann"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_search">Unternehmen</Label>
                  {companiesLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Lade Unternehmen...</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative">
                        <Input
                          id="company_search"
                          type="text"
                          value={companySearch}
                          onChange={(e) => {
                            setCompanySearch(e.target.value);
                            setShowCompanyDropdown(true);
                          }}
                          onFocus={() => setShowCompanyDropdown(true)}
                          placeholder="Unternehmen suchen..."
                          className="pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      
                      {showCompanyDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredCompanies.length === 0 ? (
                            <div className="px-3 py-2 text-gray-500">
                              {companySearch.trim() === '' ? 'Tippen Sie, um zu suchen...' : 'Keine Unternehmen gefunden'}
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={clearCompanySelection}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 text-gray-600 border-b"
                              >
                                Kein Unternehmen
                              </button>
                              {filteredCompanies.map((company) => (
                                <button
                                  key={company.id}
                                  type="button"
                                  onClick={() => handleCompanySelect(company)}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                >
                                  {company.name}
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {formData.company_id ? `Ausgewählt: ${companySearch}` : 'Kein Unternehmen ausgewählt'}
                  </div>
                </div>

                {!editingUser && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Standard-Passwort *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="password"
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                        {user.first_name && user.last_name ? 
                          `${user.first_name} ${user.last_name}` : 
                          <span className="text-gray-400">Name nicht gesetzt</span>
                        }
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
