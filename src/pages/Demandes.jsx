import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, Filter, Plus, Clock, CheckCircle2, AlertCircle, Package, ChevronRight, MapPin } from 'lucide-react'
import { DEMANDES } from '../lib/mockData'

const STATUT_META = {
  nouvelle:    { label: 'Nouvelle',     color: 'text-gray-700 bg-gray-100 border-gray-200' },
  diffusee:    { label: 'Diffusée',     color: 'text-violet-700 bg-violet-50 border-violet-200' },
  en_attente:  { label: 'En attente',   color: 'text-amber-700 bg-amber-50 border-amber-200' },
  devis_recus: { label: 'Devis reçus',  color: 'text-blue-700 bg-blue-50 border-blue-200' },
  commandee:   { label: 'Commandée',    color: 'text-green-700 bg-green-50 border-green-200' },
  annulee:     { label: 'Annulée',      color: 'text-red-700 bg-red-50 border-red-200' },
}

const URGENCE_META = {
  urgent:   { label: 'Urgent',    color: 'text-red-700 bg-red-50' },
  standard: { label: 'Standard',  color: 'text-blue-700 bg-blue-50' },
  faible:   { label: 'Faible',    color: 'text-gray-600 bg-gray-100' },
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

export default function Demandes({ onNavigate, user }) {
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('all')

  const role = user?.role || 'medicalliance'
  const org_id = user?.org_id

  let demandes = [...DEMANDES]
  if (role === 'etablissement') demandes = demandes.filter(d => d.etablissement_id === org_id)
  else if (role === 'centrale') demandes = demandes.filter(d => d.centrale_id === org_id)

  const filtered = demandes.filter(d => {
    const matchSearch = !search || d.description?.toLowerCase().includes(search.toLowerCase()) ||
      d.ref?.toLowerCase().includes(search.toLowerCase()) ||
      d.etablissement?.name?.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filterStatut === 'all' || d.statut === filterStatut
    return matchSearch && matchStatut
  })

  const statuts = ['all', ...Object.keys(STATUT_META)]

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {role === 'etablissement' ? 'Mes demandes' : role === 'centrale' ? 'Demandes groupement' : 'Toutes les demandes'}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} demande{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        {role !== 'fournisseur' && (
          <button
            onClick={() => onNavigate('new-demande')}
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Nouvelle demande
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-surface-100 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une demande…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statuts.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatut(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatut === s
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-50 text-gray-600 hover:bg-surface-100 border border-surface-200'
              }`}
            >
              {s === 'all' ? 'Tous' : STATUT_META[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-surface-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <div className="col-span-1">Réf.</div>
          <div className="col-span-3">Demande</div>
          <div className="col-span-2">Établissement</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-1">Urgence</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Qté</div>
          <div className="col-span-1">Action</div>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="divide-y divide-surface-50">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="w-8 h-8 mb-3 opacity-30" />
              <p className="text-sm font-medium">Aucune demande trouvée</p>
              <p className="text-xs mt-1">Modifiez vos filtres ou créez une nouvelle demande</p>
            </div>
          ) : filtered.map(d => {
            const statMeta = STATUT_META[d.statut] || STATUT_META.nouvelle
            const urgMeta = URGENCE_META[d.urgence] || URGENCE_META.standard
            return (
              <motion.div
                key={d.id}
                variants={item}
                onClick={() => onNavigate('demande-detail', { id: d.id })}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-surface-50 transition-colors cursor-pointer group items-center"
              >
                <div className="col-span-1">
                  <span className="text-xs font-mono text-gray-400">{d.ref}</span>
                </div>
                <div className="col-span-3">
                  <p className="text-sm font-semibold text-gray-800 truncate">{d.description?.slice(0, 40)}…</p>
                  <p className="text-xs text-gray-400 mt-0.5">{d.categorie}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-700 truncate">{d.etablissement?.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{d.city}</p>
                </div>
                <div className="col-span-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statMeta.color}`}>
                    {statMeta.label}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${urgMeta.color}`}>
                    {urgMeta.label}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-xs text-gray-500 capitalize">{d.type_demande}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm font-semibold text-gray-800">{d.quantite}</span>
                </div>
                <div className="col-span-1">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-brand-600 font-medium">
                    Voir <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
