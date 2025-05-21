
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const CompanySetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, company, loadingAuth, isAuthenticated } = useAuth();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Für Debugging
  const [authStatus, setAuthStatus] = useState<string>("Prüfe Authentifizierung...");
  
  // Verbesserte Authentifizierungs-Überprüfung mit Timeout
  useEffect(() => {
    console.log("CompanySetup: Auth Status:", { isAuthenticated, loadingAuth, user });
    
    if (!loadingAuth) {
      if (!isAuthenticated) {
        console.log("CompanySetup: Nicht authentifiziert, leite zur Auth-Seite weiter");
        setAuthStatus("Nicht authentifiziert, leite weiter...");
        navigate('/auth');
      } else {
        console.log("CompanySetup: Authentifiziert als", user?.id);
        setAuthStatus("Authentifiziert");
      }
    }
    
    // Timeout falls die Auth-Prüfung zu lange dauert
    const timeout = setTimeout(() => {
      if (loadingAuth) {
        console.log("CompanySetup: Auth-Prüfung Timeout, leite zur Auth-Seite weiter");
        setAuthStatus("Timeout, leite weiter...");
        navigate('/auth');
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [isAuthenticated, loadingAuth, navigate, user]);
  
  // Weiterleitungslogik, falls Unternehmen bereits existiert
  useEffect(() => {
    if (company && company.id) {
      console.log("CompanySetup: Unternehmen existiert bereits, leite zur Admin-Seite weiter", company);
      navigate('/admin');
    }
  }, [company, navigate]);
  
  // Zeige Ladebildschirm während Authentifizierung geprüft wird
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <div className="text-sm text-gray-500">
          {authStatus}
        </div>
      </div>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      if (!name.trim()) {
        toast.error('Bitte geben Sie einen Unternehmensnamen ein.');
        setIsLoading(false);
        return;
      }
      
      if (!user || !user.id) {
        toast.error('Benutzer nicht gefunden. Bitte loggen Sie sich erneut ein.');
        setIsLoading(false);
        console.error("Kein Benutzer gefunden:", user);
        navigate('/auth');
        return;
      }
      
      // Die Unternehmensdaten vorbereiten
      const companyData = {
        name,
        address: address || null,
        phone: phone || null,
        email: email || null,
        logo: null
      };
      
      console.log('Erstelle Unternehmen mit Daten:', companyData);
      console.log('User ID:', user.id);
      
      // Direkter Supabase-Aufruf für bessere Fehlerbehandlung
      const { data: newCompany, error: insertError } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single();
      
      if (insertError) {
        console.error("Fehler beim Erstellen des Unternehmens:", insertError);
        
        // Verbesserte Fehlerbehandlung mit spezifischen Fehlermeldungen
        if (insertError.code === '23505') {
          toast.error(`Ein Unternehmen mit diesem Namen existiert bereits.`);
        } else if (insertError.code === '42501' || insertError.message.includes('permission denied')) {
          toast.error(`Berechtigungsfehler: Stellen Sie sicher, dass Sie angemeldet sind und die erforderlichen Rechte haben.`);
        } else {
          toast.error(`Fehler beim Erstellen des Unternehmens: ${insertError.message}`);
        }
        
        setErrorMessage(`Fehler beim Erstellen des Unternehmens: ${insertError.message}`);
        setIsLoading(false);
        return;
      }
      
      if (newCompany) {
        console.log("Unternehmen erfolgreich erstellt:", newCompany);
        
        // Benutzerprofil mit der Unternehmens-ID aktualisieren
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ company_id: newCompany.id })
          .eq('id', user.id);
        
        if (profileError) {
          console.error("Fehler beim Aktualisieren des Profils:", profileError);
          toast.warning(`Unternehmen erstellt, aber Profilaktualisierung fehlgeschlagen. Bitte kontaktieren Sie den Support.`);
        } else {
          toast.success('Unternehmen erfolgreich erstellt!');
        }
        
        // Kurze Pause vor Weiterleitung, damit der Toast sichtbar ist
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      }
    } catch (error) {
      console.error('Unerwarteter Fehler beim Erstellen des Unternehmens:', error);
      setErrorMessage('Ein unerwarteter Fehler ist aufgetreten');
      toast.error('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Unternehmen einrichten</CardTitle>
          <CardDescription>
            Erstellen Sie Ihr Unternehmensprofil, um fortzufahren.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {errorMessage}
              </div>
            )}
            
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
            
            <div className="grid grid-cols-2 gap-4">
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Unternehmen erstellen...
                </span>
              ) : (
                'Unternehmen erstellen'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CompanySetupPage;
