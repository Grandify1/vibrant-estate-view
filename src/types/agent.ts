
export interface Agent {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  position: string | null;
  phone: string | null;
  email: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const initialAgent: Agent = {
  id: '',
  company_id: '',
  first_name: '',
  last_name: '',
  position: '',
  phone: '',
  email: '',
  image_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
