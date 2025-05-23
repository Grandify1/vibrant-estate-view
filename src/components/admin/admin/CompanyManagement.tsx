
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Users, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  created_at: string;
}

interface CompanyForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CompanyManagement = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CompanyForm>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Fehler beim Laden der Unternehmen');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Unternehmensname ist erforderlich');
      return;
    }

    setLoading(true);
    try {
      if (editingCompany) {
        const { error } = await supabase
          .from('companies')
          .update(formData)
          .eq('id', editingCompany.id);

        if (error) throw error;
        toast.success('Unternehmen erfolgreich aktualisiert');
      } else {
        const { error } = await supabase
          .from('companies')
          .insert(formData);

        if (error) throw error;
        toast.success('Unternehmen erfolgreich erstellt');
      }

      await loadCompanies();
      setShowCreateDialog(false);
      setEditingCompany(null);
      resetForm();
    } catch (error: any) {
      console.error('Error saving company:', error);
      toast.error('Fehler beim Speichern des Unternehmens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      email: company.email || '',
      phone: company.phone || '',
      address: company.address || ''
    });
    setShowCreateDialog(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Unternehmen verwalten</CardTitle>
            <CardDescription>
              Alle Unternehmen im System verwalten
            </CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={(open) => {
            setShowCreateDialog(open);
            if (!open) {
              setEditingCompany(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Neues Unternehmen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingCompany ? 'Unternehmen bearbeiten' : 'Neues Unternehmen erstellen'}
                </DialogTitle>
                <DialogDescription>
                  Geben Sie die Unternehmensdaten ein
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Unternehmensname *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="z.B. Mustermann Immobilien"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@unternehmen.de"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 123 456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Musterstraße 1, 12345 Musterstadt"
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingCompany ? 'Aktualisieren' : 'Erstellen'}
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
        ) : companies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Keine Unternehmen vorhanden. Erstellen Sie das erste Unternehmen.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Erstellt am</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-semibold">{company.name}</TableCell>
                  <TableCell>{company.email || '-'}</TableCell>
                  <TableCell>{company.phone || '-'}</TableCell>
                  <TableCell>{company.address || '-'}</TableCell>
                  <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(company)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Implementiere Benutzer-Ansicht für dieses Unternehmen
                          toast.info('Benutzer-Verwaltung für dieses Unternehmen wird implementiert');
                        }}
                      >
                        <Users className="h-4 w-4" />
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

export default CompanyManagement;
