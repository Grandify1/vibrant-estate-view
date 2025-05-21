
import { ReactNode, createContext } from "react";
import { useSession } from "./useSession";
import { useLoginSignup } from "./useLoginSignup";
import { useCompanyManagement } from "./useCompanyManagement";
import { AuthContextType } from "./types";
import { Company } from "@/types/company";

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
    updateCompany: updateCompanyWithCurrentCompany 
  } = useCompanyManagement(user, setUser, setCompany);
  
  // Adapt the updateCompany function to match the expected signature
  const updateCompany = (companyData: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>) => {
    return updateCompanyWithCurrentCompany(companyData, company);
  };
  
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
