
import { ReactNode, createContext, useEffect } from "react";
import { useSession } from "./useSession";
import { useLoginSignup } from "./useLoginSignup";
import { AuthContextType, AuthUser, Company } from "./types";
import { useCompany } from "./useCompany";

// Create the Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { 
    isAuthenticated, 
    loadingAuth, 
    user, 
    setUser
  } = useSession();
  
  const { login, signup, logout } = useLoginSignup();
  const { company, loadCompany, createCompany } = useCompany(user);
  
  // Load company data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCompany();
    }
  }, [isAuthenticated, user?.id]);
  
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        signup,
        logout, 
        user,
        loadingAuth,
        company,
        createCompany
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
