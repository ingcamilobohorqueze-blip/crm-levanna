import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSelect() {
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: 'comercial.levannadc@gmail.com',
    password: 'Levanna2026'
  });

  if (signInError) {
    console.error('Error signing in:', signInError.message);
    return;
  }

  const { data, error } = await supabase.from('leads_master').select('*, usuarios_comerciales(nombre)').order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching leads:', error);
  } else {
    console.log('Fetched leads:', data.length);
  }
}

testSelect();
