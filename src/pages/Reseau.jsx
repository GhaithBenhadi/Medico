import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, MapPin, Shield, Star, Search, ChevronDown } from 'lucide-react'
import { ADHERENTS, ORGANISATIONS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

const TIER_CONFIG = {
  gold:   { label: 'Gold',   color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  silver: { label: 'Silver', color: 'text-gray-300',   bg: 'bg-gray-400/10 border-gray-400/30' },
  bronze: { label: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30' },
}

export default function Reseau() {
  const [search, setSearch] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [filterTier, setFilterTier] = useState('all')
  const [sort, setSort] = useState('score')

  const regions = [...new Set(ADHERENTS.flatMap(a => a.regions || []))]

  let adherents = [...ADHERENTS]
  if (filterRegion !== 'all') adherents = adherents.filter(a => a.regions?.includes(filterRegion))
  if (filterTier !== 'all')   adherents = adherents.filter(a => a.tier === filterTier)
  if (search) adherents = adherents.filter(a =>
    a.org.name.toLowerCase().includes(search.toLowerCase()) ||
    a.org.city.toLowerCase().includes(search.toLowerCase())
  )

  if (sort === 'score')  adherents.sort((a, b) => b.score_qualite - a.score_qualite)
  if (sort === 'orders') adherents.sort((a, b) => b.total_orders - a.total_orders)
  if (sort === 'delay')  adherents.sort((a, b) => a.avg_delay_days - b.avg_delay_days)

  const totalFournisseurs = ORGANISATIONS.filter(o => o.type === 'fournisseur').length
  const gold = ADHERENTS.filter(a => a.tier === 'gold').length

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Stats */}
      <motion.div variants={fade} className="grid grid-cols-3 gap-4">
        <div className="surface rounded-xl p-4 shadow-card">
          <p className="text-2xl font-bold text-white">{totalFournisseurs}</p>
          <p className="text-xs text-gray-400 mt-0.5">Adhérents actifs</p>
        </div>
        <div className="surface rounded-xl p-4 shadow-card">
          <p className="text-2xl font-bold text-yellow-400">{gold}</p>
          <p className="text-xs text-gray-400 mt-0.5">Partenaires Gold</p>
        </div>
        <div className="surface rounded-xl p-4 shadow-card">
          <p className="text-2xl font-bold text-white">{regions.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Régions couvertes</p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={fade} className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un adhérent…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-500 outline-none" />
        </div>
        <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-brand-500 outline-none cursor-pointer">
          <option value="all">Toutes les régions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filterTier} onChange={e => setFilterTier(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-brand-500 outline-none cursor-pointer">
          <option value="all">Tous niveaux</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="bronze">Bronze</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-brand-500 outline-none cursor-pointer">
          <option value="score">Trier: Score qualité</option>
          <option value="orders">Trier: Commandes</option>
          <option value="delay">Trier: Délai</option>
        </select>
      </motion.div>

      {/* Table */}
      <motion.div variants={fade} className="surface rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-white/5 bg-white/3">
              <th className="text-left py-3 px-5">Fournisseur</th>
              <th className="text-left py-3 px-5">Région</th>
              <th className="text-left py-3 px-5">Spécialités</th>
              <th className="text-left py-3 px-5">Niveau</th>
              <th className="text-right py-3 px-5">Score</th>
              <th className="text-right py-3 px-5">Taux rép.</th>
              <th className="text-right py-3 px-5">Délai</th>
              <th className="text-right py-3 px-5">Commandes</th>
              <th className="text-left py-3 px-5">Statut</th>
            </tr>
          </thead>
          <tbody>
            {adherents.map(a => {
              const tier = TIER_CONFIG[a.tier] || TIER_CONFIG.bronze
              return (
                <motion.tr key={a.org_id} variants={fade}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer">
                  <td className="py-3.5 px-5">
                    <div>
                      <p className="text-white font-medium">{a.org.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={10}/> {a.org.city}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-gray-400 text-xs">{a.org.region}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex flex-wrap gap-1">
                      {a.specialites.slice(0, 2).map(s => (
                        <span key={s} className="text-xs bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                      {a.specialites.length > 2 && (
                        <span className="text-xs text-gray-600">+{a.specialites.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${tier.bg} ${tier.color}`}>
                      {tier.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span className={`font-bold ${a.score_qualite >= 95 ? 'text-emerald-400' : a.score_qualite >= 85 ? 'text-blue-400' : 'text-amber-400'}`}>
                      {a.score_qualite}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right text-gray-300">{a.response_rate}%</td>
                  <td className="py-3.5 px-5 text-right text-gray-300">{a.avg_delay_days}j</td>
                  <td className="py-3.5 px-5 text-right text-gray-300">{a.total_orders}</td>
                  <td className="py-3.5 px-5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      a.status === 'disponible' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {a.status === 'disponible' ? 'Disponible' : 'Occupé'}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {adherents.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">Aucun adhérent trouvé</div>
        )}
      </motion.div>

    </motion.div>
  )
}
