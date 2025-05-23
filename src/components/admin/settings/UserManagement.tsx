import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Copy, Key, Loader2, Search, Plus, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
  first_name: string;
  last_name: string;
  company_id: string;
}

const UserManagement = () => {
  const { company } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithAuth[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithAuth | null>(null);
  const [companySearch, setCompanySearch] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [formData, setFormData] = useState<UserForm>({
    first_name: '',
    last_name: '',
    company_id: ''
  });

  const DEFAULT_PASSWORD = 'PasswortZurücksetzen123#';

  useEffect(() => {
    console.log("UserManagement: Component mounted, loading data...");
    loadUsers();
    loadCompanies();
  }, [company]);

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
    if (!company) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      console.log("Loading users for company:", company.id);
      
      // Nur Benutzer des eigenen Unternehmens laden
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          company_id,
          created_at,
          companies!inner(name)
        `)
        .eq('company_id', company.id);

      console.log("Company users response:", { profiles, error });

      if (error) throw error;

      // Benutzer-E-Mails aus auth.users über RPC-Funktion abrufen
      const { data: allUsers, error: usersError } = await supabase.rpc('get_all_users_with_profiles');
      
      if (usersError) {
        console.error("Error fetching users:", usersError);
        throw usersError;
      }

      // Nur Benutzer filtern, die zu diesem Unternehmen gehören
      const companyUsers = allUsers?.filter(user => user.company_id === company.id) || [];
      
      console.log("Final company users:", companyUsers);
      setUsers(companyUsers);
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
      console.log("Loading companies...");
      
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');

      console.log("Companies response:", { data, error });

      if (error) {
        console.error("Companies error:", error);
        throw error;
      }
      
      if (data && Array.isArray(data)) {
        console.log("Setting companies:", data);
        setCompanies(data);
        setFilteredCompanies(data);
      } else {
        console.warn("Companies data is not an array or is null:", data);
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
    console.log("Resetting form to default values");
    setFormData({
      first_name: '',
      last_name: '',
      company_id: ''
    });
    setCompanySearch('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    console.log("Form submission started with data:", formData);
    
    // Validate all required fields
    if (!formData.first_name.trim()) {
      toast.error('Vorname ist erforderlich');
      return;
    }
    
    if (!formData.last_name.trim()) {
      toast.error('Nachname ist erforderlich');
      return;
    }

    setLoading(true);
    try {
      console.log("Updating existing user:", editingUser.id);
      
      // Update existing user profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: editingUser.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          company_id: formData.company_id || null
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      toast.success('Benutzer erfolgreich aktualisiert');

      await loadUsers();
      setShowEditDialog(false);
      setEditingUser(null);
      resetForm();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error('Fehler beim Speichern des Benutzers: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserWithAuth) => {
    console.log("Editing user:", user);
    
    setEditingUser(user);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      company_id: user.company_id || ''
    });
    setCompanySearch(user.company_name || '');
    setShowEditDialog(true);
  };

  const handleCompanySelect = (company: Company) => {
    setFormData({ ...formData, company_id: company.id });
    setCompanySearch(company.name);
    setShowCompanyDropdown(false);
  };

  const clearCompanySelection = () => {
    setFormData({ ...formData, company_id: '' });
    setCompanySearch('');
    setShowCompanyDropdown(false);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('In Zwischenablage kopiert');
  };

  const handleCreateAgent = () => {
    // Navigate to agents tab with state to indicate we want to create a new agent
    navigate('/admin', { state: { activeTab: 'agents', action: 'create' } });
  };

  if (!company) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Sie müssen einem Unternehmen angehören, um Benutzer zu verwalten.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Benutzerverwaltung</CardTitle>
            <CardDescription>
              Verwalten Sie Benutzer und erstellen Sie Makler für Ihr Unternehmen
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateAgent} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Neuen Makler erstellen
            </Button>
            
            <Dialog open={showEditDialog} onOpenChange={(open) => {
              console.log("Dialog open state changed:", open);
              setShowEditDialog(open);
              if (!open) {
                setEditingUser(null);
                resetForm();
              }
            }}>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Benutzer bearbeiten</DialogTitle>
                  <DialogDescription>
                    Benutzerdaten bearbeiten
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                              console.log("Company search changed:", e.target.value);
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

                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Aktualisieren
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Keine Benutzer in diesem Unternehmen vorhanden.
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
