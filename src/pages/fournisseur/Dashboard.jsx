import { useState, useEffect } from 'react'
import {
  FileText, Package, TrendingUp, Clock, Star, ArrowRight,
  CheckCircle2, ChevronRight, Truck, Euro, Bell, Send, Eye
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const revenueData = [
  { mois: 'Jan', ca: 28000 },
  { mois: 'Fév', ca: 34000 },
  { mois: 'Mar', ca: 41000 },
  { mois: 'Avr', ca: 38000 },
  { mois: 'Mai', ca: 52000 },
  { mois: 'Jun', ca: 47000 },
]

const incomingRequests = [
  { id: 'AO-2041', label: '20 lits médicalisés',      centrale: 'Groupement Sud-Ouest', deadline: '23 mai', urgency: 'URGENT', urgencyColor: 'text-red-700 bg-red-50 border-red-200' },
  { id: 'AO-2039', label: 'Fauteuils roulants × 12',  centrale: 'UGAP Île-de-France',   deadline: '25 mai', urgency: 'Standard', urgencyColor: 'text-gray-600 bg-gray-50 border-gray-200' },
  { id: 'AO-2038', label: 'Lève-personnes × 4',       centrale: 'CAHPP Aquitaine',       deadline: '28 mai', urgency: 'Prioritaire', urgencyColor: 'text-amber-700 bg-amber-50 border-amber-200' },
  { id: 'AO-2036', label: 'Tables de soins × 6',      centrale: 'Groupement Grand-Est',  deadline: '30 mai', urgency: 'Standard', urgencyColor: 'text-gray-600 bg-gray-50 border-gray-200' },
]

const myQuotes = [
  { id: 'DEV-881', demand: '20 lits médicalisés', price: '47 200 €', status: 'En attente', statusColor: 'text-amber-700 bg-amber-50 border-amber-200', date: 'Envoyé il y a 2h' },
  { id: 'DEV-874', demand: 'Fauteuils × 8',        price: '9 840 €',  status: 'Accepté',   statusColor: 'text-green-700 bg-green-50 border-green-200',  date: 'Accepté hier' },
  { id: 'DEV-869', demand: 'Concentrateurs O₂ × 4', price: '6 200 €', status: 'Refusé',   statusColor: 'text-red-700 bg-red-50 border-red-200',         date: 'Il y a 3j' },
]

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
  return <>{n.toLocaleString('fr-FR')}{suffix}</>
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-modal border border-surface-100 p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-emerald-600 font-bold">{payload[0].value.toLocaleString('fr-FR')} €</p>
    </div>
  )
}

export default function FournisseurDashboard({ onNavigate }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bonjour, Pierre 👋</h2>
          <p className="text-sm text-gray-500 mt-0.5">Tableau de bord MediPro France — Adhérent Premium</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <Star className="w-3 h-3" fill="currentColor" />
            Score qualité : 98/100
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Appels d\'offres actifs', value: 4,      icon: Bell,        color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Devis envoyés (mois)',    value: 11,     icon: Send,        color: 'bg-brand-50 text-brand-600' },
          { label: 'Commandes en cours',      value: 7,      icon: Package,     color: 'bg-violet-50 text-violet-600' },
          { label: 'CA mai (€)',              value: 52000,  icon: TrendingUp,  color: 'bg-amber-50 text-amber-600', suffix: ' €' },
        ].map(({ label, value, icon: Icon, color, suffix }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-card border border-surface-100">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-4`}>
              <Icon className="w-4 h-4" strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">
              <AnimKpi target={value} suffix={suffix || ''} />
            </p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts + incoming */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="col-span-1 bg-white rounded-2xl p-6 shadow-card border border-surface-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Chiffre d'affaires</h3>
          <p className="text-xs text-gray-400 mb-5">6 derniers mois</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ca" radius={[6, 6, 0, 0]}>
                {revenueData.map((entry, i) => (
                  <Cell key={i} fill={i === revenueData.length - 2 ? '#10b981' : '#d1fae5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incoming AOs */}
        <div className="col-span-2 bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Appels d'offres reçus</h3>
              <p className="text-xs text-gray-400 mt-0.5">Diffusés par les centrales via Medicalliance</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              4 actifs
            </span>
          </div>
          <div className="divide-y divide-surface-50">
            {incomingRequests.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-50 transition-colors cursor-pointer group">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-gray-400">{r.id}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${r.urgencyColor}`}>{r.urgency}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{r.label}</p>
                  <p className="text-xs text-gray-400">{r.centrale}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-semibold">Délai</p>
                  <p className="text-xs font-bold text-gray-700">{r.deadline}</p>
                </div>
                <button
                  onClick={() => onNavigate('mes-devis')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-100 shrink-0"
                >
                  <Send className="w-3 h-3" />Répondre
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My quotes */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <h3 className="text-sm font-semibold text-gray-900">Mes derniers devis</h3>
          <button onClick={() => onNavigate('mes-devis')} className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:underline">
            Voir tout <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-surface-50">
          {myQuotes.map((q) => (
            <div key={q.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-50 transition-colors">
              <span className="text-xs font-mono text-gray-400 w-20 shrink-0">{q.id}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{q.demand}</p>
                <p className="text-xs text-gray-400">{q.date}</p>
              </div>
              <p className="text-sm font-bold text-gray-900 tabular-nums">{q.price}</p>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${q.statusColor}`}>
                {q.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
