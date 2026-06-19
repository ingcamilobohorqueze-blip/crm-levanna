import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createUsers() {
  console.log('Creating users in Supabase Auth...');

  const usersToCreate = [
    { email: 'proyectos@levannadc.com', password: 'LDC901723714*', nombre: 'Admin Levanna' },
    { email: 'comercial.levannadc@gmail.com', password: 'Levanna2026', nombre: 'Asesor 1' }
  ];

  for (const user of usersToCreate) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          nombre: user.nombre
        }
      }
    });

    if (error) {
      console.error(`Error creating ${user.email}:`, error.message);
    } else {
      console.log(`Success creating ${user.email}. User ID: ${data.user?.id}`);
    }
  }
}

createUsers();
