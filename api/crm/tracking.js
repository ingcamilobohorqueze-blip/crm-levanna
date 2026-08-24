import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://gyvdmasavjxuiabjrlki.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dmRtYXNhdmp4dWlhYmpybGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTM4ODcsImV4cCI6MjA5NzM2OTg4N30.2U2qGQ43jLMOk1L2REcQtDAnjAvnU0LM86-CKbkpZ5o';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function isValidUUID(uuid) {
  if (!uuid || typeof uuid !== 'string') return false;
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
}

export default async function handler(req, res) {
  // Configuración de Cabeceras CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejo de Preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const {
      prospectId,
      commercialId,
      clientName,
      eventType,
      slideIndex,
      slideTitle,
      timeSpentSeconds,
      dataPayload,
      timestamp
    } = body || {};

    const cliente = clientName || 'El cliente';
    const slide = slideTitle || `Diapositiva ${slideIndex ?? ''}`;

    let notaText = '';

    switch (eventType) {
      case 'SLIDE_CHANGED':
        notaText = `👀 ${cliente} está revisando la propuesta comercial. "${slide}" (${timeSpentSeconds || 0}s).`;
        break;

      case 'ROI_CALCULATED':
        notaText = `🧮 ${cliente} calculó su ROI en la propuesta (${slide}). Datos: ${JSON.stringify(dataPayload || {})}`;
        break;

      case 'CTA_CLICKED':
        notaText = `🔥 ¡ATENCIÓN! ${cliente} realizó una acción clave: (${slide}).`;
        break;

      default:
        notaText = `📊 Evento propuesta comercial: ${eventType || 'Visualización'} - "${slide}" por ${cliente}.`;
        break;
    }

    let validLeadId = null;
    let validAsesorId = null;

    // Validar defensivamente el commercialId si fue enviado
    if (isValidUUID(commercialId)) {
      try {
        const { data: userCheck } = await supabase
          .from('usuarios_comerciales')
          .select('id_usuario')
          .eq('id_usuario', commercialId);

        if (userCheck && userCheck.length > 0) {
          validAsesorId = userCheck[0].id_usuario;
        }
      } catch (e) {
        console.warn('[CRM Tracking API] Error verificando usuario comercial:', e);
      }
    }

    // 1. Validar si prospectId es un id_lead existente en leads_master
    if (isValidUUID(prospectId)) {
      try {
        const { data: leadCheck } = await supabase
          .from('leads_master')
          .select('id_lead, comercial_asignado')
          .eq('id_lead', prospectId);

        if (leadCheck && leadCheck.length > 0) {
          validLeadId = leadCheck[0].id_lead;
          if (!validAsesorId && leadCheck[0].comercial_asignado) {
            validAsesorId = leadCheck[0].comercial_asignado;
          }
        }
      } catch (e) {
        console.warn('[CRM Tracking API] Error verificando lead por id:', e);
      }
    }

    // 2. Buscar en leads_master por email o por coincidencia de nombre
    if (!validLeadId && (dataPayload?.email || clientName)) {
      try {
        if (dataPayload?.email) {
          const { data: emailMatch } = await supabase
            .from('leads_master')
            .select('id_lead, comercial_asignado')
            .eq('correo_electronico', dataPayload.email);

          if (emailMatch && emailMatch.length > 0) {
            validLeadId = emailMatch[0].id_lead;
            if (!validAsesorId && emailMatch[0].comercial_asignado) {
              validAsesorId = emailMatch[0].comercial_asignado;
            }
          }
        }

        if (!validLeadId && clientName) {
          const firstWord = clientName.trim().split(' ')[0];
          const { data: nameMatch } = await supabase
            .from('leads_master')
            .select('id_lead, comercial_asignado')
            .ilike('nombre_completo', `%${firstWord}%`);

          if (nameMatch && nameMatch.length > 0) {
            validLeadId = nameMatch[0].id_lead;
            if (!validAsesorId && nameMatch[0].comercial_asignado) {
              validAsesorId = nameMatch[0].comercial_asignado;
            }
          }
        }
      } catch (e) {
        console.warn('[CRM Tracking API] Error buscando lead por nombre/email:', e);
      }
    }

    // 3. AUTO-INYECCIÓN: Si el lead no existe en el CRM, crearlo automáticamente para que aparezca en el Dashboard
    if (!validLeadId) {
      try {
        const insertPayload = {
          nombre_completo: clientName || 'Nuevo Prospecto',
          empresa: clientName || 'Nuevo Prospecto',
          origen_captura: 'Presentación Premium',
          estado_comercial: 'Propuesta_Enviada',
          comercial_asignado: validAsesorId || null
        };

        if (isValidUUID(prospectId)) {
          insertPayload.id_lead = prospectId;
        }

        const { data: createdLead, error: createErr } = await supabase
          .from('leads_master')
          .insert([insertPayload])
          .select('id_lead')
          .single();

        if (createdLead) {
          validLeadId = createdLead.id_lead;
          console.log(`[CRM Tracking API] Lead '${clientName}' creado automáticamente con id ${validLeadId}`);
        } else if (createErr) {
          console.warn('[CRM Tracking API] Error inyectando nuevo lead:', createErr);
        }
      } catch (e) {
        console.warn('[CRM Tracking API] Excepción inyectando nuevo lead:', e);
      }
    }

    // 4. Fallback final al lead más reciente si falló la creación
    if (!validLeadId) {
      try {
        const { data: fallbackLead } = await supabase
          .from('leads_master')
          .select('id_lead, comercial_asignado')
          .order('created_at', { ascending: false })
          .limit(1);

        if (fallbackLead && fallbackLead.length > 0) {
          validLeadId = fallbackLead[0].id_lead;
          if (!validAsesorId && fallbackLead[0].comercial_asignado) {
            validAsesorId = fallbackLead[0].comercial_asignado;
          }
        }
      } catch (e) {
        console.warn('[CRM Tracking API] Error obteniendo lead fallback final:', e);
      }
    }

    if (!validLeadId) {
      return res.status(400).json({ error: 'No valid lead found to log telemetry' });
    }

    // Invocar la función RPC log_telemetry
    const { data: rpcData, error: rpcErr } = await supabase.rpc('log_telemetry', {
      p_lead_id: validLeadId,
      p_asesor_id: validAsesorId,
      p_tipo_accion: eventType === 'CTA_CLICKED' ? 'Presentación Premium' : 'Presentación Premium',
      p_nota: notaText
    });

    if (rpcErr) {
      console.error('[CRM Tracking API] RPC log_telemetry falló:', rpcErr);
      return res.status(500).json({ error: rpcErr.message });
    }

    console.log(`[CRM Tracking API] Evento ${eventType} registrado exitosamente para lead ${validLeadId}`);

    return res.status(200).json({
      success: true,
      message: 'Telemetry event logged successfully via RPC',
      result: rpcData,
      registeredLeadId: validLeadId
    });

  } catch (err) {
    console.error('[CRM Tracking API] Internal Exception:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
