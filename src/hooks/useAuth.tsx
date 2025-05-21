
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  setAdminPassword: (password: string) => void;
  hasSetPassword: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminPassword, setAdminPassword] = useLocalStorage<string>("admin-password", "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSetPassword, setHasSetPassword] = useState(false);
  
  useEffect(() => {
    setHasSetPassword(!!adminPassword);
  }, [adminPassword]);
  
  // Check for existing session on load
  useEffect(() => {
    const sessionExists = localStorage.getItem("admin-session") === "active";
    setIsAuthenticated(sessionExists);
  }, []);
  
  const login = (password: string) => {
    if (!adminPassword) {
      toast.error("Es wurde noch kein Admin-Passwort festgelegt.");
      return false;
    }
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("admin-session", "active");
      toast.success("Erfolgreich angemeldet!");
      return true;
    } else {
      toast.error("Falsches Passwort!");
      return false;
    }
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin-session");
    toast.info("Abgemeldet");
  };
  
  const setPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
    toast.success("Admin-Passwort erfolgreich gespeichert.");
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        logout, 
        setAdminPassword: setPassword,
        hasSetPassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
