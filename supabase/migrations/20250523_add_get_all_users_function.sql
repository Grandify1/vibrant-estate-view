
-- Function to get all users from auth.users
-- This requires admin privileges via service role
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT au.id, au.email, au.created_at
  FROM auth.users au
  ORDER BY au.created_at DESC;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_all_users() TO authenticated;
