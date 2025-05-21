
import { useState } from "react";
import { AuthUser } from "./types";

export const useSessionState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  return {
    isAuthenticated,
    setIsAuthenticated,
    loadingAuth,
    setLoadingAuth,
    user,
    setUser
  };
};
