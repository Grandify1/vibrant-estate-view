
import { AuthUser } from "./types";
import { Company } from "@/types/company";
import { useCompanyLoader } from "./useCompanyLoader";
import { useCompanyCreator } from "./useCompanyCreator";
import { useCompanyUpdater } from "./useCompanyUpdater";

export const useCompanyManagement = (
  user: AuthUser | null,
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>
) => {
  const { loadCompanyData } = useCompanyLoader(setCompany);
  const { createCompany } = useCompanyCreator(user, setUser, setCompany);
  const { updateCompany } = useCompanyUpdater(user, setCompany);

  return {
    loadCompanyData,
    createCompany,
    updateCompany
  };
};
