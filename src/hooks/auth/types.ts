
export interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_id?: string | null;
}

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  website?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loadingAuth: boolean;
  company: Company | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string, selectedPlan?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  createCompany: (companyData: Omit<Company, 'id'>) => Promise<Company | null>;
  updateCompany: (companyData: Partial<Company>) => Promise<boolean>;
}
