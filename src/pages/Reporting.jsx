import { motion } from 'framer-motion'
import { TrendingUp, Download, Calendar } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const MONTHLY = [
  { mois: 'Nov', volume: 310000, demandes: 48, commandes: 41 },
  { mois: 'Déc', volume: 290000, demandes: 52, commandes: 45 },
  { mois: 'Jan', volume: 370000, demandes: 61, commandes: 54 },
  { mois: 'Fév', volume: 420000, demandes: 70, commandes: 62 },
  { mois: 'Mar', volume: 400000, demandes: 68, commandes: 60 },
  { mois: 'Avr', volume: 460000, demandes: 74, commandes: 66 },
]

const BY_CAT = [
  { name: 'Lits',        achats: 52, locations: 18 },
  { name: 'Fauteuils',   achats: 38, locations: 12 },
  { name: 'Soins',       achats: 29, locations: 7  },
  { name: 'Manutention', achats: 16, locations: 4  },
]

const BY_STATUS = [
  { name: 'Commandées',   value: 41, color: '#10b981' },
  { name: 'En attente',   value: 23, color: '#f59e0b' },
  { name: 'Diffusées',    value: 18, color: '#8b5cf6' },
  { name: 'Brouillons',   value: 12, color: '#6b7280' },
]

const TOP_FOURNISSEURS = [
  { name: 'MediPro France',         ca: 47200, orders: 7, score: 98 },
  { name: 'SudMed Equipements',     ca: 38500, orders: 5, score: 91 },
  { name: 'Atlantique Médical',     ca: 29700, orders: 4, score: 87 },
  { name: 'HealthCare Sud',         ca: 21000, orders: 3, score: 84 },
  { name: 'Méditec PSDM',          ca: 18400, orders: 3, score: 79 },
]

export default function Reporting({ user }) {
  const role = user?.role || 'medicalliance'

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

      <motion.div variants={fade} className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Reporting & Analytics</h1>
          <p className="text-sm text-gray-400">Période : novembre 2023 — avril 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-brand-500 outline-none cursor-pointer">
            <option>6 derniers mois</option>
            <option>3 derniers mois</option>
            <option>Cette année</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm hover:border-white/20 hover:text-white transition-colors">
            <Download size={14}/> Exporter
          </button>
        </div>
      </motion.div>

      {/* KPI row */}
      <motion.div variants={fade} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Volume total',    value: '1,850,000 €', delta: '+18%', pos: true },
          { label: 'Demandes',        value: '373',          delta: '+12%', pos: true },
          { label: 'Taux conversion', value: '89%',          delta: '+4%',  pos: true },
          { label: 'Délai moyen',     value: '4.2 jours',    delta: '-0.8j',pos: true },
        ].map(k => (
          <div key={k.label} className="surface rounded-xl p-4 shadow-card">
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.label}</p>
            <p className={`text-xs mt-1 ${k.pos ? 'text-emerald-400' : 'text-red-400'}`}>{k.delta} vs période précédente</p>
          </div>
        ))}
      </motion.div>

      {/* Volume area chart */}
      <motion.div variants={fade} className="surface rounded-xl p-5 shadow-card">
        <h2 className="font-semibold text-white mb-1">Volume mensuel (€)</h2>
        <p className="text-xs text-gray-400 mb-4">Évolution du volume d'achats coordonnés</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MONTHLY}>
            <defs>
              <linearGradient id="rVolGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="mois" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `${v/1000}k`} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
              labelStyle={{ color: '#e2e8f0' }} itemStyle={{ color: '#a5b4fc' }}
              formatter={v => [`${v.toLocaleString('fr-FR')} €`, 'Volume']} />
            <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={2.5} fill="url(#rVolGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar chart by category */}
        <motion.div variants={fade} className="surface rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-white mb-1">Demandes par catégorie</h2>
          <p className="text-xs text-gray-400 mb-4">Achats vs locations</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BY_CAT} barGap={2} barSize={14}>
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Bar dataKey="achats"    name="Achats"    fill="#6366f1" radius={[3,3,0,0]} />
              <Bar dataKey="locations" name="Locations" fill="#10b981" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie status */}
        <motion.div variants={fade} className="surface rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-white mb-1">Répartition par statut</h2>
          <p className="text-xs text-gray-400 mb-4">Distribution des demandes</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={BY_STATUS} cx="50%" cy="50%" innerRadius={40} outerRadius={70}
                  paddingAngle={3} dataKey="value">
                  {BY_STATUS.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  itemStyle={{ color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {BY_STATUS.map(e => (
                <div key={e.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                    <span className="text-gray-400">{e.name}</span>
                  </span>
                  <span className="font-medium text-white">{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top fournisseurs */}
      {(role === 'medicalliance' || role === 'centrale') && (
        <motion.div variants={fade} className="surface rounded-xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="font-semibold text-white">Top fournisseurs</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-white/5 bg-white/3">
                <th className="text-left py-3 px-5">#</th>
                <th className="text-left py-3 px-5">Fournisseur</th>
                <th className="text-right py-3 px-5">CA</th>
                <th className="text-right py-3 px-5">Commandes</th>
                <th className="text-right py-3 px-5">Score qualité</th>
              </tr>
            </thead>
            <tbody>
              {TOP_FOURNISSEURS.map((f, i) => (
                <tr key={f.name} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3 px-5 text-gray-500 font-mono text-xs">#{i + 1}</td>
                  <td className="py-3 px-5 text-white font-medium">{f.name}</td>
                  <td className="py-3 px-5 text-right text-white">{f.ca.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-5 text-right text-gray-300">{f.orders}</td>
                  <td className="py-3 px-5 text-right">
                    <span className={`font-bold ${f.score >= 95 ? 'text-emerald-400' : f.score >= 85 ? 'text-blue-400' : 'text-amber-400'}`}>
                      {f.score}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

    </motion.div>
  )
}
