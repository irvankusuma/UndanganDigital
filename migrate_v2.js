
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(url, key);

async function migrate() {
  console.log('Running migrations v2...');

  const queries = [
    `ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS bride_father_name TEXT;`,
    `ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS bride_mother_name TEXT;`,
    `ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS groom_father_name TEXT;`,
    `ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS groom_mother_name TEXT;`
  ];

  for (const query of queries) {
    const { error } = await supabase.rpc('exec_sql', { sql_query: query });
    if (error) {
      console.log('Error executing query with RPC (might not exist):', error.message);
      console.log('Query was:', query);
    } else {
      console.log('Executed:', query);
    }
  }

  console.log('Migration v2 completed.');
}

migrate();
