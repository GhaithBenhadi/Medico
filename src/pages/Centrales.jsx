import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, MapPin, Users, TrendingUp, Search, Plus } from 'lucide-react'
import { ORGANISATIONS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const CENTRALES_DATA = [
  { id: 'org-02', name: 'Groupement Sud-Ouest',       region: 'Occitanie · PACA',    city: 'Toulouse',   etablissements: 87, adherents: 34, volume: 420000, contact: 'Sophie Lambert', statut: 'actif' },
  { id: 'org-03', name: 'UGAP Île-de-France',         region: 'Île-de-France',       city: 'Paris',      etablissements: 124, adherents: 51, volume: 680000, contact: 'Marc Durand', statut: 'actif' },
  { id: 'org-04', name: 'Groupement Grand-Est',       region: 'Grand-Est',           city: 'Strasbourg', etablissements: 63, adherents: 28, volume: 310000, contact: 'Alice Remy', statut: 'actif' },
  { id: 'org-05', name: 'CAHPP Nouvelle-Aquitaine',   region: 'Nouvelle-Aquitaine',  city: 'Bordeaux',   etablissements: 91, adherents: 39, volume: 490000, contact: 'Thomas Vidal', statut: 'actif' },
]

const PALETTE = [
  'from-purple-500 to-purple-600',
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600',
]

export default function Centrales() {
  const [search, setSearch] = useState('')

  const filtered = CENTRALES_DATA.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.region.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  )

  const totalEtablissements = CENTRALES_DATA.reduce((s, c) => s + c.etablissements, 0)
  const totalVolume = CENTRALES_DATA.reduce((s, c) => s + c.volume, 0)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Summary */}
      <motion.div variants={fade} className="grid grid-cols-3 gap-4">
        <div className="surface rounded-xl p-4 shadow-card">
          <p className="text-2xl font-bold text-white">{CENTRALES_DATA.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Centrales actives</p>
        </div>
        <div className="surface rounded-xl p-4 shadow-card">
          <p className="text-2xl font-bold text-white">{totalEtablissements}</p>
          <p className="text-xs text-gray-400 mt-0.5">Établissements adhérents</p>
        </div>
        <div className="surface rounded-xl p-4 shadow-card">
          <p className="text-2xl font-bold text-white">{(totalVolume / 1000).toFixed(0)} k€</p>
          <p className="text-xs text-gray-400 mt-0.5">Volume annuel</p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={fade} className="flex items-center gap-3">
        <div className="flex-1 max-w-sm relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une centrale…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-500 outline-none" />
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-glow ml-auto">
          <Plus size={15}/> Nouvelle centrale
        </button>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c, i) => (
          <motion.div key={c.id} variants={fade}
            className="surface rounded-xl p-5 shadow-card border border-white/10 hover:border-brand-500/40 transition-all cursor-pointer">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${PALETTE[i % PALETTE.length]} flex items-center justify-center shadow-glow shrink-0`}>
                <Building2 size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="text-base font-semibold text-white">{c.name}</p>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Actif</span>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin size={10}/> {c.city} · {c.region}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Ref. : {c.contact}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center border-t border-white/10 pt-4">
              <div>
                <p className="text-lg font-bold text-white">{c.etablissements}</p>
                <p className="text-xs text-gray-500">Établissements</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{c.adherents}</p>
                <p className="text-xs text-gray-500">Fournisseurs</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{(c.volume / 1000).toFixed(0)}k€</p>
                <p className="text-xs text-gray-500">Volume/an</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <motion.div variants={fade} className="surface rounded-xl p-10 text-center shadow-card">
          <p className="text-gray-500 text-sm">Aucune centrale trouvée</p>
        </motion.div>
      )}

    </motion.div>
  )
}
