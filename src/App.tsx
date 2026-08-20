import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Bell, Search, MessageCircle, Mail, LayoutDashboard, Users, Settings, LogOut, Briefcase, Plus, X, BarChart3, Copy, BookOpen, Edit2, Link, UserPlus, Share2, ChevronDown } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const TEMPLATES = [
  { id: 1, name: 'Primer Contacto (Frío)', subject: 'Mejora la gestión en tu empresa', body: 'Hola {nombre},\n\nHe notado que en {empresa} podrían beneficiarse de una solución para: {dolor}.\n\nMe gustaría mostrarte cómo Levanna puede ayudar. ¿Tienes 10 minutos el martes?\n\nSaludos,' },
  { id: 2, name: 'Envío de Propuesta y Cotización', subject: 'Propuesta Comercial y Cotización - Levanna', body: 'Hola {nombre},\n\nGracias por tu tiempo. Te comparto nuestra propuesta comercial y cotizador interactivo para abordar {dolor}:\n\n{link_cotizador}\n\nQuedo atento a tus comentarios para cualquier inquietud.' },
];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo-blue.png" alt="CRM Logo" style={{ width: '80px', marginBottom: '1rem' }} />
          <h2>CRM Comercial</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '8px', fontSize: '0.875rem' }}>{error}</div>}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Correo Institucional</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem' }} 
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem' }} 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', background: 'var(--accent-color)', color: '#fff', border: 'none' }}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
          
          {deferredPrompt && (
            <button type="button" onClick={handleInstallClick} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              ⬇️ Instalar App (Windows / Android)
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<'admin' | 'asesor' | null>(null);
  const [userAlias, setUserAlias] = useState('');
  
  const [activeTab, setActiveTab] = useState<'bandeja'|'admin'|'todos'>('bandeja');
  const [leads, setLeads] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [asesores, setAsesores] = useState<any[]>([]);
  
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [newNote, setNewNote] = useState('');
  
  const STATUS_OPTIONS = [
    { value: 'Nuevo', label: 'Nuevo', color: '#93c5fd', bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.4)' },
    { value: 'Contactado', label: '💬 Contactado', color: '#fde047', bg: 'rgba(234, 179, 8, 0.2)', border: 'rgba(234, 179, 8, 0.4)' },
    { value: 'Reunión_Agendada', label: '📅 Reunión Agendada', color: '#c084fc', bg: 'rgba(168, 85, 247, 0.2)', border: 'rgba(168, 85, 247, 0.4)' },
    { value: 'Propuesta_Enviada', label: '📄 Propuesta Enviada', color: '#93c5fd', bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.4)' },
    { value: 'Cerrado_Ganado', label: '🟢 Cerrado (Ganado)', color: '#4ade80', bg: 'rgba(34, 197, 94, 0.25)', border: 'rgba(34, 197, 94, 0.5)' },
    { value: 'Cerrado_Perdido', label: '⚪ Cerrado (Perdido)', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.2)', border: 'rgba(148, 163, 184, 0.4)' },
  ];

  // Modals & Menu State
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ nombre_completo: '', empresa: '', telefono_whatsapp: '', correo_electronico: '' });
  
  // Inyección de Lead State
  const [showInjectModal, setShowInjectModal] = useState(false);
  const [injecting, setInjecting] = useState(false);
  const [injectFormData, setInjectFormData] = useState({
    nombre_completo: '',
    empresa: '',
    telefono_whatsapp: '',
    correo_electronico: '',
    origen_captura: 'Contacto_Directo',
    temperatura_tier: 'HOT',
    estado_comercial: 'Propuesta_Enviada',
    comercial_asignado: '',
    dolor_identificado: ''
  });

  // Library State
  const [libraryLinks] = useState([
    { id: 1, title: 'Generador de propuestas', type: 'doc', url: 'https://levanna-tenant-hub-hub.vercel.app/cotizador_comercial.html' },
    { id: 2, title: 'Presentación Premium', type: 'doc', url: '#' },
    { id: 3, title: 'Manejo de Objeciones', type: 'chat', url: '#' },
    { id: 4, title: 'Carpeta Drive Completa', type: 'folder', url: '#' }
  ]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        setSession(session);
        await checkUserRole(session.user.id);
        loadAsesores();
        loadLeads();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) navigate('/login');
      else {
        setSession(session);
        await checkUserRole(session.user.id);
        loadAsesores();
        loadLeads();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (selectedLead && activeTab !== 'todos') {
      loadTimeline(selectedLead.id_lead);

      // Suscripción en Tiempo Real a las vistas e interacciones del cliente
      const channel = supabase
        .channel(`timeline_${selectedLead.id_lead}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'historial_interacciones',
          filter: `id_lead=eq.${selectedLead.id_lead}`
        }, (payload) => {
          setTimeline(prev => [payload.new, ...prev]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedLead, activeTab]);

  const checkUserRole = async (userId: string) => {
    const { data, error } = await supabase.from('usuarios_comerciales').select('rol, nombre').eq('id_usuario', userId).single();
    if (error) {
      alert(`Error cargando usuario: ${error.message}. UUID: ${userId}`);
    }
    if (data) {
      setUserRole(data.rol);
      setUserAlias(data.nombre);
      if (data.rol === 'admin') {
        setActiveTab('admin');
      }
    }
  };

  const loadAsesores = async () => {
    const { data } = await supabase.from('usuarios_comerciales').select('*').eq('activo', true);
    if (data) setAsesores(data);
  };

  const openInjectModal = () => {
    setInjectFormData({
      nombre_completo: '',
      empresa: '',
      telefono_whatsapp: '',
      correo_electronico: '',
      origen_captura: 'Contacto_Directo',
      temperatura_tier: 'HOT',
      estado_comercial: 'Propuesta_Enviada',
      comercial_asignado: session?.user?.id || '',
      dolor_identificado: 'Cliente de propuesta directa / contacto externo'
    });
    setShowInjectModal(true);
  };

  const handleInjectLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!injectFormData.nombre_completo || !injectFormData.telefono_whatsapp) {
      alert('Por favor completa el nombre completo y el teléfono / WhatsApp.');
      return;
    }
    setInjecting(true);
    try {
      // Intentar primero RPC upsert_lead si está desplegada la última versión
      const { error: rpcErr } = await supabase.rpc('upsert_lead', {
        p_nombre: injectFormData.nombre_completo,
        p_telefono: injectFormData.telefono_whatsapp,
        p_correo: injectFormData.correo_electronico || null,
        p_empresa: injectFormData.empresa || null,
        p_origen: injectFormData.origen_captura,
        p_dolor: injectFormData.dolor_identificado || 'Inyección manual desde el CRM',
        p_terminos_aceptados: true,
        p_comercial_id: injectFormData.comercial_asignado || session?.user?.id,
        p_estado_inicial: injectFormData.estado_comercial
      });

      if (rpcErr) {
        console.warn('Invocando inserción directa como respaldo por RPC:', rpcErr);
        // Respaldo de inserción directa a la tabla leads_master
        const { data: insertedLead, error: insErr } = await supabase.from('leads_master').insert([{
          nombre_completo: injectFormData.nombre_completo,
          empresa: injectFormData.empresa || null,
          telefono_whatsapp: injectFormData.telefono_whatsapp,
          correo_electronico: injectFormData.correo_electronico || null,
          origen_captura: injectFormData.origen_captura,
          temperatura_tier: injectFormData.temperatura_tier,
          estado_comercial: injectFormData.estado_comercial,
          comercial_asignado: injectFormData.comercial_asignado || session?.user?.id,
          dolor_identificado: injectFormData.dolor_identificado || 'Cliente inyectado manualmente',
          terminos_aceptados: true
        }]).select().single();

        if (insErr) throw insErr;

        if (insertedLead) {
          await supabase.from('historial_interacciones').insert([{
            id_lead: insertedLead.id_lead,
            id_usuario: session?.user?.id,
            tipo_accion: 'Inyección Manual',
            nota: `Cliente inyectado manualmente por ${userAlias} con origen ${injectFormData.origen_captura}.`
          }]);
        }
      }

      const comercialNombre = asesores.find(a => a.id_usuario === injectFormData.comercial_asignado)?.nombre || userAlias;
      alert(`¡Cliente "${injectFormData.nombre_completo}" inyectado con éxito en la base de datos! Asignado a: ${comercialNombre}`);
      setShowInjectModal(false);
      await loadLeads();
    } catch (err: any) {
      alert(`Error al inyectar el cliente: ${err.message || err}`);
    } finally {
      setInjecting(false);
    }
  };

  const copyTrackableLink = (linkUrl: string, linkTitle: string) => {
    const currentAdvisorId = session?.user?.id || '';
    const currentAdvisorName = userAlias || 'Asesor';
    
    if (!linkUrl || linkUrl === '#') {
      alert('Este recurso no posee una URL externa configurada.');
      return;
    }

    const separator = linkUrl.includes('?') ? '&' : '?';
    const trackableUrl = `${linkUrl}${separator}ref_asesor=${currentAdvisorId}&asesor=${encodeURIComponent(currentAdvisorName)}&origen=Cotizador_Propuesta`;
    
    navigator.clipboard.writeText(trackableUrl);
    alert(`¡Link Trazable Copiado!\n\nRecurso: ${linkTitle}\nEnlace: ${trackableUrl}\n\nCuando el cliente abra y complete este formulario, se inyectará en el CRM asignado automáticamente a: ${currentAdvisorName}.`);
  };

  const loadLeads = async () => {
    console.log('Fetching leads from Supabase...');
    const { data, error } = await supabase.from('leads_master').select(`*, usuarios_comerciales(nombre)`).order('created_at', { ascending: false });
    console.log('Leads fetched:', data, 'Error:', error);
    if (error) {
      alert(`Error cargando leads: ${error.message}`);
    }
    if (data && !error) {
      setLeads(data);
      if (data.length > 0 && !selectedLead) setSelectedLead(data[0]);
    }
  };

  const loadTimeline = async (leadId: string) => {
    const { data } = await supabase.from('historial_interacciones').select('*').eq('id_lead', leadId).order('created_at', { ascending: false });
    if (data) setTimeline(data);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.clear(); // Force clear tokens if supabase is stuck
      window.location.href = '/login'; // Hard redirect
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'HOT': return 'tier-hot';
      case 'WARM': return 'tier-warm';
      case 'COLD': return 'tier-cold';
      case 'LAG': return 'tier-lag';
      default: return 'tier-lag';
    }
  };

  const renderCardBadge = (lead: any) => {
    switch (lead.estado_comercial) {
      case 'Cerrado_Ganado':
        return (
          <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.25)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.4)', fontWeight: 700 }}>
            🟢 Cerrado (Ganado)
          </span>
        );
      case 'Cerrado_Perdido':
        return (
          <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.3)', fontWeight: 600 }}>
            ⚪ Cerrado (Perdido)
          </span>
        );
      case 'Propuesta_Enviada':
        return (
          <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.25)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
            📄 Propuesta Enviada
          </span>
        );
      case 'Reunión_Agendada':
        return (
          <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.25)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
            📅 Reunión Agendada
          </span>
        );
      case 'Contactado':
        return (
          <span className="badge" style={{ background: 'rgba(234, 179, 8, 0.25)', color: '#fde047', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
            💬 Contactado
          </span>
        );
      default:
        return (
          <span className={`badge ${getTierColor(lead.temperatura_tier)}`}>
            {lead.temperatura_tier}
          </span>
        );
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedLead) return;
    const updatedLeads = leads.map(l => l.id_lead === selectedLead.id_lead ? { ...l, estado_comercial: newStatus } : l);
    setLeads(updatedLeads);
    setSelectedLead({ ...selectedLead, estado_comercial: newStatus });
    await supabase.from('leads_master').update({ estado_comercial: newStatus }).eq('id_lead', selectedLead.id_lead);
    loadTimeline(selectedLead.id_lead);
  };

  const handleAssignLead = async (leadId: string, asesorId: string) => {
    const value = asesorId === 'null' ? null : asesorId;
    await supabase.from('leads_master').update({ comercial_asignado: value }).eq('id_lead', leadId);
    loadLeads();
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedLead || !session) return;
    await supabase.from('historial_interacciones').insert([{
      id_lead: selectedLead.id_lead,
      id_usuario: session.user.id,
      tipo_accion: 'Nota',
      nota: newNote
    }]);
    setNewNote('');
    loadTimeline(selectedLead.id_lead);
  };

  const handleWhatsApp = async (lead: any) => {
    const message = `Hola ${lead.nombre_completo}, me contacto de Levanna. Vi que estás interesado en solucionar tu problema con: ${lead.dolor_identificado}. ¿Tienes un momento para conversar?`;
    window.open(`https://wa.me/${lead.telefono_whatsapp?.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    
    await supabase.from('historial_interacciones').insert([{
      id_lead: lead.id_lead,
      id_usuario: session.user.id,
      tipo_accion: 'Chat WhatsApp',
      nota: 'Se abrió chat de WhatsApp'
    }]);
    loadTimeline(lead.id_lead);
  };

  const openCotizadorHub = (lead: any) => {
    if (!lead || !session) return;
    const currentAdvisorId = session.user.id;
    const currentAdvisorName = userAlias || 'Asesor';
    const empresaCliente = lead.empresa || lead.nombre_completo;
    const cotizacionCode = `LEV-2026-${empresaCliente.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 8)}`;
    
    const hubUrl = `https://levanna-tenant-hub-hub.vercel.app/cotizador_comercial.html?cliente=${encodeURIComponent(empresaCliente)}&contacto=${encodeURIComponent(lead.nombre_completo)}&email=${encodeURIComponent(lead.correo_electronico || '')}&telefono=${encodeURIComponent(lead.telefono_whatsapp || '')}&cotizacion=${cotizacionCode}&ref_asesor=${currentAdvisorId}&asesor=${encodeURIComponent(currentAdvisorName)}&lead_id=${lead.id_lead}`;
    
    window.open(hubUrl, '_blank');
  };

  const handleSendProposal = async (lead: any) => {
    if (!lead || !session) return;
    const currentAdvisorId = session.user.id;
    const currentAdvisorName = userAlias || 'Asesor';
    const empresaCliente = lead.empresa || lead.nombre_completo;
    const cotizacionCode = `LEV-2026-${empresaCliente.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 8)}`;

    // Enlace DIRECTO PÚBLICO para el cliente (cotizacion.html) con sus datos prediligenciados
    const publicClientUrl = `https://levanna-tenant-hub-hub.vercel.app/cotizacion.html?cliente=${encodeURIComponent(empresaCliente)}&contacto=${encodeURIComponent(lead.nombre_completo)}&email=${encodeURIComponent(lead.correo_electronico || '')}&telefono=${encodeURIComponent(lead.telefono_whatsapp || '')}&cotizacion=${cotizacionCode}&ref_asesor=${currentAdvisorId}&asesor=${encodeURIComponent(currentAdvisorName)}&lead_id=${lead.id_lead}`;

    const message = `Hola ${lead.nombre_completo}, te comparto nuestra propuesta comercial y cotización interactiva para que puedas revisar los detalles de ${empresaCliente}:\n\n${publicClientUrl}\n\nQuedo a tu disposición ante cualquier duda o ajuste.`;
    
    window.open(`https://wa.me/${lead.telefono_whatsapp?.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');

    await supabase.from('historial_interacciones').insert([{
      id_lead: lead.id_lead,
      id_usuario: session.user.id,
      tipo_accion: 'Envío de Cotización',
      nota: `Se compartió la propuesta comercial directa al cliente por WhatsApp.`
    }]);

    if (lead.estado_comercial !== 'Propuesta_Enviada') {
      await supabase.from('leads_master').update({ estado_comercial: 'Propuesta_Enviada' }).eq('id_lead', lead.id_lead);
      setSelectedLead({ ...lead, estado_comercial: 'Propuesta_Enviada' });
      setLeads(leads.map(l => l.id_lead === lead.id_lead ? { ...l, estado_comercial: 'Propuesta_Enviada' } : l));
    }

    loadTimeline(lead.id_lead);
  };

  const copyTemplate = async (template: any) => {
    if (!selectedLead || !session) return;
    const currentAdvisorId = session.user.id;
    const currentAdvisorName = userAlias || 'Asesor';
    const empresaCliente = selectedLead.empresa || selectedLead.nombre_completo;
    const cotizacionCode = `LEV-2026-${empresaCliente.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 8)}`;
    
    const publicClientUrl = `https://levanna-tenant-hub-hub.vercel.app/cotizacion.html?cliente=${encodeURIComponent(empresaCliente)}&contacto=${encodeURIComponent(selectedLead.nombre_completo)}&email=${encodeURIComponent(selectedLead.correo_electronico || '')}&telefono=${encodeURIComponent(selectedLead.telefono_whatsapp || '')}&cotizacion=${cotizacionCode}&ref_asesor=${currentAdvisorId}&asesor=${encodeURIComponent(currentAdvisorName)}&lead_id=${selectedLead.id_lead}`;

    const body = template.body
      .replace('{nombre}', selectedLead.nombre_completo)
      .replace('{empresa}', selectedLead.empresa || 'tu empresa')
      .replace('{dolor}', selectedLead.dolor_identificado || 'tus procesos')
      .replace('{link_cotizador}', publicClientUrl);
    
    navigator.clipboard.writeText(`Asunto: ${template.subject}\n\n${body}`);
    setShowTemplatesModal(false);
    alert('¡Plantilla copiada al portapapeles con el link prediligenciado del cliente!');

    await supabase.from('historial_interacciones').insert([{
      id_lead: selectedLead.id_lead,
      id_usuario: session.user.id,
      tipo_accion: 'Envío de Cotización',
      nota: `Se copió la plantilla "${template.name}" con enlace directo de cotización prediligenciada.`
    }]);
    loadTimeline(selectedLead.id_lead);
  };

  const handleSaveEdit = async () => {
    if (!selectedLead) return;
    const { error } = await supabase.from('leads_master').update(editFormData).eq('id_lead', selectedLead.id_lead);
    if (!error) {
      const updatedLead = { ...selectedLead, ...editFormData };
      setSelectedLead(updatedLead);
      setLeads(leads.map(l => l.id_lead === updatedLead.id_lead ? updatedLead : l));
      setShowEditModal(false);
      
      await supabase.from('historial_interacciones').insert([{
        id_lead: updatedLead.id_lead,
        id_usuario: session.user.id,
        tipo_accion: 'Actualización',
        nota: 'Se actualizaron los datos de contacto/empresa del lead.'
      }]);
      loadTimeline(updatedLead.id_lead);
    } else {
      alert('Error guardando cambios');
    }
  };

  // Filtramos leads según la pestaña activa
  const leadsToShow = activeTab === 'admin' || activeTab === 'todos' 
    ? leads 
    : leads.filter(l => l.comercial_asignado === session?.user?.id);

  if (!session) return null;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo-blue.png" alt="CRM Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} onError={(e) => e.currentTarget.style.display = 'none'} />
          <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.2rem' }}>CRM Levanna</h2>
        </div>
        
        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === 'bandeja' ? 'var(--accent-color)' : 'transparent', color: activeTab === 'bandeja' ? '#fff' : 'var(--text-secondary)' }} onClick={(e) => { e.preventDefault(); setActiveTab('bandeja'); }}>
            <LayoutDashboard size={20} /> Bandeja (Asesor)
          </a>
          
          {userRole === 'admin' && (
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === 'admin' ? 'var(--accent-color)' : 'transparent', color: activeTab === 'admin' ? '#fff' : 'var(--text-secondary)' }} onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }}>
              <BarChart3 size={20} /> Dashboard Global
            </a>
          )}
          
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === 'todos' ? 'var(--accent-color)' : 'transparent', color: activeTab === 'todos' ? '#fff' : 'var(--text-secondary)' }} onClick={(e) => { e.preventDefault(); setActiveTab('todos'); }}>
            <Users size={20} /> Todos los Clientes
          </a>
          
          <a href="#" onClick={(e) => { e.preventDefault(); setShowLibraryModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)' }}>
            <BookOpen size={20} /> Biblioteca de Recursos
          </a>
          
          {userRole === 'admin' && (
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)' }}>
              <Settings size={20} /> Configuración
            </a>
          )}
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase' }}>
              {userAlias ? userAlias.charAt(0) : '?'}
            </div>
            {userAlias || 'Usuario Desconectado'} {userRole ? `(${userRole})` : ''}
          </div>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <LogOut size={16} /> Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>
              {activeTab === 'admin' && 'Visión Global (Admin)'}
              {activeTab === 'bandeja' && `Hola, ${userAlias} 👋`}
              {activeTab === 'todos' && 'Directorio de Clientes'}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {activeTab === 'todos' ? `Total de registros: ${leads.length}` : `Tienes ${leadsToShow.filter(l => l.estado_comercial === 'Nuevo').length} leads nuevos.`}
            </p>
          </div>
          
          {/* Header Utilities (Search, Inject & Bell) */}
          <div style={{ display: 'flex', gap: '1rem', position: 'relative', alignItems: 'center' }}>
            <button 
              onClick={openInjectModal} 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
            >
              <UserPlus size={18} /> + Inyectar Lead
            </button>

            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Buscar cliente..." style={{ paddingLeft: '2.5rem', width: '250px' }} />
            </div>
            <button onClick={() => setShowNotifications(!showNotifications)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem' }}>
              <Bell size={18} color="var(--text-secondary)" />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--tier-hot)', width: '10px', height: '10px', borderRadius: '50%' }}></span>
            </button>
            
            {showNotifications && (
              <div className="glass-panel animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '300px', zIndex: 50, padding: '1rem' }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Notificaciones</h4>
                <div style={{ fontSize: '0.875rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--glass-border)' }}>
                  <strong style={{ color: 'var(--tier-hot)' }}>🔴 SLA Vencido</strong>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>El lead Carlos Mendoza lleva 30 mins sin contacto.</p>
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  <strong style={{ color: 'var(--tier-cold)' }}>🔵 Nueva asignación</strong>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>Se te asignó 1 lead COLD por Round-Robin.</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {activeTab === 'todos' ? (
          // Vista Todos Los Clientes (Tabla)
          <section className="glass-panel" style={{ flex: 1, overflow: 'auto', padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <th style={{ padding: '1rem' }}>ID Lead</th>
                    <th style={{ padding: '1rem' }}>Nombre Completo</th>
                    <th style={{ padding: '1rem' }}>WhatsApp</th>
                    <th style={{ padding: '1rem' }}>Correo Electrónico</th>
                    <th style={{ padding: '1rem' }}>Empresa</th>
                    <th style={{ padding: '1rem' }}>Origen</th>
                    <th style={{ padding: '1rem' }}>Tier</th>
                    <th style={{ padding: '1rem' }}>Estado Comercial</th>
                    <th style={{ padding: '1rem' }}>Dolor Identificado</th>
                    <th style={{ padding: '1rem' }}>Último Contacto</th>
                    <th style={{ padding: '1rem' }}>Comercial Asignado</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.875rem' }}>
                  {leads.map(lead => (
                    <tr key={lead.id_lead} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }} title={lead.id_lead}>{lead.id_lead.substring(0, 8)}...</td>
                      <td style={{ padding: '1rem' }}><strong>{lead.nombre_completo}</strong></td>
                      <td style={{ padding: '1rem' }}>{lead.telefono_whatsapp || '-'}</td>
                      <td style={{ padding: '1rem' }}>{lead.correo_electronico || '-'}</td>
                      <td style={{ padding: '1rem' }}>{lead.empresa || '-'}</td>
                      <td style={{ padding: '1rem' }}>{lead.origen_captura?.replace('_', ' ')}</td>
                      <td style={{ padding: '1rem' }}><span className={`badge ${getTierColor(lead.temperatura_tier)}`}>{lead.temperatura_tier}</span></td>
                      <td style={{ padding: '1rem' }}>{lead.estado_comercial?.replace('_', ' ')}</td>
                      <td style={{ padding: '1rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={lead.dolor_identificado}>{lead.dolor_identificado || '-'}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {lead.ultimo_contacto ? formatDistanceToNow(new Date(lead.ultimo_contacto), { addSuffix: true, locale: es }) : '-'}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {userRole === 'admin' ? (
                          <select 
                            value={lead.comercial_asignado || 'null'}
                            onChange={(e) => handleAssignLead(lead.id_lead, e.target.value)}
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.875rem', maxWidth: '140px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}
                          >
                            <option value="null">Sin asignar</option>
                            {asesores.map(asesor => (
                              <option key={asesor.id_usuario} value={asesor.id_usuario}>{asesor.nombre}</option>
                            ))}
                          </select>
                        ) : (
                          lead.usuarios_comerciales?.nombre || 'Sin asignar'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          // Vista Bandeja / Admin (Split View)
          <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'admin' ? '1fr' : '1fr 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
            {/* List Column */}
            <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{activeTab === 'admin' ? 'Gestión de Leads' : 'Bandeja Priorizada'}</h3>
              </div>
              
              <div style={{ overflowY: 'auto', flex: 1, padding: '1rem', display: activeTab === 'admin' ? 'grid' : 'block', gridTemplateColumns: activeTab === 'admin' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr', gap: activeTab === 'admin' ? '1rem' : '0' }}>
                {leadsToShow.map((lead) => (
                  <div 
                    key={lead.id_lead} 
                    className="glass-card animate-fade-in"
                    style={{ 
                      marginBottom: activeTab === 'admin' ? '0' : '1rem', 
                      cursor: 'pointer',
                      borderColor: selectedLead?.id_lead === lead.id_lead ? 'var(--accent-color)' : 'var(--glass-border)'
                    }}
                    onClick={() => { setActiveTab('bandeja'); setSelectedLead(lead); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                      {renderCardBadge(lead)}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: es })}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{lead.nombre_completo}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Briefcase size={14} /> {lead.empresa || 'Sin empresa'}
                    </p>
                    
                    {activeTab === 'admin' && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Asignado a:</span>
                        <select 
                          value={lead.comercial_asignado || 'null'}
                          onChange={(e) => handleAssignLead(lead.id_lead, e.target.value)}
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.875rem', maxWidth: '120px' }}
                        >
                          <option value="null">Sin asignar</option>
                          {asesores.map(asesor => (
                            <option key={asesor.id_usuario} value={asesor.id_usuario}>{asesor.nombre}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Detail Column */}
            {activeTab === 'bandeja' && (
            <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              {selectedLead ? (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{selectedLead.nombre_completo}</h2>
                        <button 
                          onClick={() => { setEditFormData({ nombre_completo: selectedLead.nombre_completo, empresa: selectedLead.empresa || '', telefono_whatsapp: selectedLead.telefono_whatsapp || '', correo_electronico: selectedLead.correo_electronico || '' }); setShowEditModal(true); }} 
                          style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                          title="Editar información"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>{selectedLead.empresa || 'Individual / Sin empresa'}</p>
                    </div>
                    
                    {/* Custom Status Dropdown Menu (Evita errores de estilo nativo del navegador) */}
                    <div style={{ position: 'relative' }}>
                      {(() => {
                        const currentOpt = STATUS_OPTIONS.find(o => o.value === selectedLead.estado_comercial) || STATUS_OPTIONS[0];
                        return (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowStatusMenu(!showStatusMenu);
                              }}
                              style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                background: currentOpt.bg,
                                color: currentOpt.color,
                                border: `1px solid ${currentOpt.border}`,
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer'
                              }}
                            >
                              {currentOpt.label} <ChevronDown size={16} />
                            </button>

                            {showStatusMenu && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  position: 'absolute',
                                  top: '115%',
                                  right: 0,
                                  width: '220px',
                                  backgroundColor: '#0f172a',
                                  border: '1px solid rgba(255, 255, 255, 0.15)',
                                  borderRadius: '10px',
                                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                                  zIndex: 100,
                                  padding: '0.4rem 0'
                                }}
                              >
                                {STATUS_OPTIONS.map(opt => (
                                  <div
                                    key={opt.value}
                                    onClick={() => {
                                      handleStatusChange(opt.value);
                                      setShowStatusMenu(false);
                                    }}
                                    style={{
                                      padding: '0.65rem 1rem',
                                      fontSize: '0.875rem',
                                      fontWeight: selectedLead.estado_comercial === opt.value ? 700 : 500,
                                      color: opt.color,
                                      backgroundColor: selectedLead.estado_comercial === opt.value ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      transition: 'background 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedLead.estado_comercial === opt.value ? 'rgba(255, 255, 255, 0.12)' : 'transparent'}
                                  >
                                    {opt.label}
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="glass-card" style={{ padding: '1rem' }}>
                      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 600 }}>Teléfono</p>
                      <p style={{ margin: 0, fontWeight: 500 }}>{selectedLead.telefono_whatsapp}</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1rem' }}>
                      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 600 }}>Correo</p>
                      <p style={{ margin: 0, fontWeight: 500, wordBreak: 'break-all' }}>{selectedLead.correo_electronico}</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1rem', gridColumn: '1 / -1' }}>
                      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Dolor Identificado</p>
                      <p style={{ margin: 0, lineHeight: 1.6 }}>{selectedLead.dolor_identificado}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                    <button onClick={() => handleWhatsApp(selectedLead)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                      <MessageCircle size={18} /> Chat WhatsApp
                    </button>
                    <button onClick={() => handleSendProposal(selectedLead)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--accent-color)', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                      <Share2 size={18} /> Enviar Cotización Directa
                    </button>
                    <button onClick={() => openCotizadorHub(selectedLead)} style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.65rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                      <Settings size={16} /> ⚙️ Personalizar en Cotizador Hub (Asesor)
                    </button>
                    <button onClick={() => setShowTemplatesModal(true)} style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <Mail size={16} /> Plantillas de Correo
                    </button>
                  </div>

                  <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Línea de Tiempo</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <input 
                      type="text" 
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Agregar nota sobre el cliente..." 
                      style={{ flex: 1 }}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                    />
                    <button onClick={handleAddNote} style={{ padding: '0.6em' }}><Plus size={18} /></button>
                  </div>

                  <div style={{ borderLeft: '2px solid var(--glass-border)', marginLeft: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    {timeline.map((event: any) => (
                      <div key={event.id_interaccion} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'absolute', left: '-1.85rem', top: '0.2rem', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--glass-border)', border: '2px solid var(--bg-primary)' }}></div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          {formatDistanceToNow(new Date(event.created_at), { addSuffix: true, locale: es })}
                        </p>
                        <p style={{ margin: 0 }}><strong>{event.tipo_accion}:</strong> {event.nota}</p>
                      </div>
                    ))}
                    
                    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                      <div style={{ position: 'absolute', left: '-1.85rem', top: '0.2rem', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-color)', border: '2px solid var(--bg-primary)' }}></div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        {format(new Date(selectedLead.created_at), "dd MMM yyyy", { locale: es })}
                      </p>
                      <p style={{ margin: 0 }}>Lead ingresó al sistema.</p>
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                  <p>Selecciona un lead para ver los detalles.</p>
                </div>
              )}
            </section>
            )}
          </div>
        )}
      </main>

      {/* Modal Plantillas */}
      {showEditModal && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEditModal(false)}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Edit2 size={24} color="var(--accent-color)"/> Editar Lead</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Nombre Completo</label>
                <input type="text" value={editFormData.nombre_completo} onChange={e => setEditFormData({...editFormData, nombre_completo: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Empresa</label>
                <input type="text" value={editFormData.empresa} onChange={e => setEditFormData({...editFormData, empresa: e.target.value})} placeholder="Ej. Levanna DC" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Teléfono / WhatsApp</label>
                <input type="text" value={editFormData.telefono_whatsapp} onChange={e => setEditFormData({...editFormData, telefono_whatsapp: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Correo Electrónico</label>
                <input type="email" value={editFormData.correo_electronico} onChange={e => setEditFormData({...editFormData, correo_electronico: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }} />
              </div>
              <button onClick={handleSaveEdit} style={{ padding: '0.75rem', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '6px', marginTop: '1rem', fontWeight: 'bold' }}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

      {showTemplatesModal && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowTemplatesModal(false)}>
          {/* ... Modal content for templates ... */}
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowTemplatesModal(false)}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={24} color="var(--accent-color)"/> Plantillas de Correo</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {TEMPLATES.map(tpl => (
                <div key={tpl.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--accent-color)' }}>{tpl.name}</h4>
                    <button onClick={() => copyTemplate(tpl)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}><Copy size={16} /> Copiar</button>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    <strong>Asunto:</strong> {tpl.subject}
                    <hr style={{ borderColor: 'var(--glass-border)', margin: '0.5rem 0' }} />
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                      {tpl.body.replace('{nombre}', selectedLead.nombre_completo).replace('{empresa}', selectedLead.empresa || 'tu empresa').replace('{dolor}', selectedLead.dolor_identificado || 'tus procesos')}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Biblioteca con Links (Drive & Cotizador) */}
      {showLibraryModal && (
        <div className="modal-overlay" onClick={() => setShowLibraryModal(false)}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLibraryModal(false)}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={24} color="var(--accent-color)"/> Biblioteca Comercial</h2>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Accede a documentos, cotizadores y guías. Genera tu enlace trazable para inyectar prospectos automáticamente a tu nombre.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {libraryLinks.map(link => (
                <div key={link.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.2)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Link size={18} color="#93c5fd" />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0' }}>{link.title}</h4>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <a href={link.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.875rem', color: 'var(--accent-color)' }}>Abrir enlace</a>
                        {link.url && link.url !== '#' && (
                          <button 
                            onClick={() => copyTrackableLink(link.url, link.title)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#93c5fd', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
                            title="Copiar enlace con trazabilidad de tu usuario comercial"
                          >
                            <Share2 size={12} /> Copiar Link Trazable
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {userRole === 'admin' && (
                    <button style={{ background: 'transparent', border: '1px solid var(--glass-border)', padding: '0.4rem', color: 'var(--text-secondary)' }}>
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {userRole === 'admin' && (
              <button style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--glass-border)', color: 'var(--text-secondary)' }}>
                + Añadir Nuevo Enlace (Drive / Video)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal Inyección Manual de Lead */}
      {showInjectModal && (
        <div className="modal-overlay" onClick={() => setShowInjectModal(false)}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: '550px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInjectModal(false)}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={24} color="var(--accent-color)"/> Inyectar Cliente / Lead Directo
            </h2>
            <form onSubmit={handleInjectLead} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Nombre Completo *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="ej. Juan Pérez" 
                  value={injectFormData.nombre_completo} 
                  onChange={e => setInjectFormData({...injectFormData, nombre_completo: e.target.value})} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Teléfono / WhatsApp *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="ej. +573100000000" 
                    value={injectFormData.telefono_whatsapp} 
                    onChange={e => setInjectFormData({...injectFormData, telefono_whatsapp: e.target.value})} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Correo Electrónico</label>
                  <input 
                    type="email" 
                    placeholder="cliente@empresa.com" 
                    value={injectFormData.correo_electronico} 
                    onChange={e => setInjectFormData({...injectFormData, correo_electronico: e.target.value})} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Empresa</label>
                  <input 
                    type="text" 
                    placeholder="ej. Innovaciones SAS" 
                    value={injectFormData.empresa} 
                    onChange={e => setInjectFormData({...injectFormData, empresa: e.target.value})} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Comercial Asignado</label>
                  <select 
                    value={injectFormData.comercial_asignado} 
                    onChange={e => setInjectFormData({...injectFormData, comercial_asignado: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }}
                  >
                    <option value="">Seleccionar Comercial...</option>
                    {asesores.map(asesor => (
                      <option key={asesor.id_usuario} value={asesor.id_usuario}>
                        {asesor.nombre} {asesor.id_usuario === session?.user?.id ? '(Tú)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Origen</label>
                  <select 
                    value={injectFormData.origen_captura} 
                    onChange={e => setInjectFormData({...injectFormData, origen_captura: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }}
                  >
                    <option value="Contacto_Directo">Contacto Directo</option>
                    <option value="Cotizador_Propuesta">Cotizador / Propuesta</option>
                    <option value="Web_Urgente">Web Urgente</option>
                    <option value="Web_Curioso">Web Curioso</option>
                    <option value="Bot_WhatsApp">Bot WhatsApp</option>
                    <option value="Sheet_Warm">Sheet Warm</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Temperatura</label>
                  <select 
                    value={injectFormData.temperatura_tier} 
                    onChange={e => setInjectFormData({...injectFormData, temperatura_tier: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }}
                  >
                    <option value="HOT">🔴 HOT</option>
                    <option value="WARM">🟡 WARM</option>
                    <option value="COLD">🔵 COLD</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Estado Comercial</label>
                  <select 
                    value={injectFormData.estado_comercial} 
                    onChange={e => setInjectFormData({...injectFormData, estado_comercial: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff' }}
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Reunión_Agendada">Reunión Agendada</option>
                    <option value="Propuesta_Enviada">Propuesta Enviada</option>
                    <option value="Cerrado_Ganado">Cerrado Ganado</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Detalle de la Propuesta / Dolor</label>
                <textarea 
                  rows={3} 
                  placeholder="Detalles sobre el contacto externo, propuesta enviada o servicios cotizados..." 
                  value={injectFormData.dolor_identificado} 
                  onChange={e => setInjectFormData({...injectFormData, dolor_identificado: e.target.value})} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: '#fff', fontFamily: 'inherit' }} 
                />
              </div>

              <button 
                type="submit" 
                disabled={injecting}
                style={{ padding: '0.85rem', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '6px', marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
              >
                {injecting ? 'Guardando cliente...' : '🚀 Inyectar Cliente en CRM'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
