
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(url, key);

async function migrate() {
  console.log('Running migrations...');

  const queries = [
    `ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS akad_location_url TEXT;`,
    `CREATE TABLE IF NOT EXISTS public.saved_payment_methods (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
      bank_name TEXT NOT NULL,
      account_number TEXT NOT NULL,
      account_name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,
    `ALTER TABLE public.saved_payment_methods ENABLE ROW LEVEL SECURITY;`,
    `DROP POLICY IF EXISTS "Users can manage own saved payment methods" ON public.saved_payment_methods;`,
    `CREATE POLICY "Users can manage own saved payment methods" ON public.saved_payment_methods
      FOR ALL USING (auth.uid() = user_id);`
  ];

  for (const query of queries) {
    const { error } = await supabase.rpc('exec_sql', { sql_query: query });
    if (error) {
      // If exec_sql RPC is not available, we might need another way or just skip if it's already there
      console.log('Error executing query with RPC (might not exist):', error.message);
      console.log('Query was:', query);
    } else {
      console.log('Executed:', query.substring(0, 50) + '...');
    }
  }

  // Fallback: If RPC fails, we can't do much without it, but let's assume it works or the user can run it.
  // Actually, I'll try to use a dummy select to check if column exists
  const { data, error: errCols } = await supabase.from('invitations').select('akad_location_url').limit(1);
  if (errCols) {
    console.log('Column akad_location_url still missing or error:', errCols.message);
  } else {
    console.log('Column akad_location_url verified.');
  }
}

migrate();
