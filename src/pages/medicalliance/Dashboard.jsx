import { useState, useEffect } from 'react'
import {
  Building2, Users, TrendingUp, Activity, ArrowRight,
  CheckCircle2, AlertCircle, Clock, Zap, BarChart3,
  ChevronRight, Shield, Award, Globe
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'

const platformData = [
  { mois: 'Jan', demandes: 34, volume: 180000, adherents: 110 },
  { mois: 'Fév', demandes: 41, volume: 220000, adherents: 115 },
  { mois: 'Mar', demandes: 58, volume: 310000, adherents: 119 },
  { mois: 'Avr', demandes: 52, volume: 280000, adherents: 122 },
  { mois: 'Mai', demandes: 74, volume: 420000, adherents: 127 },
  { mois: 'Jun', demandes: 68, volume: 390000, adherents: 127 },
]

const centrales = [
  { name: 'Groupement Sud-Ouest',   region: 'Occitanie · PACA',          demands: 24, volume: '142K €', status: 'Actif',    dot: 'bg-green-500' },
  { name: 'UGAP Île-de-France',     region: 'Île-de-France',              demands: 31, volume: '218K €', status: 'Actif',    dot: 'bg-green-500' },
  { name: 'Groupement Grand-Est',   region: 'Grand-Est · Bourgogne',      demands: 18, volume: '97K €',  status: 'Actif',    dot: 'bg-green-500' },
  { name: 'CAHPP Nouvelle-Aquitaine', region: 'Nouvelle-Aquitaine',       demands: 9,  volume: '54K €',  status: 'Nouveau',  dot: 'bg-blue-500' },
]

const recentAlerts = [
  { label: 'Adhésion en attente',      detail: 'NordMed Services — validation requise',   time: '10 min', color: 'bg-amber-500' },
  { label: 'Litige commande',          detail: 'EHPAD Rouen · Commande CMD-1821',          time: '2h',     color: 'bg-red-500' },
  { label: 'Score adhérent en baisse', detail: 'Méditec PSDM — 85 → 79/100',              time: '1j',     color: 'bg-orange-400' },
  { label: 'Nouveau groupement',       detail: 'CAHPP Nouvelle-Aquitaine — intégration',  time: '2j',     color: 'bg-brand-500' },
]

const kpis = [
  { label: 'Centrales actives',      value: 12,      unit: '',       delta: '+2',    icon: Building2, color: 'bg-brand-50 text-brand-600' },
  { label: 'Adhérents réseau',       value: 127,     unit: '',       delta: '+8',    icon: Users,     color: 'bg-violet-50 text-violet-600' },
  { label: 'Volume mai (€)',         value: '420K',  unit: ' €',     delta: '+34%',  icon: TrendingUp,color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Demandes ce mois',       value: 74,      unit: '',       delta: '+42%',  icon: Activity,  color: 'bg-amber-50 text-amber-600' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-modal border border-surface-100 p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500">{p.name}</span>
          <span className="font-semibold text-gray-800 ml-auto">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function AnimKpi({ value, unit }) {
  const [n, setN] = useState(0)
  const target = parseInt(String(value).replace(/\D/g, ''), 10) || 0
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
  const prefix = String(value).replace(/[0-9K€\s]/g, '')
  const suffix = String(value).replace(/[^K€\s]/g, '')
  return <>{n}{suffix}</>
}

export default function MedicallanceDashboard({ onNavigate }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bonjour, Karim 👋</h2>
          <p className="text-sm text-gray-500 mt-0.5">Vue globale du réseau Medicalliance</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full font-medium border border-brand-100">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            Réseau actif — 127 adhérents
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(({ label, value, unit, delta, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-card border border-surface-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" strokeWidth={2} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full text-green-700 bg-green-50">
                <TrendingUp className="w-3 h-3" />{delta}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">
              <AnimKpi value={value} />
            </p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Volume chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-card border border-surface-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Volume plateforme</h3>
              <p className="text-xs text-gray-400 mt-0.5">Demandes et volume € mensuel</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-brand-500" />Demandes</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" />Adhérents</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={platformData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0272c5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0272c5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="demandes" stroke="#0272c5" strokeWidth={2} fill="url(#gD)" dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="adherents" stroke="#10b981" strokeWidth={2} fill="url(#gA)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-surface-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-900">Alertes réseau</h3>
            <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-semibold">4 actives</span>
          </div>
          <div className="space-y-4">
            {recentAlerts.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${a.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-800 truncate">{a.label}</p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{a.detail}</p>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Centrales table */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Centrales actives</h3>
            <p className="text-xs text-gray-400 mt-0.5">Activité en cours sur le réseau</p>
          </div>
          <button className="text-xs font-semibold text-brand-600 flex items-center gap-1 hover:underline">
            Gérer les centrales <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-surface-50">
          {centrales.map((c) => (
            <div key={c.name} className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-50 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                <p className="text-xs text-gray-400 truncate">{c.region}</p>
              </div>
              <div className="text-center hidden md:block">
                <p className="text-sm font-bold text-gray-900">{c.demands}</p>
                <p className="text-[10px] text-gray-400">demandes</p>
              </div>
              <div className="text-center hidden lg:block">
                <p className="text-sm font-bold text-gray-900">{c.volume}</p>
                <p className="text-[10px] text-gray-400">volume</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                <span className="text-xs font-medium text-gray-600">{c.status}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: 'Gérer les adhérents',   sub: '3 demandes d\'adhésion en attente',  gradient: 'from-brand-500 to-blue-600',   icon: Users,    action: 'adherents' },
          { title: 'Performance réseau',    sub: 'Taux de réponse global : 91%',        gradient: 'from-violet-500 to-purple-600', icon: BarChart3, action: 'performance' },
          { title: 'Cartographie réseau',   sub: '127 adhérents · 12 régions',          gradient: 'from-emerald-500 to-green-600', icon: Globe,    action: 'supplier-network' },
        ].map(({ title, sub, gradient, icon: Icon, action }) => (
          <button
            key={title}
            onClick={() => onNavigate(action)}
            className="group flex items-center gap-4 bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-surface-100 transition-all duration-200 text-left"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm shrink-0`}>
              <Icon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}
