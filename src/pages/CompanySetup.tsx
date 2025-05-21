
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
  const { user, company, createCompany, isAuthenticated, loadingAuth } = useAuth();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loadingAuth && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loadingAuth, navigate]);
  
  // Redirect if company already exists
  useEffect(() => {
    if (company && company.id) {
      navigate('/admin');
    }
  }, [company, navigate]);
  
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
      
      // First, directly create the company using Supabase client
      // This bypasses any potential issues with the createCompany function
      const companyData = {
        name,
        address: address || null,
        phone: phone || null,
        email: email || null,
        logo: null
      };
      
      console.log('Creating company with data:', companyData);
      
      // Attempt direct database insertion first
      const { data: newCompany, error: insertError } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single();
      
      if (insertError) {
        console.error("Company creation error:", insertError);
        setErrorMessage(`Fehler beim Erstellen des Unternehmens: ${insertError.message}`);
        toast.error(`Fehler beim Erstellen des Unternehmens: ${insertError.message}`);
        setIsLoading(false);
        return;
      }
      
      if (newCompany) {
        // If direct insertion was successful, update the user's profile with the company ID
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ company_id: newCompany.id })
          .eq('id', user?.id);
        
        if (profileError) {
          console.error("Profile update error:", profileError);
          toast.error(`Unternehmen erstellt, aber Profilaktualisierung fehlgeschlagen: ${profileError.message}`);
        } else {
          toast.success('Unternehmen erfolgreich erstellt!');
          // Force a reload of the Auth context to get the updated profile
          setTimeout(() => {
            navigate('/admin');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Unexpected error creating company:', error);
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
