import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building, MapPin, Search, ChevronRight, Plus, Heart } from 'lucide-react'
import { ORGANISATIONS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

const ETAB_DATA = [
  { id: 'org-20', name: 'EHPAD Les Jardins',    type: 'EHPAD',     city: 'Toulouse',  region: 'Occitanie',              centrale: 'Groupement Sud-Ouest',    lits: 87,  contact: 'Isabelle Morin',   demandes: 3, statut: 'actif' },
  { id: 'org-21', name: 'Clinique Saint-Joseph',type: 'Clinique',  city: 'Lyon',      region: 'Auvergne-Rhône-Alpes',   centrale: 'Groupement Sud-Ouest',    lits: 212, contact: 'Marc Dupont',      demandes: 1, statut: 'actif' },
  { id: 'org-22', name: 'HAD Sud-Ouest',        type: 'HAD',       city: 'Bordeaux',  region: 'Nouvelle-Aquitaine',     centrale: 'CAHPP Nouvelle-Aquitaine',lits: 0,   contact: 'Claire Roux',      demandes: 1, statut: 'actif' },
  { id: 'org-30', name: 'EHPAD Résidence Azur', type: 'EHPAD',     city: 'Nice',      region: 'PACA',                   centrale: 'Groupement Sud-Ouest',    lits: 64,  contact: 'Jean-Pierre Fabre',demandes: 0, statut: 'actif' },
  { id: 'org-31', name: 'Polyclinique du Nord', type: 'Clinique',  city: 'Lille',     region: 'Hauts-de-France',        centrale: 'UGAP Île-de-France',      lits: 340, contact: 'Marie Leclerc',    demandes: 2, statut: 'actif' },
  { id: 'org-32', name: 'USLD Sainte-Claire',   type: 'USLD',      city: 'Strasbourg',region: 'Grand-Est',             centrale: 'Groupement Grand-Est',    lits: 48,  contact: 'Pierre Hoffmann',  demandes: 0, statut: 'inactif' },
]

const TYPE_COLOR = {
  EHPAD:   'bg-purple-500/20 text-purple-400',
  Clinique:'bg-blue-500/20 text-blue-400',
  HAD:     'bg-emerald-500/20 text-emerald-400',
  USLD:    'bg-amber-500/20 text-amber-400',
}

export default function Etablissements() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterRegion, setFilterRegion] = useState('all')

  const regions = [...new Set(ETAB_DATA.map(e => e.region))]
  const types   = [...new Set(ETAB_DATA.map(e => e.type))]

  let etabs = ETAB_DATA
  if (filterType !== 'all')   etabs = etabs.filter(e => e.type === filterType)
  if (filterRegion !== 'all') etabs = etabs.filter(e => e.region === filterRegion)
  if (search) etabs = etabs.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.city.toLowerCase().includes(search.toLowerCase()) ||
    e.contact.toLowerCase().includes(search.toLowerCase())
  )

  const actifs  = ETAB_DATA.filter(e => e.statut === 'actif').length
  const regions2 = [...new Set(ETAB_DATA.map(e => e.region))].length

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Summary */}
      <motion.div variants={fade} className="grid grid-cols-3 gap-4">
        <div className="surface rounded-xl p-4 shadow-card">
          <p className="text-2xl font-bold text-white">{ETAB_DATA.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Établissements</p>
        </div>
        <div className="surface rounded-xl p-4 shadow-card">
          <p className="text-2xl font-bold text-white">{actifs}</p>
          <p className="text-xs text-gray-400 mt-0.5">Actifs</p>
        </div>
        <div className="surface rounded-xl p-4 shadow-card">
          <p className="text-2xl font-bold text-white">{regions2}</p>
          <p className="text-xs text-gray-400 mt-0.5">Régions</p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={fade} className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un établissement…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-500 outline-none" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-brand-500 outline-none cursor-pointer">
          <option value="all">Tous les types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-brand-500 outline-none cursor-pointer">
          <option value="all">Toutes les régions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-glow ml-auto">
          <Plus size={15}/> Ajouter
        </button>
      </motion.div>

      {/* Table */}
      <motion.div variants={fade} className="surface rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-white/5 bg-white/3">
              <th className="text-left py-3 px-5">Établissement</th>
              <th className="text-left py-3 px-5">Type</th>
              <th className="text-left py-3 px-5">Localisation</th>
              <th className="text-left py-3 px-5">Centrale</th>
              <th className="text-right py-3 px-5">Lits</th>
              <th className="text-left py-3 px-5">Contact</th>
              <th className="text-right py-3 px-5">Demandes</th>
              <th className="text-left py-3 px-5">Statut</th>
              <th className="py-3 px-5"></th>
            </tr>
          </thead>
          <tbody>
            {etabs.map(e => (
              <motion.tr key={e.id} variants={fade}
                className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Building size={14} className="text-gray-400" />
                    </div>
                    <span className="text-white font-medium">{e.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLOR[e.type] || 'bg-gray-500/20 text-gray-400'}`}>
                    {e.type}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-gray-400 text-xs">
                  <span className="flex items-center gap-1"><MapPin size={10}/> {e.city} · {e.region}</span>
                </td>
                <td className="py-3.5 px-5 text-gray-400 text-xs">{e.centrale}</td>
                <td className="py-3.5 px-5 text-right text-gray-300">
                  {e.lits > 0 ? e.lits : '—'}
                </td>
                <td className="py-3.5 px-5 text-gray-400 text-xs">{e.contact}</td>
                <td className="py-3.5 px-5 text-right">
                  {e.demandes > 0
                    ? <span className="font-medium text-brand-400">{e.demandes}</span>
                    : <span className="text-gray-600">0</span>
                  }
                </td>
                <td className="py-3.5 px-5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    e.statut === 'actif' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {e.statut === 'actif' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="py-3.5 px-5">
                  <ChevronRight size={14} className="text-gray-600" />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {etabs.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">Aucun établissement trouvé</div>
        )}
      </motion.div>

    </motion.div>
  )
}
