import { motion } from 'framer-motion'
import { AlertTriangle, Clock, CheckCircle, Package, RefreshCw } from 'lucide-react'
import { DEMANDES, LOCATIONS, DASHBOARD_KPIS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const STATUT_DEMANDE = {
  brouillon:    { label: 'Brouillon',     color: 'bg-gray-500/20 text-gray-400' },
  publiee:      { label: 'Publiée',       color: 'bg-blue-500/20 text-blue-400' },
  diffusee:     { label: 'Diffusée',      color: 'bg-purple-500/20 text-purple-400' },
  devis_recus:  { label: 'Devis reçus',   color: 'bg-amber-500/20 text-amber-400' },
  commandee:    { label: 'Commandée',     color: 'bg-emerald-500/20 text-emerald-400' },
}

const URGENCE = {
  urgent:   { label: 'Urgent',   color: 'text-red-400' },
  standard: { label: 'Standard', color: 'text-gray-400' },
}

export default function DashboardEtablissement({ user }) {
  const orgId = user?.org_id || 'org-20'
  const kpi = DASHBOARD_KPIS.etablissement

  const mesDemandes = DEMANDES.filter(d => d.etablissement_id === orgId)
  const mesLocations = LOCATIONS.filter(l => l.etablissement_id === orgId)
  const locActives = mesLocations.filter(l => l.statut === 'actif')
  const locExpirantes = locActives.filter(l => l.days_left <= 30)

  const stats = [
    { label: 'Demandes actives',     value: kpi.demandes_actives,        sub: 'en cours',       icon: Clock,        color: 'from-blue-500 to-blue-600' },
    { label: 'Équipements',          value: kpi.equipements_en_service,  sub: 'en service',     icon: Package,      color: 'from-purple-500 to-purple-600' },
    { label: 'Locations actives',    value: kpi.locations_actives,       sub: 'contrats',       icon: RefreshCw,    color: 'from-emerald-500 to-emerald-600' },
    { label: 'Renouvellements',      value: kpi.alertes_renouvellement,  sub: 'à anticiper',    icon: AlertTriangle,color: 'from-amber-500 to-amber-600' },
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

      {/* Alert renouvellement */}
      {locExpirantes.length > 0 && (
        <motion.div variants={fade} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-300">Renouvellement à anticiper</p>
            {locExpirantes.map(l => (
              <p key={l.id} className="text-xs text-amber-400 mt-1">
                {l.ref} — {l.equipement} : expire dans <strong>{l.days_left} jours</strong> ({l.date_fin})
              </p>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Mes demandes */}
        <motion.div variants={fade} className="surface rounded-xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="font-semibold text-white">Mes demandes</h2>
          </div>
          <div className="divide-y divide-white/5">
            {mesDemandes.map(d => {
              const s = STATUT_DEMANDE[d.statut] || STATUT_DEMANDE.publiee
              const u = URGENCE[d.urgence] || URGENCE.standard
              return (
                <div key={d.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-brand-400">{d.ref}</span>
                      <span className={`text-xs ${u.color}`}>{u.label}</span>
                    </div>
                    <p className="text-sm text-white">{d.description?.slice(0, 48)}…</p>
                    <p className="text-xs text-gray-500 mt-0.5">{d.quantite} unités · {d.categorie}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-3 ${s.color}`}>{s.label}</span>
                </div>
              )
            })}
            {mesDemandes.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-500">Aucune demande en cours</p>
                <button className="mt-3 text-xs text-brand-400 hover:text-brand-300 underline">Créer une demande</button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Mes locations */}
        <motion.div variants={fade} className="surface rounded-xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="font-semibold text-white">Mes locations</h2>
          </div>
          <div className="divide-y divide-white/5">
            {mesLocations.map(l => {
              const total = 365
              const pct = Math.min(100, Math.round((l.days_left / total) * 100))
              return (
                <div key={l.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-mono text-brand-400 mr-2">{l.ref}</span>
                      <span className="text-sm text-white">{l.equipement}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${l.statut === 'actif' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {l.statut === 'actif' ? 'Actif' : 'Expiré'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-xs text-gray-400">{l.quantite} unités · {l.fournisseur.name}</p>
                    <span className="text-xs text-gray-500 ml-auto">{l.days_left}j restants</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${l.days_left <= 30 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>{l.date_debut}</span>
                    <span>{l.date_fin}</span>
                  </div>
                </div>
              )
            })}
            {mesLocations.length === 0 && <p className="py-10 text-center text-sm text-gray-500">Aucune location</p>}
          </div>
        </motion.div>
      </div>

      {/* Démarrage rapide */}
      <motion.div variants={fade} className="surface rounded-xl p-5 shadow-card">
        <h2 className="font-semibold text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Nouvelle demande d\'achat', desc: 'Commander du matériel neuf', color: 'from-blue-500 to-blue-600' },
            { label: 'Nouvelle demande de location', desc: 'Louer du matériel temporairement', color: 'from-purple-500 to-purple-600' },
            { label: 'Contacter mon référent', desc: 'Groupement Sud-Ouest', color: 'from-brand-500 to-brand-600' },
          ].map(a => (
            <button key={a.label} className={`bg-gradient-to-br ${a.color} rounded-xl p-4 text-left hover:opacity-90 transition-opacity shadow-glow`}>
              <p className="text-sm font-semibold text-white">{a.label}</p>
              <p className="text-xs text-white/70 mt-1">{a.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

    </motion.div>
  )
}
