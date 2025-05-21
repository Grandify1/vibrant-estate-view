
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface SetPasswordFormProps {
  onPasswordSet: (password: string) => void;
}

const SetPasswordForm: React.FC<SetPasswordFormProps> = ({ onPasswordSet }) => {
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      toast.error("Das Passwort sollte mindestens 4 Zeichen lang sein.");
      return;
    }
    onPasswordSet(newPassword);
    setNewPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin-Portal einrichten</CardTitle>
          <CardDescription>
            Bitte legen Sie ein Passwort für den Zugriff auf das Admin-Portal fest.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSet}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Passwort festlegen"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Passwort festlegen
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SetPasswordForm;
