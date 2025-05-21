
-- Drop existing RLS policies for the profiles table if they exist
DROP POLICY IF EXISTS "Users can view their profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their profile" ON public.profiles;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own profile
CREATE POLICY "Users can view their profile" 
  ON public.profiles 
  FOR SELECT 
  USING (id = auth.uid());

-- Create policy that allows users to update their own profile
CREATE POLICY "Users can update their profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (id = auth.uid());
