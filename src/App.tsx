import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Bell, Search, MessageCircle, Mail, LayoutDashboard, Users, Settings, LogOut, Briefcase, Plus, X, BarChart3, Copy, BookOpen, Edit2, Link } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const TEMPLATES = [
  { id: 1, name: 'Primer Contacto (Frío)', subject: 'Mejora la gestión en tu empresa', body: 'Hola {nombre},\n\nHe notado que en {empresa} podrían beneficiarse de una solución para: {dolor}.\n\nMe gustaría mostrarte cómo Levanna puede ayudar. ¿Tienes 10 minutos el martes?\n\nSaludos,' },
  { id: 2, name: 'Seguimiento Reunión', subject: 'Resumen de nuestra charla - Levanna', body: 'Hola {nombre},\n\nGracias por tu tiempo. Te comparto la información sobre cómo abordaremos el tema de {dolor}.\n\nQuedo atento a tus comentarios.' },
];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          <img src="/logo-white.png" alt="CRM Logo" style={{ width: '80px', marginBottom: '1rem' }} />
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
  
  // Modals
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ nombre_completo: '', empresa: '', telefono_whatsapp: '', correo_electronico: '' });
    
  // Library State
  const [libraryLinks] = useState([
    { id: 1, title: 'Presentación Premium', type: 'doc', url: '#' },
    { id: 2, title: 'Manejo de Objeciones', type: 'chat', url: '#' },
    { id: 3, title: 'Carpeta Drive Completa', type: 'folder', url: '#' }
  ]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        setSession(session);
        await checkUserRole(session.user.id);
        loadLeads();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) navigate('/login');
      else {
        setSession(session);
        await checkUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (selectedLead && activeTab !== 'todos') {
      loadTimeline(selectedLead.id_lead);
    }
  }, [selectedLead, activeTab]);

  const checkUserRole = async (userId: string) => {
    const { data } = await supabase.from('usuarios_comerciales').select('rol, nombre').eq('id_usuario', userId).single();
    if (data) {
      setUserRole(data.rol);
      setUserAlias(data.nombre);
      if (data.rol === 'admin') {
        setActiveTab('admin');
        loadAsesores();
      }
    }
  };

  const loadAsesores = async () => {
    const { data } = await supabase.from('usuarios_comerciales').select('*').eq('rol', 'asesor');
    if (data) setAsesores(data);
  };

  const loadLeads = async () => {
    const { data, error } = await supabase.from('leads_master').select(`*, usuarios_comerciales(nombre)`).order('created_at', { ascending: false });
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
    await supabase.auth.signOut();
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

  const copyTemplate = async (template: any) => {
    if (!selectedLead) return;
    const body = template.body
      .replace('{nombre}', selectedLead.nombre_completo)
      .replace('{empresa}', selectedLead.empresa || 'tu empresa')
      .replace('{dolor}', selectedLead.dolor_identificado || 'tus procesos');
    
    navigator.clipboard.writeText(`Asunto: ${template.subject}\n\n${body}`);
    setShowTemplatesModal(false);
    alert('¡Plantilla copiada al portapapeles!');

    await supabase.from('historial_interacciones').insert([{
      id_lead: selectedLead.id_lead,
      id_usuario: session.user.id,
      tipo_accion: 'Email n8n',
      nota: `Se copió la plantilla: ${template.name}`
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
          <img src="/logo-white.png" alt="CRM Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} onError={(e) => e.currentTarget.style.display = 'none'} />
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
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {userAlias.charAt(0)}
            </div>
            {userAlias} ({userRole})
          </div>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--glass-border)' }}>
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
          
          {/* Header Utilities (Search & Bell) */}
          <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className={`badge ${getTierColor(lead.temperatura_tier)}`}>{lead.temperatura_tier}</span>
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
                    
                    <select 
                      value={selectedLead.estado_comercial} 
                      onChange={(e) => handleStatusChange(e.target.value)}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.4)' }}
                    >
                      <option value="Nuevo">Nuevo</option>
                      <option value="Contactado">Contactado</option>
                      <option value="Reunión_Agendada">Reunión Agendada</option>
                      <option value="Propuesta_Enviada">Propuesta Enviada</option>
                      <option value="Cerrado_Ganado">Cerrado Ganado</option>
                      <option value="Cerrado_Perdido">Cerrado Perdido</option>
                    </select>
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

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button onClick={() => handleWhatsApp(selectedLead)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#25D366', color: '#fff', border: 'none' }}>
                      <MessageCircle size={18} /> Chat WhatsApp
                    </button>
                    <button onClick={() => setShowTemplatesModal(true)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--accent-color)', color: '#fff', border: 'none' }}>
                      <Mail size={18} /> Plantillas de Correo
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

      {/* Modal Biblioteca con Links (Drive) */}
      {showLibraryModal && (
        <div className="modal-overlay" onClick={() => setShowLibraryModal(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLibraryModal(false)}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={24} color="var(--accent-color)"/> Biblioteca Comercial</h2>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Accede a documentos, videos y guías (Enlaces externos a Drive).</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {libraryLinks.map(link => (
                <div key={link.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.2)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Link size={18} color="#93c5fd" />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0' }}>{link.title}</h4>
                      <a href={link.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.875rem', color: 'var(--accent-color)' }}>Abrir enlace</a>
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
