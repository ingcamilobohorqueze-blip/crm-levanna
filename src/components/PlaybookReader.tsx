import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, Copy, Check, Sparkles, ShieldCheck, 
  Briefcase, Layers, FileText, ChevronRight, Zap, Calculator
} from 'lucide-react';
import { 
  BUNDLE_PACKAGES, MODULAR_PRICES, COMMISSION_SCHEMAS, 
  MODULE_DETAILS, AGENCY_SERVICES,
  type ObjectionItem
} from '../data/playbookData';

interface PlaybookReaderProps {
  selectedLead?: any;
  userAlias?: string;
  onClose?: () => void;
}

export const PlaybookReader: React.FC<PlaybookReaderProps> = ({ selectedLead, userAlias, onClose }) => {
  const [activeTab, setActiveTab] = useState<'filosofia' | 'bundles' | 'modulos' | 'objeciones' | 'comisiones' | 'agencia' | 'ecosistema'>('filosofia');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('levanna-access');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [calLink] = useState('https://cal.com/levanna-comercial');

  // Calculator State
  const [calcSaleAmount, setCalcSaleAmount] = useState<number>(810000);
  const [selectedCommissionCode, setSelectedCommissionCode] = useState<string>('LIQ-ACEL-12');

  // Dynamic variable replacement helper
  const replaceVariables = (text: string) => {
    let result = text;
    const clientCompany = selectedLead?.empresa || selectedLead?.nombre_completo || '[Nombre_Empresa]';
    const clientName = selectedLead?.nombre_completo || '[Nombre_Prospecto]';
    const advisorName = userAlias || 'Asesor Comercial';
    
    result = result.replace(/\{\{Nombre_Empresa\}\}/g, clientCompany);
    result = result.replace(/\{\{Nombre_Prospecto\}\}/g, clientName);
    result = result.replace(/\{\{Tu_Nombre\}\}/g, advisorName);
    result = result.replace(/\{\{Tu_Link_de_Cal.com\}\}/g, calLink);
    return result;
  };

  const handleCopy = (id: string, rawText: string) => {
    const processed = replaceVariables(rawText);
    navigator.clipboard.writeText(processed);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  // Filtered Objections across all modules
  const allObjections = useMemo(() => {
    const list: ObjectionItem[] = [];
    MODULE_DETAILS.forEach(m => {
      list.push(...m.objections);
    });
    return list;
  }, []);

  const filteredObjections = useMemo(() => {
    if (!searchQuery.trim()) return allObjections;
    const q = searchQuery.toLowerCase();
    return allObjections.filter(o => 
      o.question.toLowerCase().includes(q) || 
      o.answer.toLowerCase().includes(q) || 
      o.module.toLowerCase().includes(q) ||
      (o.criterion && o.criterion.toLowerCase().includes(q))
    );
  }, [allObjections, searchQuery]);

  const currentModule = useMemo(() => {
    return MODULE_DETAILS.find(m => m.id === selectedModuleId) || MODULE_DETAILS[0];
  }, [selectedModuleId]);

  // Commission Calculation
  const commissionResult = useMemo(() => {
    const amt = calcSaleAmount || 0;
    switch (selectedCommissionCode) {
      case 'LIQ-TRAD-01':
        return { mes1: amt * 0.20, recurrente: amt * 0.10, note: '20% Mes 1 + 10% mensual vitalicio mientras continúe activa' };
      case 'LIQ-ACEL-12':
        return { mes1: amt * 0.50, recurrente: amt * 0.10, note: '50% Mes 1 + 10% mensual recurrente (12 meses permanencia)' };
      case 'LIQ-PREP-15':
        return { mes1: amt * 0.15, recurrente: 0, note: '15% Pago Único sobre total cobrado upfront (Sin recurrencia)' };
      case 'LIQ-AGEN-UNI':
        return { mes1: amt * 0.15, recurrente: 0, note: '15% Comisión Única sobre Setup' };
      case 'LIQ-ACEL-12-MULTI':
        return { mes1: amt * 0.60, recurrente: amt * 0.10, note: '🔥 ¡Bono Multiplicador! 60% Mes 1 + 10% mensual (2+ módulos en Acelerador)' };
      default:
        return { mes1: 0, recurrente: 0, note: '' };
    }
  }, [calcSaleAmount, selectedCommissionCode]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxHeight: '90vh',
      background: 'var(--bg-primary, #0f172a)',
      color: '#f8fafc',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Header Superior */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.6rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}>
            <BookOpen size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              PLAYBOOK DE VENTAS CORPORATIVO
              <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.6rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                LEVANNA DC
              </span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              Guía oficial de prospección, correo en frío, objeciones y esquemas de comisiones
            </p>
          </div>
        </div>

        {/* Lead Context Bar & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {selectedLead && (
            <div style={{
              padding: '0.4rem 0.8rem',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#4ade80',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Zap size={14} /> Lead Activo: <strong>{selectedLead.empresa || selectedLead.nombre_completo}</strong>
            </div>
          )}

          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Buscar en el Playbook..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim() && activeTab !== 'objeciones') {
                  setActiveTab('objeciones');
                }
              }}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(15, 23, 42, 0.6)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {onClose && (
            <button 
              onClick={onClose} 
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              Cerrar
            </button>
          )}
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        background: 'rgba(30, 41, 59, 0.5)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        overflowX: 'auto'
      }}>
        {[
          { id: 'filosofia', label: 'Estrategia Comercial', icon: Sparkles },
          { id: 'bundles', label: 'Paquetes & Precios', icon: Layers },
          { id: 'modulos', label: 'Guiones por Módulo (1-6)', icon: FileText },
          { id: 'objeciones', label: 'Manejo de Objeciones & Fathom', icon: ShieldCheck },
          { id: 'comisiones', label: 'Calculadora de Comisiones', icon: Calculator },
          { id: 'agencia', label: 'Servicios de Agencia', icon: Briefcase },
          { id: 'ecosistema', label: 'Matriz de Sinergias', icon: Zap },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.9rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'var(--accent-color, #3b82f6)' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenido Principal con Scroll */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        
        {/* Pestaña: Filosofía Comercial */}
        {activeTab === 'filosofia' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 41, 59, 0.6) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <h3 style={{ fontSize: '1.2rem', color: '#60a5fa', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} /> Directriz Obligatoria para el Asesor Comercial
              </h3>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#e2e8f0', marginBottom: '1rem' }}>
                El equipo comercial de <strong>Levanna DC</strong> siempre debe <strong>iniciar la conversación ofreciendo Paquetes Comerciales (Bundles)</strong>.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h4 style={{ color: '#93c5fd', fontSize: '0.9rem', marginBottom: '0.4rem' }}>🏛️ Eje Central (Bóveda)</h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                    <strong>Levanna Vault</strong> es la boveda legal y financiera donde convergen actas, soportes de caja menor, reportes de nómina y Hábeas Data.
                  </p>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h4 style={{ color: '#93c5fd', fontSize: '0.9rem', marginBottom: '0.4rem' }}>⚡ Motor Predictivo EVM</h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                    <strong>Levanna Budget</strong> se alimenta de <strong>Levanna Access</strong> para detectar sobrecostos por horas extras y fatiga laboral en tiempo real.
                  </p>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h4 style={{ color: '#93c5fd', fontSize: '0.9rem', marginBottom: '0.4rem' }}>📈 Mayor MRR & Retención</h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                    El cliente obtiene un descuento sustancial (hasta 12%) y la empresa asegura mayor retención con menor tasa de cancelación (churn).
                  </p>
                </div>
              </div>

              <div style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1rem',
                background: 'rgba(234, 179, 8, 0.1)',
                borderLeft: '4px solid #eab308',
                borderRadius: '0 8px 8px 0',
                fontSize: '0.88rem',
                color: '#fef08a'
              }}>
                <strong>Venta Modular (Fallback):</strong> Si el cliente presenta restricción presupuestal severa o desea iniciar con una prueba piloto puntual, se deriva a la tarifa de venta modular individual aclarando la pérdida de sinergias transversales.
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Paquetes & Precios */}
        {activeTab === 'bundles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#93c5fd', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={20} /> Paquetes Comerciales (Bundles) Recomendados
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {BUNDLE_PACKAGES.map(pkg => (
                  <div key={pkg.id} style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    borderRadius: '12px',
                    border: pkg.discountPct >= 10 ? '1px solid rgba(59, 130, 246, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}>
                    {pkg.discountPct >= 10 && (
                      <span style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '15px',
                        background: '#3b82f6',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(59, 130, 246, 0.4)'
                      }}>
                        MÁS POPULAR
                      </span>
                    )}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#fff' }}>{pkg.name}</h4>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          background: 'rgba(34, 197, 94, 0.2)',
                          color: '#4ade80',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          -{pkg.discountPct}% Descuento
                        </span>
                      </div>
                      
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem', fontStyle: 'italic' }}>
                        Ideal para: {pkg.idealProfile}
                      </p>

                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Módulos Incluidos:</span>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.4rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                          {pkg.modules.map((m, idx) => (
                            <li key={idx} style={{ marginBottom: '0.2rem' }}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'line-through' }}>
                          {formatCOP(pkg.individualPrice)}
                        </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#60a5fa' }}>
                          {formatCOP(pkg.bundlePrice)} <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>/mes + IVA</span>
                        </span>
                      </div>
                      {pkg.bonus && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#fef08a', background: 'rgba(234, 179, 8, 0.15)', padding: '0.4rem 0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                          🎁 {pkg.bonus}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#93c5fd', marginBottom: '1rem' }}>
                🏷️ Tarifas Modulares Individuales (Fallback)
              </h3>
              <div style={{ overflowX: 'auto', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Módulo / Servicio</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Capacidad Plan Estándar</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Precio Mensual (COP) + IVA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODULAR_PRICES.map((mod, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#fff' }}>{mod.name}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>{mod.capacity}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 'bold', color: '#60a5fa' }}>{formatCOP(mod.monthlyPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Guiones por Módulo */}
        {activeTab === 'modulos' && (
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }}>
            {/* Lista Lateral de Módulos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {MODULE_DETAILS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModuleId(m.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: selectedModuleId === m.id ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: selectedModuleId === m.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                    color: selectedModuleId === m.id ? '#60a5fa' : '#cbd5e1',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: selectedModuleId === m.id ? 'bold' : 'normal'
                  }}
                >
                  <span>Módulo {m.number}: {m.title.split('(')[0]}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>

            {/* Contenido del Módulo Seleccionado */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(30, 41, 59, 0.4)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem' }}>
                  {currentModule.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', fontSize: '0.75rem' }}>
                    Guión Prospección
                  </span>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontSize: '0.75rem' }}>
                    Plantilla Correo
                  </span>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', fontSize: '0.75rem' }}>
                    Objeciones Integradas
                  </span>
                </div>
              </div>

              {/* Guión de Prospección */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h4 style={{ color: '#fde047', fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🎯 Guión de Prospección (Pitch de Llamada / Mensaje)
                </h4>
                <div style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div><strong>🔥 Gancho:</strong> {currentModule.gancho}</div>
                  <div><strong>⚠️ Problema:</strong> {currentModule.problema}</div>
                  <div><strong>💡 Solución Levanna:</strong> {currentModule.solucion}</div>
                  {currentModule.pruebaSocial && <div><strong>⭐ Prueba Social:</strong> {currentModule.pruebaSocial}</div>}
                  <div><strong>🚀 CTA:</strong> {currentModule.cta}</div>
                </div>
              </div>

              {/* Plantilla de Correo en Frío */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ color: '#60a5fa', fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    📧 Plantilla de Correo en Frío (Pre-Llenado Inteligente)
                  </h4>
                  <button
                    onClick={() => handleCopy(currentModule.emailTemplate.id, currentModule.emailTemplate.subject + '\n\n' + currentModule.emailTemplate.body)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.8rem',
                      background: copiedId === currentModule.emailTemplate.id ? '#22c55e' : 'var(--accent-color, #3b82f6)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === currentModule.emailTemplate.id ? <Check size={14} /> : <Copy size={14} />}
                    {copiedId === currentModule.emailTemplate.id ? '¡Copiado con Lead Datos!' : 'Copiar Correo Listo'}
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  <div style={{ color: '#93c5fd', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Asunto: {replaceVariables(currentModule.emailTemplate.subject)}
                  </div>
                  <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
                  {replaceVariables(currentModule.emailTemplate.body)}
                </div>
              </div>

              {/* Objeciones Específicas del Módulo */}
              {currentModule.objections.length > 0 && (
                <div>
                  <h4 style={{ color: '#f43f5e', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                    🛡️ Objeciones Comunes de este Módulo
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {currentModule.objections.map(obj => (
                      <div key={obj.id} style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #f43f5e' }}>
                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                          ❓ "{obj.question}"
                        </div>
                        <div style={{ fontSize: '0.83rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                          💬 <strong>Respuesta Oficial:</strong> {obj.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pestaña: Manejo de Objeciones (Global & Fathom) */}
        {activeTab === 'objeciones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Banner Comparativo Fathom / Otter */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.15) 0%, rgba(30, 41, 59, 0.8) 100%)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid rgba(225, 29, 72, 0.4)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fda4af', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚔️ TABLA COMPARATIVA: LEVANNA MEETINGS VS FATHOM / OTTER.AI
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
                <strong>Argumento Clave para el Comercial:</strong> Las herramientas gratuitas o de cobro individual por usuario (como Fathom u Otter) están pensadas para uso personal o freelancers, pero generan <strong>altos costos al escalar</strong> ($600k COP/mes por usuario) y <strong>severos riesgos de fuga de información corporativa</strong> (entrenamiento de modelos públicos).
              </p>
            </div>

            <div style={{ overflowX: 'auto', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                    <th style={{ padding: '0.75rem 1rem', width: '180px' }}>Módulo / Criterio</th>
                    <th style={{ padding: '0.75rem 1rem', width: '220px' }}>Objeción del Cliente</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Respuesta Oficial Levanna</th>
                    <th style={{ padding: '0.75rem 1rem', width: '80px', textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredObjections.map((obj) => (
                    <tr key={obj.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#93c5fd', fontWeight: 600 }}>
                        {obj.module}
                        {obj.criterion && <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{obj.criterion}</div>}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#fff', fontWeight: 500 }}>"{obj.question}"</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1', lineHeight: 1.5 }}>{obj.answer}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleCopy(obj.id, `Objeción: "${obj.question}"\nRespuesta Oficial Levanna: ${obj.answer}`)}
                          style={{
                            padding: '0.3rem 0.6rem',
                            background: copiedId === obj.id ? '#22c55e' : 'rgba(255,255,255,0.08)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          {copiedId === obj.id ? '¡Copiado!' : <Copy size={14} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pestaña: Calculadora & Esquema de Comisiones */}
        {activeTab === 'comisiones' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Simulador Interactivo */}
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#60a5fa', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calculator size={20} /> Simulador de Comisión Comercial
              </h3>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Monto de la Venta / Cierre (COP)
                </label>
                <input 
                  type="number"
                  value={calcSaleAmount}
                  onChange={(e) => setCalcSaleAmount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Escenario de Cierre / Contrato
                </label>
                <select
                  value={selectedCommissionCode}
                  onChange={(e) => setSelectedCommissionCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                >
                  {COMMISSION_SCHEMAS.map(c => (
                    <option key={c.code} value={c.code}>
                      [{c.code}] {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resultado del Cálculo */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '1.25rem',
                borderRadius: '10px',
                border: '1px dashed rgba(34, 197, 94, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{commissionResult.note}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>Comisión Mes 1 (Inicial):</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#4ade80' }}>
                    {formatCOP(commissionResult.mes1)}
                  </span>
                </div>

                {commissionResult.recurrente > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Comisión Recurrente Mensual:</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#60a5fa' }}>
                      {formatCOP(commissionResult.recurrente)} <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>/mes</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabla Completa de Reglas de Comisión */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#93c5fd', margin: 0 }}>
                📜 Reglas de Negociación y Liquidación Contable
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {COMMISSION_SCHEMAS.map(schema => (
                  <div key={schema.code} style={{
                    background: 'rgba(30, 41, 59, 0.4)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: selectedCommissionCode === schema.code ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem' }}>{schema.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#93c5fd', fontFamily: 'monospace' }}>{schema.code}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>{schema.contractTerms}</div>
                    <div style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 500 }}>💰 {schema.commissionStructure}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Servicios de Agencia */}
        {activeTab === 'agencia' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#93c5fd', marginBottom: '0.5rem' }}>
                🛠️ Soluciones "Llave en Mano" (Servicios de Agencia y Desarrollo a Medida)
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                Aplica para clientes que requieran servicios de captación 24/7, automatización n8n o bots por WhatsApp integrados nativamente con blindaje legal de Hábeas Data.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {AGENCY_SERVICES.map((srv, idx) => (
                <div key={idx} style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>{srv.name}</h4>
                    <p style={{ fontSize: '0.83rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem' }}>{srv.description}</p>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Setup Inicial:</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#60a5fa' }}>
                      {formatCOP(srv.setupCOP)}
                      {srv.feeCOP && <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 'normal' }}> (+ {formatCOP(srv.feeCOP)}/mes)</span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
              <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                ❓ Objeción: "¿Por qué contratar a Levanna en lugar de a un freelancer más económico?"
              </div>
              <div style={{ fontSize: '0.83rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                💬 <strong>Respuesta Oficial:</strong> "Nosotros no dejamos solo al cliente. Entregamos desarrollos con soporte continuo, infraestructura corporativa profesional (servidores seguros, Supabase, APIs oficiales) y blindaje legal integrado, a diferencia de servicios informales que desaparecen tras la entrega."
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Ecosistema & Sinergias */}
        {activeTab === 'ecosistema' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', maxWidth: '700px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#93c5fd', marginBottom: '0.5rem' }}>
                🔄 Matriz Resumen de Sinergias del Ecosistema
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                Utiliza este esquema visual para explicar al cliente por qué la compra de <strong>Paquetes (Bundles)</strong> es la decisión más inteligente para su empresa.
              </p>
            </div>

            {/* Esquema Visual Interactivo */}
            <div style={{
              width: '100%',
              maxWidth: '800px',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              {/* Núcleo Central: Vault */}
              <div style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)'
              }}>
                <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>🏛️ LEVANNA VAULT (Bóveda Documental)</h4>
                <span style={{ fontSize: '0.78rem', color: '#bfdbfe' }}>Receptáculo Central de Custodia Probatoria Legal y Financiera</span>
              </div>

              <div style={{ fontSize: '1.5rem', color: '#60a5fa' }}>▲</div>

              {/* Módulos de Entrada a Vault */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <h5 style={{ margin: '0 0 0.4rem 0', color: '#93c5fd' }}>Levanna Meetings</h5>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>Actas y compromisos archivados automáticamente en Vault</p>
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <h5 style={{ margin: '0 0 0.4rem 0', color: '#93c5fd' }}>Levanna Expenses</h5>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>Soportes OCR de Caja Menor archivados en Vault</p>
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.4)', textAlign: 'center' }}>
                  <h5 style={{ margin: '0 0 0.4rem 0', color: '#93c5fd' }}>Levanna Access</h5>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>Reportes de Nómina y firmas digitales de Hábeas Data</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#fde047', background: 'rgba(234, 179, 8, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  ⚡ Dispara Alertas por Horas Extras / Fatiga Laboral
                </span>
                <div style={{ fontSize: '1.2rem', color: '#fde047' }}>▼</div>
              </div>

              {/* Levanna Budget Predictivo */}
              <div style={{
                padding: '1rem 2rem',
                background: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: '12px',
                textAlign: 'center',
                width: '60%'
              }}>
                <h4 style={{ margin: 0, color: '#c084fc', fontSize: '1rem' }}>📊 LEVANNA BUDGET</h4>
                <span style={{ fontSize: '0.78rem', color: '#e9d5ff' }}>Motor Predictivo EVM (Recalcula EAC al instante)</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
