
export interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_id?: string | null;  // Add company_id property to AuthUser
}

export interface Company {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo: string | null;
  created_at: string;
  updated_at: string;
  website?: string | null;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  loadingAuth: boolean;
  company: Company | null;
  createCompany: (companyData: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  }) => Promise<boolean>;
  updateCompany: (updates: {
    name?: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    logo?: string | null;
    website?: string | null;
  }) => Promise<boolean>;
}
