
import { ReactNode, createContext } from "react";
import { useSession } from "./useSession";
import { useLoginSignup } from "./useLoginSignup";
import { useCompanyManagement } from "./useCompanyManagement";
import { AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { 
    isAuthenticated, 
    loadingAuth, 
    user, 
    setUser, 
    company, 
    setCompany 
  } = useSession();
  
  const { login, signup, logout } = useLoginSignup();
  
  const { 
    createCompany, 
    updateCompany 
  } = useCompanyManagement(user, setUser, setCompany);
  
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        signup,
        logout, 
        user,
        company,
        createCompany,
        updateCompany,
        loadingAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
