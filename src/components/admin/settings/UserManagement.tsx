
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CompanyUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

const UserManagement = () => {
  const { company } = useAuth();
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Benutzer für das aktuelle Unternehmen laden
  const loadCompanyUsers = async () => {
    if (!company?.id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Benutzerprofile für dieses Unternehmen abrufen
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, company_id')
        .eq('company_id', company.id);
      
      if (error) {
        console.error("Error loading profiles:", error);
        toast.error("Fehler beim Laden der Benutzer");
        setLoading(false);
        return;
      }
      
      if (!data || data.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Map data to users array with email info
      const usersWithEmail: CompanyUser[] = [];
      
      for (const profile of data) {
        try {
          // Get user info from auth.users via admin functions is not accessible
          // Instead, we'll use what we have from the profile
          
          usersWithEmail.push({
            id: profile.id,
            email: 'Email nicht verfügbar', // We can't get email directly from profiles
            first_name: profile.first_name,
            last_name: profile.last_name
          });
        } catch (err) {
          console.error("Error processing user:", err);
        }
      }
      
      setUsers(usersWithEmail);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error);
      toast.error('Benutzer konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadCompanyUsers();
  }, [company]);
  
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    
    try {
      if (!email || !company?.id) {
        toast.error("E-Mail-Adresse und Unternehmen sind erforderlich");
        return;
      }
      
      // Create a temporary password for the invited user
      const tempPassword = Math.random().toString(36).slice(-10);
      
      // Create the user in Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (error) throw error;
      
      // Create profile for the user with company association
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            company_id: company.id
          });
          
        if (profileError) throw profileError;
      }
      
      toast.success(`Benutzer ${email} wurde erfolgreich eingeladen`);
      setDialogOpen(false);
      setEmail('');
      setFirstName('');
      setLastName('');
      loadCompanyUsers();
    } catch (error: any) {
      console.error('Fehler beim Einladen:', error);
      toast.error(`Der Benutzer konnte nicht eingeladen werden: ${error.message}`);
    } finally {
      setIsInviting(false);
    }
  };
  
  const handleRemoveUser = async (userId: string, userName: string) => {
    if (!confirm(`Möchten Sie den Benutzer ${userName} wirklich entfernen?`)) {
      return;
    }
    
    try {
      // Update profile to remove company association
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ company_id: null })
        .eq('id', userId);
        
      if (profileError) throw profileError;
      
      toast.success(`Benutzer ${userName} entfernt`);
      loadCompanyUsers();
    } catch (error: any) {
      console.error('Fehler beim Entfernen des Benutzers:', error);
      toast.error(`Der Benutzer konnte nicht entfernt werden: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Benutzer</CardTitle>
            <CardDescription>
              Verwalten Sie den Zugriff auf Ihr Unternehmensprofil
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> Benutzer einladen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neuen Benutzer einladen</DialogTitle>
                <DialogDescription>
                  Laden Sie einen neuen Benutzer zu Ihrem Unternehmenskonto ein.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInviteUser} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Vorname</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nachname</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button type="submit" disabled={isInviting}>
                    {isInviting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Einladen...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Einladung senden
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name || ''} {user.last_name || ''}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(user.id, `${user.first_name || ''} ${user.last_name || ''}`)}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Entfernen</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Keine Benutzer gefunden. Laden Sie Benutzer ein, um gemeinsam zu arbeiten.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
