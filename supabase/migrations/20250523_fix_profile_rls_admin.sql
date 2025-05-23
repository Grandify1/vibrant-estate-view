
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'dustin.althaus@me.com'
  );
$$;

-- Create new policies that work correctly
CREATE POLICY "Users can view their own profile or admin can view all" 
  ON public.profiles 
  FOR SELECT 
  USING (
    id = auth.uid() OR 
    public.is_admin_user()
  );

CREATE POLICY "Users can update their own profile or admin can update all" 
  ON public.profiles 
  FOR UPDATE 
  USING (
    id = auth.uid() OR 
    public.is_admin_user()
  );

-- Allow admin to insert profiles
CREATE POLICY "Admin can insert profiles" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (public.is_admin_user());

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
