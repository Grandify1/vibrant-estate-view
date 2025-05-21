
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setAddress(company.address || '');
      setPhone(company.phone || '');
      setEmail(company.email || '');
      setIsLoaded(true);
      setLoading(false);
    } else {
      // If there's no company after a reasonable time, stop loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company) {
      toast.error('Kein Unternehmen gefunden');
      return;
    }
    
    setIsSaving(true);

    try {
      const success = await updateCompany({
        name,
        address,
        phone,
        email
      });
      
      if (success) {
        toast.success('Unternehmensdaten gespeichert');
      } else {
        toast.error('Fehler beim Speichern der Unternehmensdaten');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      toast.error('Fehler beim Speichern der Unternehmensdaten');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  if (!company && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unternehmensdetails</CardTitle>
          <CardDescription>
            Sie haben noch kein Unternehmen erstellt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="mb-4">Bitte erstellen Sie zuerst ein Unternehmen.</p>
          </div>
        </CardContent>
      </Card>
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
