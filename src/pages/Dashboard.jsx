import { motion } from 'framer-motion'
import { Users, Building2, FileText, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { DEMANDES, DASHBOARD_KPIS, ORGANISATIONS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const MONTHLY = [
  { mois: 'Nov', demandes: 48, volume: 310000 },
  { mois: 'Déc', demandes: 52, volume: 290000 },
  { mois: 'Jan', demandes: 61, volume: 370000 },
  { mois: 'Fév', demandes: 70, volume: 420000 },
  { mois: 'Mar', demandes: 68, volume: 400000 },
  { mois: 'Avr', demandes: 74, volume: 460000 },
]

const PIE_DATA = [
  { name: 'Lits',        value: 38, color: '#6366f1' },
  { name: 'Fauteuils',   value: 29, color: '#8b5cf6' },
  { name: 'Soins',       value: 21, color: '#06b6d4' },
  { name: 'Manutention', value: 12, color: '#10b981' },
]

const STATUT_COLOR = {
  brouillon:   'bg-gray-500/20 text-gray-400',
  publiee:     'bg-blue-500/20 text-blue-400',
  diffusee:    'bg-purple-500/20 text-purple-400',
  devis_recus: 'bg-amber-500/20 text-amber-400',
  commandee:   'bg-emerald-500/20 text-emerald-400',
}
const STATUT_LABEL = {
  brouillon: 'Brouillon', publiee: 'Publiée', diffusee: 'Diffusée',
  devis_recus: 'Devis reçus', commandee: 'Commandée',
}

export default function Dashboard() {
  const kpi = DASHBOARD_KPIS.medicalliance
  const fournisseurs = ORGANISATIONS.filter(o => o.type === 'fournisseur')
  const centrales = ORGANISATIONS.filter(o => o.type === 'centrale')

  const stats = [
    { label: 'Centrales actives',  value: kpi.centrales_actives,  sub: 'groupements',     icon: Building2,   color: 'from-purple-500 to-purple-600' },
    { label: 'Adhérents actifs',   value: kpi.adherents_actifs,   sub: 'fournisseurs',    icon: Users,       color: 'from-blue-500 to-blue-600' },
    { label: 'Demandes actives',   value: kpi.demandes_actives,   sub: 'en cours',        icon: FileText,    color: 'from-amber-500 to-amber-600' },
    { label: 'Volume total',       value: `${(kpi.volume_total/1000000).toFixed(2)} M€`, sub: 'annuel',  icon: TrendingUp,  color: 'from-brand-500 to-brand-600' },
  ]

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

      {/* Stats */}
      <motion.div variants={fade} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="surface rounded-xl p-4 flex items-center gap-4 shadow-card">
              <div className={`bg-gradient-to-br ${s.color} rounded-lg p-2.5 shadow-glow`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-xs text-gray-500">{s.sub}</p>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Alertes */}
      <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: AlertCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20', label: '3 demandes urgentes sans réponse', sub: 'À traiter aujourd\'hui' },
          { icon: Clock,       color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: '8 devis en attente de validation', sub: 'Expirent dans < 10 jours' },
          { icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: '12 nouvelles adhésions ce mois', sub: 'Réseau en croissance +9%' },
        ].map(a => {
          const Icon = a.icon
          return (
            <div key={a.label} className={`rounded-xl p-4 border flex items-center gap-3 ${a.color}`}>
              <Icon size={18} className="shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">{a.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{a.sub}</p>
              </div>
            </div>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area chart volume */}
        <motion.div variants={fade} className="lg:col-span-2 surface rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-white mb-1">Volume mensuel</h2>
          <p className="text-xs text-gray-400 mb-4">Évolution du volume d'achats coordonnés (€)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="mois" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v/1000}k`} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }} itemStyle={{ color: '#a5b4fc' }}
                formatter={v => [`${v.toLocaleString('fr-FR')} €`, 'Volume']} />
              <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={2} fill="url(#volGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie répartition */}
        <motion.div variants={fade} className="surface rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-white mb-1">Répartition</h2>
          <p className="text-xs text-gray-400 mb-4">Par catégorie d'équipement</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                paddingAngle={3} dataKey="value">
                {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                itemStyle={{ color: '#e2e8f0' }} formatter={v => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {PIE_DATA.map(e => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                  <span className="text-gray-400">{e.name}</span>
                </span>
                <span className="font-medium text-white">{e.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Demandes récentes */}
        <motion.div variants={fade} className="surface rounded-xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="font-semibold text-white">Demandes récentes</h2>
          </div>
          <div className="divide-y divide-white/5">
            {DEMANDES.map(d => (
              <div key={d.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-brand-400">{d.ref}</span>
                    <span className="text-xs text-gray-500">{d.type_demande}</span>
                  </div>
                  <p className="text-sm text-white">{d.etablissement.name}</p>
                  <p className="text-xs text-gray-500">{d.quantite} unités · {d.centrale.name}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${STATUT_COLOR[d.statut]}`}>
                  {STATUT_LABEL[d.statut]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar chart demandes */}
        <motion.div variants={fade} className="surface rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-white mb-1">Activité mensuelle</h2>
          <p className="text-xs text-gray-400 mb-4">Nombre de demandes traitées</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY} barSize={20}>
              <XAxis dataKey="mois" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }} itemStyle={{ color: '#a5b4fc' }}
                formatter={v => [v, 'Demandes']} />
              <Bar dataKey="demandes" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

    </motion.div>
  )
}
