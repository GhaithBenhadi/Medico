import { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, ArrowRight, Clock, CheckCircle2,
  AlertCircle, Package, Users, FileText, Truck, Activity,
  MoreHorizontal, ChevronRight, Zap, Star
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'

const activityData = [
  { mois: 'Jan', demandes: 14, commandes: 8,  locations: 5 },
  { mois: 'Fév', demandes: 18, commandes: 12, locations: 7 },
  { mois: 'Mar', demandes: 22, commandes: 15, locations: 9 },
  { mois: 'Avr', demandes: 19, commandes: 11, locations: 8 },
  { mois: 'Mai', demandes: 31, commandes: 21, locations: 14 },
  { mois: 'Jun', demandes: 28, commandes: 18, locations: 12 },
]

const recentActivity = [
  { id: 1, type: 'quote',   label: 'Nouveau devis reçu',       detail: '20 lits médicalisés · MediPro France',   time: '2 min',  color: 'text-blue-600 bg-blue-50',    dot: 'bg-blue-500' },
  { id: 2, type: 'order',   label: 'Commande confirmée',        detail: 'Fauteuils roulants × 8 · EHPAD Lyon',    time: '18 min', color: 'text-green-600 bg-green-50',  dot: 'bg-green-500' },
  { id: 3, type: 'alert',   label: 'Renouvellement à prévoir', detail: 'Location matelas anti-escarre · J-7',     time: '1h',     color: 'text-amber-600 bg-amber-50',  dot: 'bg-amber-500' },
  { id: 4, type: 'request', label: 'Demande diffusée',          detail: 'Lève-personnes × 3 · Grenoble',          time: '3h',     color: 'text-violet-600 bg-violet-50', dot: 'bg-violet-500' },
  { id: 5, type: 'order',   label: 'Livraison planifiée',       detail: 'Table de soins · Clinique Pasteur',      time: '5h',     color: 'text-green-600 bg-green-50',  dot: 'bg-green-500' },
]

const openDemands = [
  { id: 'DEM-2024',  label: '20 lits médicalisés',     site: 'EHPAD Toulouse',   status: 'En attente devis', statusColor: 'text-amber-700 bg-amber-50 border-amber-200',  offers: 4, urgent: true,  date: 'Il y a 2h' },
  { id: 'DEM-2023',  label: 'Fauteuils roulants × 12', site: 'Hôpital Bordeaux', status: 'Devis reçus',      statusColor: 'text-blue-700 bg-blue-50 border-blue-200',     offers: 6, urgent: false, date: 'Il y a 1j' },
  { id: 'DEM-2022',  label: 'Lève-personnes × 3',      site: 'Clinique Grenoble', status: 'Diffusée',        statusColor: 'text-violet-700 bg-violet-50 border-violet-200', offers: 2, urgent: false, date: 'Il y a 2j' },
  { id: 'DEM-2021',  label: 'Matelas anti-escarre × 6', site: 'EHPAD Nîmes',     status: 'Commandé',         statusColor: 'text-green-700 bg-green-50 border-green-200',   offers: 3, urgent: false, date: 'Il y a 3j' },
]

const kpis = [
  { label: 'Demandes actives',   value: '24',     delta: '+12%',  up: true,  icon: FileText, color: 'bg-blue-50 text-blue-600' },
  { label: 'Devis en attente',   value: '8',      delta: '+3',    up: true,  icon: Clock,    color: 'bg-amber-50 text-amber-600' },
  { label: 'Locations actives',  value: '41',     delta: '+5%',   up: true,  icon: Package,  color: 'bg-violet-50 text-violet-600' },
  { label: 'Fournisseurs actifs', value: '127',   delta: '+8',    up: true,  icon: Users,    color: 'bg-green-50 text-green-600' },
]

function KpiCard({ label, value, delta, up, icon: Icon, color }) {
  const [displayed, setDisplayed] = useState(0)
  const target = parseInt(value.replace(/\D/g, ''), 10) || 0

  useEffect(() => {
    let frame
    let start = null
    const duration = 900
    const animate = (ts) => {
      if (!start) start = ts
      const pct = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - pct, 3)
      setDisplayed(Math.round(ease * target))
      if (pct < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 border border-surface-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-4.5 h-4.5" strokeWidth={2} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {delta}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 tabular-nums">
        {displayed}{value.replace(/[0-9]/g, '')}
      </p>
      <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-modal border border-surface-100 p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500 capitalize">{p.name}</span>
          <span className="font-semibold text-gray-800 ml-auto">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bonjour, Sophie 👋</h2>
          <p className="text-sm text-gray-500 mt-0.5">Voici l'activité de votre plateforme aujourd'hui</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-medium border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Plateforme active
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Activity chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-card border border-surface-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Activité globale</h3>
              <p className="text-xs text-gray-400 mt-0.5">Demandes, commandes et locations / mois</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-brand-500 inline-block" />Demandes</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-violet-500 inline-block" />Commandes</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />Locations</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gDemandes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0e90e7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0e90e7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCommandes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gLocations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="demandes" stroke="#0e90e7" strokeWidth={2} fill="url(#gDemandes)" dot={false} activeDot={{ r: 4, fill: '#0e90e7' }} />
              <Area type="monotone" dataKey="commandes" stroke="#8b5cf6" strokeWidth={2} fill="url(#gCommandes)" dot={false} activeDot={{ r: 4, fill: '#8b5cf6' }} />
              <Area type="monotone" dataKey="locations" stroke="#10b981" strokeWidth={2} fill="url(#gLocations)" dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-surface-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-900">Activité récente</h3>
            <button className="text-xs text-brand-600 font-medium hover:underline">Tout voir</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.dot}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-800 truncate">{item.label}</p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.detail}</p>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open demands table */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Demandes en cours</h3>
            <p className="text-xs text-gray-400 mt-0.5">Toutes vos demandes actives</p>
          </div>
          <button
            onClick={() => onNavigate('new-request')}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Voir tout <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-surface-50">
          {openDemands.map((d) => (
            <div key={d.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-50 transition-colors cursor-pointer group">
              <div className="w-20 shrink-0">
                <span className="text-xs font-mono text-gray-400">{d.id}</span>
                {d.urgent && (
                  <span className="ml-2 text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">URGENT</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{d.label}</p>
                <p className="text-xs text-gray-400 truncate">{d.site}</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-300" />
                <span className="text-xs text-gray-500 font-medium">{d.offers} offres</span>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${d.statusColor}`}>
                {d.status}
              </span>
              <span className="text-xs text-gray-400 hidden lg:block w-20 text-right">{d.date}</span>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: 'Créer une demande',   sub: 'Diffusez en quelques clics',          icon: Zap,      color: 'from-brand-500 to-blue-600', action: 'new-request' },
          { title: 'Comparer les devis',  sub: '8 nouvelles offres à analyser',       icon: Star,     color: 'from-violet-500 to-purple-600', action: 'supplier-quotes' },
          { title: 'Gérer les locations', sub: '2 renouvellements prévus cette semaine', icon: Truck,  color: 'from-emerald-500 to-green-600', action: 'rental-management' },
        ].map(({ title, sub, icon: Icon, color, action }) => (
          <button
            key={title}
            onClick={() => onNavigate(action)}
            className="group flex items-center gap-4 bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-surface-100 transition-all duration-200 text-left"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm shrink-0`}>
              <Icon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{sub}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}
