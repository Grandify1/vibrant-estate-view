
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLoginSignup } from '@/hooks/auth/useLoginSignup';
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
  const { loginWithGoogle, signupWithGoogle } = useLoginSignup();
  const [searchParams] = useSearchParams();
  
  // Get tab and plan from URL params
  const urlTab = searchParams.get('tab');
  const selectedPlan = searchParams.get('plan');
  const paymentSuccess = searchParams.get('payment') === 'success';
  const isNewRegistration = searchParams.get('new_registration') === 'true';
  
  const [activeTab, setActiveTab] = useState<string>(urlTab || 'login');
  
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
  
  // Google OAuth loading states
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [googleSignupLoading, setGoogleSignupLoading] = useState(false);
  
  // Show success message for payment - MOVED TO TOP
  useEffect(() => {
    if (paymentSuccess) {
      toast.success('Zahlung erfolgreich! Vielen Dank für deine Anmeldung.');
    }
  }, [paymentSuccess]);
  
  // Verbesserte Weiterleitung mit Logs - MOVED TO TOP
  useEffect(() => {
    console.log("Auth: Auth Status:", { isAuthenticated, loadingAuth, user, isNewRegistration, selectedPlan, paymentSuccess });
    
    if (!loadingAuth && isAuthenticated) {
      console.log("Auth: Authentifiziert, leite weiter...");
      
      // Wenn Payment Success, dann zur Admin-Seite
      if (paymentSuccess) {
        console.log("Auth: Zur Admin-Seite weiterleiten (Payment Success)");
        navigate('/admin');
      } 
      // Nur für neue Registrierungen: zur Payment-Seite weiterleiten
      else if (isNewRegistration && selectedPlan) {
        console.log("Auth: Zur Payment-Seite weiterleiten (Neue Registrierung mit Plan)");
        navigate(`/payment?plan=${selectedPlan}`);
      }
      // Nur für neue Registrierungen ohne Plan: Starter Plan setzen
      else if (isNewRegistration) {
        console.log("Auth: Neue Registrierung ohne Plan - zur Payment-Seite mit Starter Plan");
        navigate('/payment?plan=starter');
      }
      // Bestehende Benutzer direkt zum Dashboard weiterleiten
      else {
        console.log("Auth: Bestehender Benutzer - direkt zur Admin-Seite");
        navigate('/admin');
      }
    }
  }, [isAuthenticated, loadingAuth, navigate, user, paymentSuccess, selectedPlan, isNewRegistration]);
  
  // NOW the conditional returns come AFTER all hooks
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
  
  // Wenn der Benutzer bereits authentifiziert ist
  if (isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen flex-col">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <div className="text-sm text-gray-500">
        Sie werden weitergeleitet...
      </div>
    </div>;
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
        // Redirect will happen automatically in the useEffect
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
      const success = await signup(registerEmail, registerPassword, firstName, lastName, selectedPlan);
      console.log("Auth: Registrierung Ergebnis:", success);
      
      if (success) {
        toast.success("Registrierung erfolgreich!");
        // Markiere als neue Registrierung für die Weiterleitung zur Payment-Seite
        navigate(`/auth?new_registration=true${selectedPlan ? `&plan=${selectedPlan}` : ''}`);
      }
    } catch (error) {
      console.error("Auth: Registrierung Fehler:", error);
      toast.error("Registrierung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoginLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google Login Fehler:", error);
    } finally {
      setGoogleLoginLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleSignupLoading(true);
    try {
      await signupWithGoogle(selectedPlan);
    } catch (error) {
      console.error("Google Registrierung Fehler:", error);
    } finally {
      setGoogleSignupLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {selectedPlan ? `${selectedPlan === 'starter' ? 'Starter' : 'Professional'} Paket` : 'Immobilien-Portal'}
          </CardTitle>
          <CardDescription>
            {selectedPlan 
              ? 'Schließen Sie Ihre Registrierung ab, um das gewählte Paket zu aktivieren.'
              : 'Melden Sie sich an oder erstellen Sie ein neues Konto.'
            }
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
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Oder
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleLogin}
                disabled={googleLoginLoading}
              >
                {googleLoginLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Anmelden...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Mit Google anmelden
                  </span>
                )}
              </Button>
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
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Oder
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleSignup}
                disabled={googleSignupLoading}
              >
                {googleSignupLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrieren...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Mit Google registrieren
                  </span>
                )}
              </Button>
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
