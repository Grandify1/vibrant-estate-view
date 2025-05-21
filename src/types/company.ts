
export interface Company {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo: string | null;
  created_at: string;
  updated_at: string;
}

export const initialCompany: Company = {
  id: '',
  name: '',
  address: null,
  phone: null,
  email: null,
  logo: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
