import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://gyvdmasavjxuiabjrlki.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dmRtYXNhdmp4dWlhYmpybGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTM4ODcsImV4cCI6MjA5NzM2OTg4N30.2U2qGQ43jLMOk1L2REcQtDAnjAvnU0LM86-CKbkpZ5o';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
        notaText = `👀 ${cliente} está revisando la Presentación Premium. Diapositiva ${slideIndex}: "${slide}" (${timeSpentSeconds || 0}s).`;
        break;

      case 'ROI_CALCULATED':
        notaText = `🧮 ${cliente} calculó su ROI en la Presentación Premium (${slide}). Datos: ${JSON.stringify(dataPayload || {})}`;
        break;

      case 'CTA_CLICKED':
        notaText = `🔥 ¡ATENCIÓN! ${cliente} hizo clic en el botón de acción (${slide}).`;
        break;

      default:
        notaText = `📊 Evento Presentación Premium: ${eventType || 'Visualización'} - "${slide}" por ${cliente}.`;
        break;
    }

    const leadIdValid = isValidUUID(prospectId) ? prospectId : null;
    const commercialIdValid = isValidUUID(commercialId) ? commercialId : null;

    if (!leadIdValid) {
      console.warn('[CRM Tracking API] Se recibió evento sin prospectId válido:', prospectId);
      return res.status(400).json({ error: 'Invalid or missing prospectId UUID' });
    }

    // Intentar primero con la función RPC log_telemetry (SECURITY DEFINER para omitir RLS)
    const { data: rpcData, error: rpcErr } = await supabase.rpc('log_telemetry', {
      p_lead_id: leadIdValid,
      p_asesor_id: commercialIdValid,
      p_tipo_accion: 'Presentación Premium',
      p_nota: notaText
    });

    if (rpcErr) {
      console.warn('[CRM Tracking API] RPC log_telemetry falló, intentando inserción directa:', rpcErr);
      const { data: insData, error: insErr } = await supabase
        .from('historial_interacciones')
        .insert([{
          id_lead: leadIdValid,
          id_usuario: commercialIdValid,
          tipo_accion: 'Presentación Premium',
          nota: notaText
        }])
        .select();

      if (insErr) {
        console.error('[CRM Tracking API] Error de inserción en Supabase:', insErr);
        return res.status(500).json({ error: insErr.message });
      }

      return res.status(200).json({
        success: true,
        message: 'Telemetry event logged via direct insert',
        interaction: insData ? insData[0] : null
      });
    }

    console.log(`[CRM Tracking API] Registrado evento ${eventType} vía RPC log_telemetry para lead ${leadIdValid}`);

    return res.status(200).json({
      success: true,
      message: 'Telemetry event logged successfully via RPC',
      result: rpcData
    });

  } catch (err) {
    console.error('[CRM Tracking API] Internal Exception:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
