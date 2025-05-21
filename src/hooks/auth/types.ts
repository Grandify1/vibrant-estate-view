
import { Company } from "@/types/company";

export interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_id?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  company: Company | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  createCompany: (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateCompany: (companyData: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>) => Promise<boolean>;
  loadingAuth: boolean;
}
