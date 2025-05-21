
-- Drop existing RLS policies for the companies table if they exist
DROP POLICY IF EXISTS "Users can view their company" ON public.companies;
DROP POLICY IF EXISTS "Users can edit their company" ON public.companies;
DROP POLICY IF EXISTS "Users can insert into companies" ON public.companies;

-- Enable RLS on companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view the company they belong to
CREATE POLICY "Users can view their company" 
  ON public.companies 
  FOR SELECT 
  USING (
    id IN (
      SELECT company_id FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.company_id IS NOT NULL
    )
  );

-- Create policy that allows users to update the company they belong to
CREATE POLICY "Users can edit their company" 
  ON public.companies 
  FOR UPDATE 
  USING (
    id IN (
      SELECT company_id FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.company_id IS NOT NULL
    )
  );

-- Create policy that allows any authenticated user to insert new companies
CREATE POLICY "Users can insert into companies" 
  ON public.companies 
  FOR INSERT 
  WITH CHECK (true);
