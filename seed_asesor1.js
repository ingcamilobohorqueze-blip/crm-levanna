import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedAsesor1Leads() {
  console.log('Signing in...');
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: 'comercial.levannadc@gmail.com',
    password: 'Levanna2026'
  });

  if (signInError) {
    console.error('Error signing in:', signInError.message);
    return;
  }

  console.log('Fetching Asesor 1...');
  const { data: asesor, error: fetchError } = await supabase
    .from('usuarios_comerciales')
    .select('id_usuario, nombre')
    .eq('email', 'comercial.levannadc@gmail.com')
    .single();

  if (fetchError || !asesor) {
    console.error('Error fetching Asesor 1:', fetchError?.message || 'Not found');
    return;
  }

  console.log(`Found Asesor 1: ${asesor.nombre} (${asesor.id_usuario})`);

  const mockLeads = [
    {
      nombre_completo: 'Miguel Gómez',
      empresa: 'Gómez & Asociados',
      temperatura_tier: 'HOT',
      estado_comercial: 'Nuevo',
      origen_captura: 'Web_Urgente',
      dolor_identificado: 'Falta de automatización en seguimiento a clientes.',
      telefono_whatsapp: '+573105551234',
      correo_electronico: 'miguel@gomezasociados.com',
      comercial_asignado: asesor.id_usuario
    },
    {
      nombre_completo: 'Valeria Martínez',
      empresa: 'Boutique Elegance',
      temperatura_tier: 'WARM',
      estado_comercial: 'Contactado',
      origen_captura: 'Bot_WhatsApp',
      dolor_identificado: 'Problemas gestionando inventario y ventas online.',
      telefono_whatsapp: '+573216549870',
      correo_electronico: 'contacto@boutiqueelegance.com',
      comercial_asignado: asesor.id_usuario
    },
    {
      nombre_completo: 'Esteban Ramírez',
      empresa: 'Ramírez Consultores',
      temperatura_tier: 'HOT',
      estado_comercial: 'Reunión_Agendada',
      origen_captura: 'Web_Curioso',
      dolor_identificado: 'Requieren migrar datos de Excel a la nube.',
      telefono_whatsapp: '+573117778899',
      correo_electronico: 'eramirez@consultores.com',
      comercial_asignado: asesor.id_usuario
    },
    {
      nombre_completo: 'Catalina Suárez',
      empresa: 'Inversiones Suárez',
      temperatura_tier: 'COLD',
      estado_comercial: 'Nuevo',
      origen_captura: 'Scraping_Cold',
      dolor_identificado: 'Buscando mejorar los reportes financieros.',
      telefono_whatsapp: '+573150001122',
      correo_electronico: 'gerencia@inversiones-suarez.com',
      comercial_asignado: asesor.id_usuario
    },
    {
      nombre_completo: 'Javier Domínguez',
      empresa: 'Transportes Rápidos',
      temperatura_tier: 'WARM',
      estado_comercial: 'Propuesta_Enviada',
      origen_captura: 'Bot_WhatsApp',
      dolor_identificado: 'No saben en tiempo real el estado de sus vehículos.',
      telefono_whatsapp: '+573109998877',
      correo_electronico: 'operaciones@transportesrapidos.com',
      comercial_asignado: asesor.id_usuario
    }
  ];

  console.log('Inserting mock leads...');
  const { data, error } = await supabase.from('leads_master').insert(mockLeads).select();

  if (error) {
    console.error('Error inserting leads:', error.message);
  } else {
    console.log(`Successfully inserted ${data.length} leads assigned to Asesor 1.`);
  }
}

seedAsesor1Leads();
