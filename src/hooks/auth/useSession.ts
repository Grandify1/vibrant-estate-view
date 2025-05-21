
import { useSessionState } from "./useSessionState";
import { useSessionLoader } from "./useSessionLoader";

export const useSession = () => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    loadingAuth,
    setLoadingAuth,
    user,
    setUser
  } = useSessionState();
  
  useSessionLoader(
    setIsAuthenticated,
    setLoadingAuth,
    setUser
  );

  return {
    isAuthenticated,
    loadingAuth,
    user,
    setUser
  };
};
