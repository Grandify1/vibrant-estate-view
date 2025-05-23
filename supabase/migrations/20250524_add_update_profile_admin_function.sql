
-- Create a function to allow updating user profiles with security definer privileges
CREATE OR REPLACE FUNCTION public.safe_update_user_profile(
  user_id_param UUID,
  first_name_param TEXT,
  last_name_param TEXT,
  company_id_param UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result_record JSON;
BEGIN
  -- Update or insert the profile
  INSERT INTO public.profiles (id, first_name, last_name, company_id)
  VALUES (user_id_param, first_name_param, last_name_param, company_id_param)
  ON CONFLICT (id) 
  DO UPDATE SET 
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    company_id = EXCLUDED.company_id,
    updated_at = now()
  RETURNING to_json(profiles.*) INTO result_record;
  
  RETURN result_record;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.safe_update_user_profile(UUID, TEXT, TEXT, UUID) TO authenticated;
