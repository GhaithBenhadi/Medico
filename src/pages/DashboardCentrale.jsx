import { motion } from 'framer-motion'
import { FileText, Building2, TrendingUp, AlertTriangle, ChevronRight, Plus, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { DEMANDES, LOCATIONS, DASHBOARD_KPIS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const MONTHLY = [
  { mois: 'Nov', demandes: 18, commandes: 15 },
  { mois: 'Déc', demandes: 22, commandes: 19 },
  { mois: 'Jan', demandes: 26, commandes: 22 },
  { mois: 'Fév', demandes: 31, commandes: 27 },
  { mois: 'Mar', demandes: 29, commandes: 25 },
  { mois: 'Avr', demandes: 34, commandes: 29 },
]

const STATUT = {
  brouillon:   { label: 'Brouillon',   color: 'bg-gray-500/20 text-gray-400' },
  publiee:     { label: 'Publiée',     color: 'bg-blue-500/20 text-blue-400' },
  diffusee:    { label: 'Diffusée',    color: 'bg-purple-500/20 text-purple-400' },
  devis_recus: { label: 'Devis reçus', color: 'bg-amber-500/20 text-amber-400' },
  commandee:   { label: 'Commandée',   color: 'bg-emerald-500/20 text-emerald-400' },
}

export default function DashboardCentrale({ onNavigate, user }) {
  const orgId = user?.org_id || 'org-02'
  const kpi = DASHBOARD_KPIS.centrale

  const mesDemandes = DEMANDES.filter(d => d.centrale_id === orgId)
  const devisAValider = mesDemandes.filter(d => d.statut === 'devis_recus')
  const mesLocations = LOCATIONS.filter(l =>
    mesDemandes.some(d => d.etablissement_id === l.etablissement_id)
  )
  const locExpirantes = mesLocations.filter(l => l.statut === 'actif' && l.days_left <= 30)

  const stats = [
    { label: 'Établissements', value: 87, sub: 'rattachés',        icon: Building2,     color: 'from-purple-500 to-purple-600' },
    { label: 'Demandes',       value: mesDemandes.length, sub: 'actives', icon: FileText, color: 'from-blue-500 to-blue-600' },
    { label: 'Volume estimé',  value: '420 k€', sub: 'annuel',     icon: TrendingUp,    color: 'from-emerald-500 to-emerald-600' },
    { label: 'Devis à valider',value: devisAValider.length, sub: 'en attente', icon: AlertTriangle, color: 'from-amber-500 to-amber-600' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar chart */}
        <motion.div variants={fade} className="lg:col-span-2 surface rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-white mb-1">Activité mensuelle</h2>
          <p className="text-xs text-gray-400 mb-4">Demandes et commandes sur le réseau</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY} barGap={4} barSize={12}>
              <XAxis dataKey="mois" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }} />
              <Bar dataKey="demandes"  name="Demandes"  fill="#6366f1" radius={[3,3,0,0]} />
              <Bar dataKey="commandes" name="Commandes" fill="#10b981" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Alertes */}
        <motion.div variants={fade} className="surface rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Alertes</h2>
            {(devisAValider.length + locExpirantes.length) > 0 && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                {devisAValider.length + locExpirantes.length}
              </span>
            )}
          </div>
          <div className="space-y-2.5">
            {devisAValider.map(d => (
              <div key={d.id} className="flex items-start gap-2.5 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <CheckCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{d.ref}</p>
                  <p className="text-xs text-amber-400">Devis à comparer</p>
                </div>
                <button onClick={() => onNavigate('demandes')} className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap">
                  Voir →
                </button>
              </div>
            ))}
            {locExpirantes.map(l => (
              <div key={l.id} className="flex items-start gap-2.5 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{l.equipement}</p>
                  <p className="text-xs text-red-400">Expire dans {l.days_left}j</p>
                </div>
                <button onClick={() => onNavigate('locations')} className="text-xs text-red-400 hover:text-red-300 whitespace-nowrap">
                  Gérer →
                </button>
              </div>
            ))}
            {devisAValider.length === 0 && locExpirantes.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">Aucune alerte</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Demandes récentes */}
      <motion.div variants={fade} className="surface rounded-xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-semibold text-white">Demandes récentes</h2>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('new-demande')}
              className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-brand-500 to-brand-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity shadow-glow">
              <Plus size={12}/> Nouvelle
            </button>
            <button onClick={() => onNavigate('demandes')}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              Tout voir <ChevronRight size={13}/>
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-white/5 bg-white/3">
              <th className="text-left py-3 px-5">Réf.</th>
              <th className="text-left py-3 px-5">Établissement</th>
              <th className="text-left py-3 px-5">Produit</th>
              <th className="text-right py-3 px-5">Qté</th>
              <th className="text-left py-3 px-5">Urgence</th>
              <th className="text-left py-3 px-5">Statut</th>
              <th className="py-3 px-5"></th>
            </tr>
          </thead>
          <tbody>
            {mesDemandes.map(d => {
              const s = STATUT[d.statut] || STATUT.publiee
              return (
                <tr key={d.id}
                  onClick={() => onNavigate('demande-detail', { demandeId: d.id })}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer">
                  <td className="py-3.5 px-5 font-mono text-brand-400 text-xs">{d.ref}</td>
                  <td className="py-3.5 px-5 text-white">{d.etablissement.name}</td>
                  <td className="py-3.5 px-5 text-gray-400 max-w-xs">
                    <span className="truncate block">{d.description?.slice(0, 40)}…</span>
                  </td>
                  <td className="py-3.5 px-5 text-right text-white">{d.quantite}</td>
                  <td className="py-3.5 px-5">
                    <span className={`text-xs ${d.urgence === 'urgent' ? 'text-red-400' : 'text-gray-500'}`}>
                      {d.urgence === 'urgent' ? '🔴 Urgent' : 'Standard'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <ChevronRight size={14} className="text-gray-600" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </motion.div>

    </motion.div>
  )
}
