import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated, loadingAuth, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // Login-Zustand
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Registrierungszustand
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  
  // Verbesserte Weiterleitung mit Logs
  useEffect(() => {
    console.log("Auth: Auth Status:", { isAuthenticated, loadingAuth, user });
    
    if (!loadingAuth && isAuthenticated) {
      console.log("Auth: Authentifiziert, leite zur Admin-Seite weiter");
      navigate('/admin');
    }
  }, [isAuthenticated, loadingAuth, navigate, user]);
  
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <div className="text-sm text-gray-500">
          Authentifizierung wird geprüft...
        </div>
      </div>
    );
  }
  
  // Wenn der Benutzer bereits authentifiziert ist und kein Unternehmen hat, zur Unternehmenseinrichtung weiterleiten
  if (isAuthenticated && user && !user.company_id) {
    return <Navigate to="/company-setup" />;
  }
  
  // Wenn der Benutzer authentifiziert ist und ein Unternehmen hat, zur Admin-Seite weiterleiten
  if (isAuthenticated && user && user.company_id) {
    return <Navigate to="/admin" />;
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      console.log("Auth: Versuche Login mit Email:", loginEmail);
      const success = await login(loginEmail, loginPassword);
      console.log("Auth: Login Ergebnis:", success);
      
      if (success) {
        toast.success("Erfolgreich angemeldet!");
        // Weiterleitung erfolgt automatisch durch die useEffect-Hook
      }
    } catch (error) {
      console.error("Auth: Login Fehler:", error);
      toast.error("Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.");
    } finally {
      setLoginLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerPassword !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein');
      return;
    }
    
    setRegisterLoading(true);
    
    try {
      console.log("Auth: Versuche Registrierung mit Email:", registerEmail);
      const success = await signup(registerEmail, registerPassword, firstName, lastName);
      console.log("Auth: Registrierung Ergebnis:", success);
      
      if (success) {
        toast.success("Registrierung erfolgreich!");
        // Die Weiterleitung erfolgt automatisch durch die useEffect-Hook
      }
    } catch (error) {
      console.error("Auth: Registrierung Fehler:", error);
      toast.error("Registrierung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.");
    } finally {
      setRegisterLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Immobilien-Portal</CardTitle>
          <CardDescription>
            Melden Sie sich an oder erstellen Sie ein neues Konto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Anmelden</TabsTrigger>
              <TabsTrigger value="register">Registrieren</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-Mail</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@beispiel.de"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Passwort</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Anmelden...
                    </span>
                  ) : (
                    'Anmelden'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">Vorname</Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Nachname</Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">E-Mail</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="name@beispiel.de"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Passwort</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={registerLoading}>
                  {registerLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrieren...
                    </span>
                  ) : (
                    'Registrieren'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center border-t pt-4">
          <p className="text-sm text-gray-500">
            immoupload.com &copy; {new Date().getFullYear()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
