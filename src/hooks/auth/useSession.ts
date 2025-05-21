
import { useSessionState } from "./useSessionState";
import { useSessionLoader } from "./useSessionLoader";
import { useCompanyLoader } from "./useCompanyLoader";

export const useSession = () => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    loadingAuth,
    setLoadingAuth,
    user,
    setUser,
    company,
    setCompany
  } = useSessionState();
  
  const { loadCompanyData } = useCompanyLoader(setCompany);
  
  useSessionLoader(
    setIsAuthenticated,
    setLoadingAuth,
    setUser,
    loadCompanyData
  );

  return {
    isAuthenticated,
    loadingAuth,
    user,
    setUser,
    company,
    setCompany
  };
};
