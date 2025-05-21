
import { useState } from "react";
import { AuthUser } from "./types";
import { Company } from "@/types/company";

export const useSessionState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  return {
    isAuthenticated,
    setIsAuthenticated,
    loadingAuth,
    setLoadingAuth,
    user,
    setUser,
    company,
    setCompany
  };
};
