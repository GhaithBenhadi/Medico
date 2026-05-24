import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Shield, Clock, Zap, CheckCircle, MapPin, Filter } from 'lucide-react'
import { ADHERENTS, DEMANDES } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const TIER_CONFIG = {
  gold:   { label: 'Gold',   color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  silver: { label: 'Silver', color: 'text-gray-300 bg-gray-400/10 border-gray-400/30' },
  bronze: { label: 'Bronze', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
}

function ScoreRing({ score, size = 56 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 95 ? '#10b981' : score >= 85 ? '#6366f1' : '#f59e0b'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize={11} fontWeight="bold">{score}</text>
    </svg>
  )
}

export default function Matching() {
  const [filterRegion, setFilterRegion] = useState('all')
  const [filterSpec, setFilterSpec] = useState('all')
  const [selectedDemande, setSelectedDemande] = useState('dem-01')

  const demande = DEMANDES.find(d => d.id === selectedDemande)

  let adherents = ADHERENTS
  if (filterRegion !== 'all') adherents = adherents.filter(a => a.regions?.includes(filterRegion))
  if (filterSpec !== 'all')   adherents = adherents.filter(a => a.specialites?.includes(filterSpec))

  const regions = [...new Set(ADHERENTS.flatMap(a => a.regions || []))]
  const specs   = [...new Set(ADHERENTS.flatMap(a => a.specialites || []))]

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Demande selector */}
      <motion.div variants={fade} className="surface rounded-xl p-4 shadow-card">
        <p className="text-xs text-gray-400 mb-3">Trouver des fournisseurs pour</p>
        <div className="flex flex-wrap gap-2">
          {DEMANDES.map(d => (
            <button key={d.id} onClick={() => setSelectedDemande(d.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                selectedDemande === d.id
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
              }`}>
              {d.ref} — {d.categorie}
            </button>
          ))}
        </div>
        {demande && (
          <div className="mt-3 text-xs text-gray-400 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1"><Zap size={11} className="text-brand-400"/> {demande.quantite} unités</span>
            <span className="text-gray-600">·</span>
            <span>{demande.type_demande === 'achat' ? 'Achat' : 'Location'}</span>
            <span className="text-gray-600">·</span>
            <span className="flex items-center gap-1"><MapPin size={11}/> {demande.city}</span>
          </div>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div variants={fade} className="flex flex-wrap gap-3">
        <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-brand-500 outline-none cursor-pointer">
          <option value="all">Toutes les régions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-brand-500 outline-none cursor-pointer">
          <option value="all">Toutes les spécialités</option>
          {specs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-xs text-gray-500 self-center">{adherents.length} fournisseurs compatibles</span>
      </motion.div>

      {/* Adherent cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adherents.map(a => {
          const tier = TIER_CONFIG[a.tier] || TIER_CONFIG.bronze
          return (
            <motion.div key={a.org_id} variants={fade}
              className="surface rounded-xl p-5 shadow-card border border-white/10 hover:border-brand-500/40 transition-all group">
              <div className="flex items-start gap-4 mb-4">
                <ScoreRing score={a.score_qualite} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-base font-semibold text-white">{a.org.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${tier.color}`}>{tier.label}</span>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin size={10}/> {a.org.city} · {a.org.region}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                  a.status === 'disponible' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {a.status === 'disponible' ? 'Disponible' : 'Occupé'}
                </span>
              </div>

              {/* Specs */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {a.specialites.map(s => (
                  <span key={s} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 text-center border-t border-white/10 pt-3 mb-4">
                <div>
                  <p className="text-sm font-bold text-white">{a.response_rate}%</p>
                  <p className="text-xs text-gray-500">Réponses</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{a.avg_delay_days}j</p>
                  <p className="text-xs text-gray-500">Délai moy.</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{a.total_orders}</p>
                  <p className="text-xs text-gray-500">Commandes</p>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {a.certifications.map(c => (
                  <span key={c} className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <Shield size={9}/> {c}
                  </span>
                ))}
              </div>

              <button className="w-full py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-glow opacity-0 group-hover:opacity-100">
                Inviter à répondre
              </button>
            </motion.div>
          )
        })}
      </div>

      {adherents.length === 0 && (
        <motion.div variants={fade} className="surface rounded-xl p-10 text-center shadow-card">
          <p className="text-gray-500 text-sm">Aucun fournisseur correspondant aux critères</p>
        </motion.div>
      )}

    </motion.div>
  )
}
