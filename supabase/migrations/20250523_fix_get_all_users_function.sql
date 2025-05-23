
-- Korrigiere die Funktion, um die types korrekt zu mappen
CREATE OR REPLACE FUNCTION public.get_all_users_with_profiles()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  first_name TEXT,
  last_name TEXT,
  company_id UUID,
  company_name TEXT
)
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email::TEXT,
    au.created_at,
    p.first_name,
    p.last_name,
    p.company_id,
    c.name as company_name
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  LEFT JOIN public.companies c ON p.company_id = c.id
  ORDER BY au.created_at DESC;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_all_users_with_profiles() TO authenticated;
