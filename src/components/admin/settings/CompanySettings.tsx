
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Save, Edit, X } from 'lucide-react';
import { toast } from 'sonner';

const CompanySettings = () => {
  const { company, createCompany, updateCompany } = useAuth();
  
  // Form state for creating or editing a company
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load company data when available
  useEffect(() => {
    if (company && !isEditing) {
      setName(company.name || '');
      setAddress(company.address || '');
      setPhone(company.phone || '');
      setEmail(company.email || '');
      setWebsite(company.website || '');
    }
  }, [company, isEditing]);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Bitte geben Sie einen Unternehmensnamen ein');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const success = await createCompany({
        name,
        address: address || undefined,
        phone: phone || undefined,
        email: email || undefined
      });
      
      if (success) {
        // Reset form
        setName('');
        setAddress('');
        setPhone('');
        setEmail('');
        setWebsite('');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Bitte geben Sie einen Unternehmensnamen ein');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const success = await updateCompany({
        name,
        address,
        phone,
        email,
        website
      });
      
      if (success) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (company) {
      // Reset form to company values
      setName(company.name || '');
      setAddress(company.address || '');
      setPhone(company.phone || '');
      setEmail(company.email || '');
      setWebsite(company.website || '');
    }
    setIsEditing(false);
  };
  
  // Display company details if exists and not editing
  if (company && !isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Unternehmensdetails</CardTitle>
            <CardDescription>
              Ihre Unternehmensdetails
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Bearbeiten
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Unternehmensname</Label>
            <div className="font-medium">{company.name}</div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company-address">Adresse</Label>
            <div>{company.address || '-'}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-phone">Telefon</Label>
              <div>{company.phone || '-'}</div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-email">E-Mail</Label>
              <div>{company.email || '-'}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-website">Website</Label>
            <div>{company.website || '-'}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show edit company form if editing
  if (company && isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unternehmen bearbeiten</CardTitle>
          <CardDescription>
            Bearbeiten Sie die Details Ihres Unternehmens
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateCompany}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Unternehmensname *</Label>
              <Input
                id="company-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-address">Adresse</Label>
              <Input
                id="company-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-phone">Telefon</Label>
                <Input
                  id="company-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-email">E-Mail</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              <X className="mr-2 h-4 w-4" />
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Speichern...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Änderungen speichern
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  // Show create company form if no company exists
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unternehmen erstellen</CardTitle>
        <CardDescription>
          Erstellen Sie Ihr Unternehmen, um alle Features nutzen zu können
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleCreateCompany}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Unternehmensname *</Label>
            <Input
              id="company-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company-address">Adresse</Label>
            <Input
              id="company-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-phone">Telefon</Label>
              <Input
                id="company-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-email">E-Mail</Label>
              <Input
                id="company-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-website">Website</Label>
            <Input
              id="company-website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving} className="ml-auto">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Erstellen...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Unternehmen erstellen
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CompanySettings;
