import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'comercial.levannadc@gmail.com',
    password: 'Levanna2026'
  });

  if (error) {
    console.error('Error logging in:', error.message);
  } else {
    console.log('Logged in successfully!');
    console.log('Auth UUID:', data.session.user.id);
  }
  
  const { data: dbUser, error: dbError } = await supabase
    .from('usuarios_comerciales')
    .select('*')
    .eq('id_usuario', data?.session?.user?.id)
    .single();
    
  console.log('Query using that UUID in usuarios_comerciales:', dbUser, dbError);
}

testAuth();
