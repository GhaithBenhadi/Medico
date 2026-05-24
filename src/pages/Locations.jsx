import { motion } from 'framer-motion'
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Calendar, Building2, Truck } from 'lucide-react'
import { LOCATIONS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const STATUT = {
  actif:   { label: 'Actif',   color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle },
  expire:  { label: 'Expiré',  color: 'bg-red-500/20 text-red-400',         icon: XCircle },
  suspendu:{ label: 'Suspendu',color: 'bg-gray-500/20 text-gray-400',       icon: AlertTriangle },
}

export default function Locations({ user }) {
  const orgId = user?.org_id
  const role = user?.role || 'medicalliance'

  let locations = LOCATIONS
  if (role === 'fournisseur')   locations = LOCATIONS.filter(l => l.fournisseur_id === orgId)
  if (role === 'etablissement') locations = LOCATIONS.filter(l => l.etablissement_id === orgId)

  const actives   = locations.filter(l => l.statut === 'actif')
  const expirees  = locations.filter(l => l.statut === 'expire')
  const mensualite = actives.reduce((s, l) => s + l.mensualite, 0)
  const expirantes = actives.filter(l => l.days_left <= 30)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Summary */}
      <motion.div variants={fade} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Locations actives',  value: actives.length,                          color: 'text-emerald-400' },
          { label: 'Expirées',           value: expirees.length,                         color: 'text-red-400' },
          { label: 'À renouveler',       value: expirantes.length,                       color: 'text-amber-400' },
          { label: 'Mensualité totale',  value: `${mensualite.toLocaleString('fr-FR')} €/mois`, color: 'text-white' },
        ].map(s => (
          <div key={s.label} className="surface rounded-xl p-4 shadow-card">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Alert renouvellement */}
      {expirantes.length > 0 && (
        <motion.div variants={fade} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-300">Renouvellements à anticiper</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              {expirantes.map(l => (
                <p key={l.id} className="text-xs text-amber-400">
                  {l.ref} — {l.equipement} : <strong>{l.days_left}j restants</strong>
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Locations grid */}
      <div className="space-y-3">
        {locations.map(l => {
          const s = STATUT[l.statut] || STATUT.actif
          const Icon = s.icon
          const totalDuration = 365
          const elapsed = totalDuration - l.days_left
          const pct = Math.max(0, Math.min(100, Math.round((elapsed / totalDuration) * 100)))
          const remaining = 100 - pct
          const barColor = l.days_left <= 30 ? '#f59e0b' : l.statut === 'expire' ? '#ef4444' : '#10b981'

          return (
            <motion.div key={l.id} variants={fade} className="surface rounded-xl p-5 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs text-brand-400">{l.ref}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${s.color}`}>
                      <Icon size={11}/> {s.label}
                    </span>
                    {l.days_left <= 30 && l.statut === 'actif' && (
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle size={10}/> Bientôt expiré
                      </span>
                    )}
                  </div>
                  <p className="text-base font-medium text-white">{l.equipement}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{l.quantite} unités</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{l.mensualite.toLocaleString('fr-FR')} €</p>
                  <p className="text-xs text-gray-500">par mois</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Durée du contrat</span>
                  <span className={l.days_left <= 30 ? 'text-amber-400' : 'text-gray-400'}>
                    {l.statut === 'expire' ? 'Expiré' : `${l.days_left} jours restants`}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>{l.date_debut}</span>
                  <span>{l.date_fin}</span>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Building2 size={12}/> {l.etablissement.name} · {l.etablissement.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck size={12}/> {l.fournisseur.name}
                </span>
              </div>

              {l.statut === 'actif' && l.days_left <= 30 && (
                <button className="mt-4 w-full py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-1.5">
                  <RefreshCw size={12}/> Demander un renouvellement
                </button>
              )}
            </motion.div>
          )
        })}
      </div>

      {locations.length === 0 && (
        <motion.div variants={fade} className="surface rounded-xl p-10 text-center shadow-card">
          <RefreshCw size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucune location</p>
        </motion.div>
      )}

    </motion.div>
  )
}
