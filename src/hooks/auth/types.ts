
export interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  loadingAuth: boolean;
}
