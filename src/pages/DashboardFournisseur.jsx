import { motion } from 'framer-motion'
import { TrendingUp, FileText, ShoppingBag, Zap, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { DEVIS, DEMANDES, DIFFUSIONS, DASHBOARD_KPIS, LOCATIONS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const MONTHLY = [
  { mois: 'Nov', ca: 31000 }, { mois: 'Déc', ca: 28000 }, { mois: 'Jan', ca: 39000 },
  { mois: 'Fév', ca: 44000 }, { mois: 'Mar', ca: 41000 }, { mois: 'Avr', ca: 52000 },
]

const STATUT_DEVIS = {
  en_attente: { label: 'En attente', color: 'text-amber-400', icon: Clock },
  accepte:    { label: 'Accepté',    color: 'text-emerald-400', icon: CheckCircle },
  refuse:     { label: 'Refusé',     color: 'text-red-400',    icon: XCircle },
}

export default function DashboardFournisseur({ user }) {
  const orgId = user?.org_id || 'org-10'
  const kpi = DASHBOARD_KPIS.fournisseur

  // Appels d'offres: demandes diffusées à ce fournisseur
  const mesAppels = DIFFUSIONS.filter(d => d.fournisseur_id === orgId)
    .map(dif => ({ ...dif, demande: DEMANDES.find(d => d.id === dif.demande_id) }))
    .filter(d => d.demande)

  // Mes devis
  const mesDevis = DEVIS.filter(d => d.fournisseur_id === orgId)

  // Mes locations
  const mesLocations = LOCATIONS.filter(l => l.fournisseur_id === orgId)
  const locActives = mesLocations.filter(l => l.statut === 'actif')

  const stats = [
    { label: 'Appels d\'offres', value: kpi.appels_offres_actifs, sub: 'à traiter', icon: Zap, color: 'from-blue-500 to-blue-600' },
    { label: 'Devis envoyés',    value: kpi.devis_envoyes,         sub: 'ce mois',   icon: FileText, color: 'from-purple-500 to-purple-600' },
    { label: 'Commandes',        value: kpi.commandes_en_cours,    sub: 'en cours',  icon: ShoppingBag, color: 'from-emerald-500 to-emerald-600' },
    { label: 'CA du mois',       value: `${(kpi.ca_total/1000).toFixed(0)} k€`, sub: 'avril 2024', icon: TrendingUp, color: 'from-brand-500 to-brand-600' },
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

        {/* Chart */}
        <motion.div variants={fade} className="lg:col-span-2 surface rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-white mb-4">Chiffre d'affaires mensuel</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY}>
              <defs>
                <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="mois" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v/1000}k`} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }} itemStyle={{ color: '#a5b4fc' }}
                formatter={v => [`${v.toLocaleString('fr-FR')} €`, 'CA']} />
              <Area type="monotone" dataKey="ca" stroke="#6366f1" strokeWidth={2} fill="url(#caGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Appels d'offres */}
        <motion.div variants={fade} className="surface rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Appels d'offres</h2>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{mesAppels.length} reçus</span>
          </div>
          <div className="space-y-3">
            {mesAppels.map(a => (
              <div key={a.id} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-brand-500/40 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-brand-400">{a.demande?.ref}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${a.statut === 'repondue' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {a.statut === 'repondue' ? 'Répondu' : 'À traiter'}
                  </span>
                </div>
                <p className="text-sm text-white truncate">{a.demande?.description?.slice(0, 50)}…</p>
                <p className="text-xs text-gray-500 mt-1">{a.demande?.site_name} · {a.demande?.quantite} unités</p>
              </div>
            ))}
            {mesAppels.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Aucun appel en cours</p>}
          </div>
        </motion.div>
      </div>

      {/* Mes devis */}
      <motion.div variants={fade} className="surface rounded-xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-semibold text-white">Mes devis récents</h2>
          <button className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">Tous les devis <ChevronRight size={14}/></button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-white/5">
              <th className="text-left py-3 px-5">Réf.</th>
              <th className="text-left py-3 px-5">Demande</th>
              <th className="text-right py-3 px-5">Total HT</th>
              <th className="text-left py-3 px-5">Délai</th>
              <th className="text-left py-3 px-5">Statut</th>
              <th className="text-left py-3 px-5">Expire le</th>
            </tr>
          </thead>
          <tbody>
            {mesDevis.map(d => {
              const s = STATUT_DEVIS[d.statut] || STATUT_DEVIS.en_attente
              const Icon = s.icon
              return (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3 px-5 font-mono text-brand-400 text-xs">{d.ref}</td>
                  <td className="py-3 px-5 text-gray-300">{d.demande_id.toUpperCase()}</td>
                  <td className="py-3 px-5 text-right font-semibold text-white">{d.total_ht.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-5 text-gray-400">{d.delai_livraison}</td>
                  <td className="py-3 px-5">
                    <span className={`flex items-center gap-1.5 ${s.color}`}>
                      <Icon size={13}/> {s.label}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-400 text-xs">{d.valide_jusqu_au}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </motion.div>

      {/* Locations actives */}
      <motion.div variants={fade} className="surface rounded-xl p-5 shadow-card">
        <h2 className="font-semibold text-white mb-4">Locations actives ({locActives.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {locActives.map(l => (
            <div key={l.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div>
                <p className="text-sm font-medium text-white">{l.ref} · {l.equipement}</p>
                <p className="text-xs text-gray-400">{l.etablissement.name} · {l.quantite} unités</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-400">{l.mensualite.toLocaleString('fr-FR')} €/mois</p>
                <p className="text-xs text-gray-500">{l.days_left}j restants</p>
              </div>
            </div>
          ))}
          {locActives.length === 0 && <p className="text-sm text-gray-500">Aucune location active</p>}
        </div>
      </motion.div>

    </motion.div>
  )
}
