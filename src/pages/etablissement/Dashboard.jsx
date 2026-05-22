import { useState, useEffect } from 'react'
import {
  Plus, Package, Clock, CheckCircle2, ArrowRight,
  Truck, AlertTriangle, ChevronRight, Star, Bed,
  Stethoscope, Heart, Activity
} from 'lucide-react'

const myDemands = [
  { id: 'DEM-0041', label: '20 lits médicalisés',      type: 'Achat',    status: 'Devis en cours',    statusColor: 'text-blue-700 bg-blue-50 border-blue-200',   centrale: 'Groupement Sud-Ouest', date: 'Il y a 2h',  step: 2 },
  { id: 'DEM-0039', label: 'Fauteuils roulants × 6',   type: 'Location', status: 'En attente centrale', statusColor: 'text-amber-700 bg-amber-50 border-amber-200', centrale: 'Groupement Sud-Ouest', date: 'Il y a 1j',  step: 1 },
  { id: 'DEM-0036', label: 'Tables de soins × 2',       type: 'Achat',    status: 'Commandé',           statusColor: 'text-green-700 bg-green-50 border-green-200', centrale: 'Groupement Sud-Ouest', date: 'Il y a 4j',  step: 4 },
  { id: 'DEM-0031', label: 'Lève-personnes × 1',        type: 'Location', status: 'Livré',              statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', centrale: 'Groupement Sud-Ouest', date: 'Il y a 1 sem', step: 5 },
]

const myEquipment = [
  { icon: '🛏️', label: 'Lits médicalisés',      qty: 24, status: 'En service',  note: 'Location · expire déc. 2024' },
  { icon: '♿', label: 'Fauteuils roulants',     qty: 8,  status: 'En service',  note: 'Location · expire mars 2025' },
  { icon: '💨', label: 'Concentrateurs O₂',      qty: 4,  status: 'Maintenance', note: 'SAV planifié le 26 mai' },
  { icon: '🩺', label: 'Matelas anti-escarre',   qty: 6,  status: 'En service',  note: 'Location · expire mai 2024 ⚠️' },
]

const steps = ['Créée', 'Centrale', 'Diffusée', 'Devis', 'Commandée', 'Livrée']

function StepBar({ step }) {
  return (
    <div className="flex items-center gap-0.5 mt-2">
      {steps.map((s, i) => (
        <div key={s} className="flex-1 flex flex-col items-center gap-1">
          <div className={`h-1 w-full rounded-full transition-all ${i <= step ? 'bg-amber-500' : 'bg-surface-200'}`} />
        </div>
      ))}
    </div>
  )
}

function AnimKpi({ target, suffix = '' }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let frame, start
    const run = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 900, 1)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) frame = requestAnimationFrame(run)
    }
    frame = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return <>{n}{suffix}</>
}

export default function EtablissementDashboard({ onNavigate }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bonjour, Isabelle 👋</h2>
          <p className="text-sm text-gray-500 mt-0.5">EHPAD Les Jardins — Toulouse · Centrale : Groupement Sud-Ouest</p>
        </div>
        <button
          onClick={() => onNavigate('new-request')}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Nouvelle demande
        </button>
      </div>

      {/* Alert */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-bold text-amber-800">Matelas anti-escarre × 6 — Location expire dans 6 jours</p>
          <p className="text-xs text-amber-600 mt-0.5">Contactez votre centrale pour renouveler : Groupement Sud-Ouest</p>
        </div>
        <button className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors shrink-0">
          Contacter la centrale
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Demandes actives',    value: 3,   icon: Clock,         color: 'bg-amber-50 text-amber-600' },
          { label: 'Équipements en service', value: 42, icon: Package,     color: 'bg-green-50 text-green-600' },
          { label: 'Commandes en cours',  value: 1,   icon: Truck,         color: 'bg-blue-50 text-blue-600' },
          { label: 'Renouvellements',     value: 1,   icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-card border border-surface-100">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-4`}>
              <Icon className="w-4 h-4" strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold text-gray-900"><AnimKpi target={value} /></p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* My demands */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Mes demandes</h3>
            <p className="text-xs text-gray-400 mt-0.5">Transmises à votre centrale Medicalliance</p>
          </div>
          <button
            onClick={() => onNavigate('new-request')}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />Nouvelle demande
          </button>
        </div>
        <div className="divide-y divide-surface-50">
          {myDemands.map((d) => (
            <div key={d.id} className="px-6 py-4 hover:bg-surface-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">{d.id}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${d.type === 'Location' ? 'text-violet-600 bg-violet-50' : 'text-brand-600 bg-brand-50'}`}>
                      {d.type}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{d.label}</p>
                  <p className="text-xs text-gray-400">Via {d.centrale} · {d.date}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${d.statusColor}`}>
                  {d.status}
                </span>
              </div>
              <StepBar step={d.step} />
            </div>
          ))}
        </div>
      </div>

      {/* My equipment */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <h3 className="text-sm font-semibold text-gray-900">Mes équipements en service</h3>
          <button onClick={() => onNavigate('mes-locations')} className="text-xs text-amber-600 font-semibold flex items-center gap-1 hover:underline">
            Voir tout <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-surface-50">
          {myEquipment.map((e) => (
            <div key={e.label} className="flex items-center gap-4 p-5 hover:bg-surface-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center text-xl shrink-0">
                {e.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{e.label}</p>
                <p className="text-xs text-gray-400 truncate">{e.note}</p>
              </div>
              <div className="ml-auto text-right shrink-0">
                <p className="text-xl font-bold text-gray-900 tabular-nums">{e.qty}</p>
                <span className={`text-[10px] font-semibold ${e.status === 'Maintenance' ? 'text-amber-600' : 'text-green-600'}`}>
                  {e.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 flex items-center gap-6">
        <div className="flex-1 text-white">
          <h3 className="text-base font-bold mb-1">Besoin d'un nouvel équipement ?</h3>
          <p className="text-sm text-amber-100 leading-relaxed">
            Votre centrale transmet votre demande aux adhérents premium Medicalliance.
            Délai moyen de réponse : <strong>4 jours</strong>.
          </p>
        </div>
        <button
          onClick={() => onNavigate('new-request')}
          className="flex items-center gap-2 bg-white text-amber-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-amber-50 transition-colors shadow-sm shrink-0"
        >
          Créer une demande <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
