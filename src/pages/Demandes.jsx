import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, ChevronRight, Clock, AlertCircle } from 'lucide-react'
import { DEMANDES } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const STATUT = {
  brouillon:   { label: 'Brouillon',     color: 'bg-gray-500/20 text-gray-400' },
  publiee:     { label: 'Publiée',       color: 'bg-blue-500/20 text-blue-400' },
  diffusee:    { label: 'Diffusée',      color: 'bg-purple-500/20 text-purple-400' },
  devis_recus: { label: 'Devis reçus',   color: 'bg-amber-500/20 text-amber-400' },
  commandee:   { label: 'Commandée',     color: 'bg-emerald-500/20 text-emerald-400' },
}

const CAT = { lits: 'Lits', fauteuils: 'Fauteuils', soins: 'Soins', manutention: 'Manutention' }

export default function Demandes({ user, onNavigate }) {
  const orgId = user?.org_id
  const role = user?.role || 'medicalliance'
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('all')
  const [filterUrgence, setFilterUrgence] = useState('all')

  let demandes = DEMANDES
  if (role === 'centrale')      demandes = DEMANDES.filter(d => d.centrale_id === orgId)
  if (role === 'etablissement') demandes = DEMANDES.filter(d => d.etablissement_id === orgId)
  if (role === 'fournisseur')   demandes = DEMANDES // fournisseur voit via AppelsDOffres, ici tous

  if (filterStatut !== 'all')  demandes = demandes.filter(d => d.statut === filterStatut)
  if (filterUrgence !== 'all') demandes = demandes.filter(d => d.urgence === filterUrgence)
  if (search) demandes = demandes.filter(d =>
    d.ref.toLowerCase().includes(search.toLowerCase()) ||
    d.description?.toLowerCase().includes(search.toLowerCase()) ||
    d.site_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Toolbar */}
      <motion.div variants={fade} className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une demande…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-500 outline-none"
          />
        </div>

        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-brand-500 outline-none cursor-pointer">
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>

        <select value={filterUrgence} onChange={e => setFilterUrgence(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-brand-500 outline-none cursor-pointer">
          <option value="all">Toute urgence</option>
          <option value="urgent">Urgent</option>
          <option value="standard">Standard</option>
        </select>

        {(role === 'centrale' || role === 'etablissement') && (
          <button
            onClick={() => onNavigate?.('new-demande')}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-glow ml-auto">
            <Plus size={15}/> Nouvelle demande
          </button>
        )}
      </motion.div>

      {/* Count */}
      <motion.div variants={fade} className="text-xs text-gray-500">
        {demandes.length} demande{demandes.length !== 1 ? 's' : ''}
      </motion.div>

      {/* Table */}
      <motion.div variants={fade} className="surface rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-white/5 bg-white/3">
              <th className="text-left py-3 px-5">Référence</th>
              <th className="text-left py-3 px-5">Établissement</th>
              <th className="text-left py-3 px-5">Description</th>
              <th className="text-left py-3 px-5">Catégorie</th>
              <th className="text-right py-3 px-5">Qté</th>
              <th className="text-left py-3 px-5">Urgence</th>
              <th className="text-left py-3 px-5">Statut</th>
              <th className="py-3 px-5"></th>
            </tr>
          </thead>
          <tbody>
            {demandes.map(d => {
              const s = STATUT[d.statut] || STATUT.publiee
              return (
                <motion.tr key={d.id} variants={fade}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                  onClick={() => onNavigate?.('demande-detail', { demandeId: d.id })}>
                  <td className="py-3.5 px-5">
                    <span className="font-mono text-brand-400 text-xs">{d.ref}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <div>
                      <p className="text-white">{d.etablissement.name}</p>
                      <p className="text-xs text-gray-500">{d.city}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 max-w-xs">
                    <p className="text-gray-300 truncate">{d.description}</p>
                  </td>
                  <td className="py-3.5 px-5 text-gray-400">{CAT[d.categorie] || d.categorie}</td>
                  <td className="py-3.5 px-5 text-right text-white font-medium">{d.quantite}</td>
                  <td className="py-3.5 px-5">
                    {d.urgence === 'urgent'
                      ? <span className="flex items-center gap-1 text-red-400 text-xs"><AlertCircle size={12}/> Urgent</span>
                      : <span className="flex items-center gap-1 text-gray-500 text-xs"><Clock size={12}/> Standard</span>
                    }
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <ChevronRight size={14} className="text-gray-600" />
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {demandes.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-500 text-sm">Aucune demande trouvée</p>
          </div>
        )}
      </motion.div>

    </motion.div>
  )
}
