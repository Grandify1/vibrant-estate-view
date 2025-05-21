
import { ReactNode, createContext } from "react";
import { useSession } from "./useSession";
import { useLoginSignup } from "./useLoginSignup";
import { AuthContextType } from "./types";

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
  
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        signup,
        logout, 
        user,
        loadingAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
