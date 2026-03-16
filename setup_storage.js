
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(url, key);

async function setupStorage() {
  console.log('Setting up storage...');
  const { data: b, error: e1 } = await supabase.storage.createBucket('invitations', {
    public: true,
    fileSizeLimit: 5242880,
    allowedMimeTypes: ['image/jpeg', 'image/png']
  });
  if (e1) console.log('Bucket "invitations" might already exist or error:', e1.message);
  else console.log('Bucket "invitations" created.');

  // Create public policy for bucket if needed (usually public:true handles it in newer Supabase)
}
setupStorage();
