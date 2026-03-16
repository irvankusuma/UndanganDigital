
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('invitations').select().limit(1);
  if (data && data.length > 0) {
    console.log(JSON.stringify(Object.keys(data[0]), null, 2));
  } else {
    // Try to get column names from information_schema
    const { data: cols, error: err2 } = await supabase.rpc('get_table_columns', { table_name: 'invitations' });
    console.log(cols || error || err2);
  }
}
check();
