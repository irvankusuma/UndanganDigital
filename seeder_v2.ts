import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seed() {
  console.log('Seeder V2 starting (Target: /undangan/rizky-fitri)...');
  
  const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
  if (!profiles || profiles.length === 0) {
    console.error('No profiles found');
    return;
  }
  const userId = profiles[0].id;

  // Cleanup old if exists
  await supabase.from('invitations').delete().eq('slug', 'rizky-fitri');

  const { data: inv, error: invErr } = await supabase.from('invitations').insert({
    user_id: userId,
    slug: 'rizky-fitri',
    status: 'active',
    event_name: 'Rizky & Fitri Wedding',
    bride_name: 'Fitri Handayani',
    groom_name: 'Rizky Pratama',
    event_date: '2025-08-17',
    akad_location: 'Gedung Sasana Kriya, TMII',
    reception_location: 'Gedung Sasana Kriya, TMII',
    theme: 'elegant',
    color_hex: '#E8627A', // New column name
    font_title: 'Playfair Display',
    font_body: 'Poppins',
    gallery_images: [ // New column
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80'
    ],
    story: 'Berawal dari bangku kuliah, hingga akhirnya kami memutuskan untuk menempuh hidup baru bersama.',
    music_enabled: true,
    music_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    gift_enabled: true,
    wishes_enabled: true,
    gallery_enabled: true,
    rsvp_enabled: true,
    countdown_enabled: true
  }).select().single();

  if (invErr) {
    console.error('Error inserting invitation:', invErr);
    return;
  }

  const invId = inv.id;
  
  // Insert wishes
  await supabase.from('wishes').insert([
    { invitation_id: invId, guest_name: 'Budi Hartono', message: 'Selamat ya Rizky & Fitri! Semoga samawa.', status: 'visible'},
    { invitation_id: invId, guest_name: 'Siti Sarah', message: 'Lancar sampai hari H ya cantik..', status: 'visible'}
  ]);

  // Insert gift accounts
  await supabase.from('gift_accounts').insert([
    { invitation_id: invId, bank_name: 'BCA', account_number: '8830123456', account_name: 'RIZKY PRATAMA' },
    { invitation_id: invId, bank_name: 'Mandiri', account_number: '1230009876543', account_name: 'FITRI HANDAYANI' }
  ]);

  console.log('Seeding Success! URL: /undangan/rizky-fitri');
}

seed();
