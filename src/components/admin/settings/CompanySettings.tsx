
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const CompanySettings = () => {
  const { company, createCompany } = useAuth();
  
  // Form state for creating a company
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  // Display company details if exists
  if (company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unternehmensdetails</CardTitle>
          <CardDescription>
            Ihr Unternehmen ist eingerichtet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Unternehmensname</Label>
            <div className="font-medium">{company.name}</div>
          </div>
          
          {company.address && (
            <div className="space-y-2">
              <Label htmlFor="company-address">Adresse</Label>
              <div>{company.address}</div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {company.phone && (
              <div className="space-y-2">
                <Label htmlFor="company-phone">Telefon</Label>
                <div>{company.phone}</div>
              </div>
            )}
            
            {company.email && (
              <div className="space-y-2">
                <Label htmlFor="company-email">E-Mail</Label>
                <div>{company.email}</div>
              </div>
            )}
          </div>
        </CardContent>
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
