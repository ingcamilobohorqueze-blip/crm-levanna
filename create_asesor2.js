import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAsesor2() {
  console.log('Creating Asesor 2...');

  const { data, error } = await supabase.auth.signUp({
    email: 'comercial2.levannadc@gmail.com',
    password: 'Levanna2026',
    options: {
      data: {
        nombre: 'Asesor 2'
      }
    }
  });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log(`Success creating Asesor 2. User ID: ${data.user?.id}`);
    
    // Insert into usuarios_comerciales
    const { error: insertError } = await supabase.from('usuarios_comerciales').insert([{
      id_usuario: data.user?.id,
      nombre: 'Asesor 2',
      email: 'comercial2.levannadc@gmail.com',
      rol: 'asesor'
    }]);
    
    if (insertError) {
      console.error('Error inserting into usuarios_comerciales:', insertError.message);
    } else {
      console.log('Successfully added Asesor 2 to usuarios_comerciales table.');
    }
  }
}

createAsesor2();
