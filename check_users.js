import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsers() {
  const { data, error } = await supabase.from('usuarios_comerciales').select('*');
  console.log('Usuarios comerciales:', data);
  
  // also get all auth users using the service role key if we had it, but we only have anon key.
  // Let's at least see what's in usuarios_comerciales
}

checkUsers();
