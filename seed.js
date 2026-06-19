import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Seeding mock data into Supabase...');

  // 1. We don't have real auth users, but the leads_master table references comercial_asignado -> usuarios_comerciales.id_usuario which references auth.users(id).
  // Wait! RLS policies and foreign keys require a real auth.users ID.
  // If we try to insert a uuid that doesn't exist in auth.users into usuarios_comerciales, it will fail due to the FK constraint.
  // Because we haven't created users in Supabase Auth, let's insert leads with comercial_asignado = null.
  
  const mockLeads = [
    {
      nombre_completo: 'Carlos Mendoza',
      empresa: 'TechSolutions SA',
      temperatura_tier: 'HOT',
      estado_comercial: 'Nuevo',
      origen_captura: 'Web_Urgente',
      dolor_identificado: 'El sistema actual colapsa con 1000 usuarios concurrentes.',
      telefono_whatsapp: '+573001234567',
      correo_electronico: 'carlos@techsolutions.com',
    },
    {
      nombre_completo: 'Laura Jiménez',
      empresa: 'Constructora Horizon',
      temperatura_tier: 'WARM',
      estado_comercial: 'Contactado',
      origen_captura: 'Bot_WhatsApp',
      dolor_identificado: 'Buscan centralizar el manejo de proveedores.',
      telefono_whatsapp: '+573119876543',
      correo_electronico: 'laura.j@horizon.com',
    },
    {
      nombre_completo: 'Andrés Castro',
      empresa: 'Logística Sur',
      temperatura_tier: 'HOT',
      estado_comercial: 'Reunión_Agendada',
      origen_captura: 'Web_Curioso',
      dolor_identificado: 'Costos ocultos en sus rutas de entrega.',
      telefono_whatsapp: '+573204567890',
      correo_electronico: 'acastro@logsur.com',
    },
    {
      nombre_completo: 'Sofia Vergara',
      empresa: 'Retail Moda',
      temperatura_tier: 'COLD',
      estado_comercial: 'Nuevo',
      origen_captura: 'Scraping_Cold',
      dolor_identificado: 'Baja retención de clientes físicos.',
      telefono_whatsapp: '+573100000000',
      correo_electronico: 'sofia@retailmoda.com',
    }
  ];

  const { data, error } = await supabase.from('leads_master').insert(mockLeads).select();

  if (error) {
    console.error('Error inserting leads:', error.message);
  } else {
    console.log('Successfully inserted leads:', data.length);
  }
}

seed();
