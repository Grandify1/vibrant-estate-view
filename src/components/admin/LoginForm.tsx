
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginFormProps {
  onLogin: (password: string) => boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin-Portal</CardTitle>
          <CardDescription>
            Bitte geben Sie Ihr Admin-Passwort ein, um fortzufahren.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Anmelden
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
