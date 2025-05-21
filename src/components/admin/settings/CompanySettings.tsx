
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CompanySettings = () => {
  const { company, updateCompany } = useAuth();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (company && !isLoaded) {
      setName(company.name || '');
      setAddress(company.address || '');
      setPhone(company.phone || '');
      setEmail(company.email || '');
      setIsLoaded(true);
    }
  }, [company, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateCompany({
        name,
        address,
        phone,
        email
      });
      toast.success('Unternehmensdaten gespeichert');
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      toast.error('Fehler beim Speichern der Unternehmensdaten');
    } finally {
      setIsSaving(false);
    }
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unternehmensdetails</CardTitle>
        <CardDescription>
          Verwalten Sie die Informationen Ihres Unternehmens
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
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
              value={address || ''}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-phone">Telefon</Label>
              <Input
                id="company-phone"
                value={phone || ''}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-email">E-Mail</Label>
              <Input
                id="company-email"
                type="email"
                value={email || ''}
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
                Speichern...
              </>
            ) : 'Änderungen speichern'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CompanySettings;
