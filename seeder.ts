import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seed() {
  console.log('Seeder starting for budi-siti6 using Service Role...');
  
  // Get an existing user ID
  const { data: profiles, error: profileErr } = await supabase.from('profiles').select('id').limit(1);
  
  if (profileErr || !profiles || profiles.length === 0) {
    console.error('No profiles found in DB', profileErr);
    return;
  }
  
  const userId = profiles[0].id;

  // Insert invitation with 'active' status
  const { data: inv, error: invErr } = await supabase.from('invitations').insert({
    user_id: userId,
    slug: 'budi-siti6',
    status: 'active', // <--- Fixed here to pass RLS
    event_name: 'Budi & Siti 6',
    bride_name: 'Siti Aminah',
    groom_name: 'Budi Santoso',
    event_date: '2025-12-25',
    akad_date: '2025-12-25',
    akad_time: '09:00',
    akad_location: 'Masjid Istiqlal',
    reception_date: '2025-12-25',
    reception_time: '11:00',
    reception_location: 'Hotel Mulia Senayan',
    theme: 'elegant',
    color_hex: '#E8627A',
    font_title: 'Playfair Display',
    font_body: 'Poppins',
    gallery_images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80'
    ],
    story: 'Kisah cinta kami bermula dari sebuah pesan singkat...',
    gift_enabled: true,
    music_enabled: false,
    wishes_enabled: true,
    gallery_enabled: true,
    rsvp_enabled: true,
    countdown_enabled: true
  }).select();

  if (invErr) {
    console.error('Error inserting invitation:', invErr);
  } else {
    console.log('Invitation inserted successfully.');
  }
  
  // Retrieve the generated invitation id
  const { data: invData } = await supabase.from('invitations')
    .select('id')
    .eq('slug', 'budi-siti6')
    .single();
    
  const invId = invData?.id;
  
  if (invId) {
      // Insert wishes and gifts linked to invitation
      await supabase.from('wishes').insert([
        { invitation_id: invId, guest_name: 'Pak RT', message: 'Selamat Berbahagia!', status: 'visible'},
        { invitation_id: invId, guest_name: 'Andi Cole', message: 'Lancar sampai hari H', status: 'visible'}
      ]);
      await supabase.from('gift_accounts').insert({
         invitation_id: invId,
         bank_name: 'BCA',
         account_number: '1234567890',
         account_name: 'BUDI SANTOSO',
         status: 'active'
      });
      console.log('Wishes & Gifts inserted.');
  }
  
  console.log('Seeding done for /undangan/budi-siti6');
}

seed();
