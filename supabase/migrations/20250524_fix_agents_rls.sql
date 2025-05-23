
-- Überprüfe, ob RLS für agents Tabelle aktiviert ist, wenn nicht, aktivieren
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'agents' 
        AND rowsecurity = true
    ) THEN 
        ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Lösche vorhandene RLS-Policies für die agents Tabelle
DROP POLICY IF EXISTS "Users can view agents from their company" ON public.agents;
DROP POLICY IF EXISTS "Users can create agents in their company" ON public.agents;
DROP POLICY IF EXISTS "Users can update agents in their company" ON public.agents;
DROP POLICY IF EXISTS "Users can delete agents in their company" ON public.agents;

-- Erstelle neue RLS-Policies für die agents Tabelle
CREATE POLICY "Users can view agents from their company" 
  ON public.agents 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT company_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create agents in their company" 
  ON public.agents 
  FOR INSERT 
  WITH CHECK (
    company_id IN (
      SELECT company_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update agents in their company" 
  ON public.agents 
  FOR UPDATE 
  USING (
    company_id IN (
      SELECT company_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete agents in their company" 
  ON public.agents 
  FOR DELETE 
  USING (
    company_id IN (
      SELECT company_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );
