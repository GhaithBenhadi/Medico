import { useState } from 'react'
import {
  Building2, Clock, CheckCircle2, Send, ChevronRight,
  AlertTriangle, Filter, Search, MoreHorizontal, Zap
} from 'lucide-react'

const demands = [
  {
    id: 'DEM-0041', etab: 'EHPAD Les Jardins',   city: 'Toulouse',
    label: '20 lits médicalisés', type: 'Achat', urgency: 'URGENT',
    urgencyColor: 'text-red-700 bg-red-50 border-red-200',
    status: 'Nouvelle', statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
    date: 'Il y a 2h', contact: 'Isabelle Morin',
  },
  {
    id: 'DEM-0040', etab: 'Clinique Saint-Joseph', city: 'Lyon',
    label: 'Fauteuils roulants × 6', type: 'Location', urgency: 'Prioritaire',
    urgencyColor: 'text-amber-700 bg-amber-50 border-amber-200',
    status: 'Diffusée', statusColor: 'text-violet-700 bg-violet-50 border-violet-200',
    date: 'Il y a 5h', contact: 'Marc Dupont',
  },
  {
    id: 'DEM-0039', etab: 'HAD Sud-Ouest', city: 'Bordeaux',
    label: 'Concentrateurs O₂ × 4', type: 'Location', urgency: 'Standard',
    urgencyColor: 'text-gray-600 bg-gray-50 border-gray-200',
    status: 'Devis reçus', statusColor: 'text-green-700 bg-green-50 border-green-200',
    date: 'Il y a 1j', contact: 'Claire Roux',
  },
  {
    id: 'DEM-0038', etab: 'EHPAD Bellevue', city: 'Nîmes',
    label: 'Matelas anti-escarre × 10', type: 'Location', urgency: 'Standard',
    urgencyColor: 'text-gray-600 bg-gray-50 border-gray-200',
    status: 'Commandé', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    date: 'Il y a 3j', contact: 'Jean Bernard',
  },
  {
    id: 'DEM-0037', etab: 'Clinique Pasteur', city: 'Toulouse',
    label: 'Tables de soins × 3', type: 'Achat', urgency: 'Standard',
    urgencyColor: 'text-gray-600 bg-gray-50 border-gray-200',
    status: 'Nouvelle', statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
    date: 'Il y a 3j', contact: 'Sophie Vidal',
  },
]

export default function DemandesEtablissements({ onNavigate }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Toutes')

  const tabs = ['Toutes', 'Nouvelles', 'En cours', 'Commandées']

  const filtered = demands.filter(d => {
    const q = search.toLowerCase()
    const matchSearch = !q || d.label.toLowerCase().includes(q) || d.etab.toLowerCase().includes(q)
    const matchTab = filter === 'Toutes' ? true
      : filter === 'Nouvelles' ? d.status === 'Nouvelle'
      : filter === 'En cours' ? ['Diffusée', 'Devis reçus'].includes(d.status)
      : d.status === 'Commandé'
    return matchSearch && matchTab
  })

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Demandes des établissements</h2>
          <p className="text-sm text-gray-500 mt-0.5">Reçues de vos établissements membres — à diffuser au réseau Medicalliance</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
            2 nouvelles demandes
          </span>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un établissement ou équipement…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all shadow-xs"
          />
        </div>
        <div className="flex bg-white rounded-xl border border-surface-200 overflow-hidden shadow-xs">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2.5 text-xs font-semibold transition-colors ${filter === t ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-surface-50'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">{filtered.length} demande(s)</span>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
        <div className="divide-y divide-surface-50">
          {filtered.map(d => (
            <div key={d.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50 transition-colors cursor-pointer group">
              {/* Etab icon */}
              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-violet-500" strokeWidth={2} />
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono text-gray-400">{d.id}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${d.urgencyColor}`}>{d.urgency}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${d.type === 'Location' ? 'text-violet-600 bg-violet-50' : 'text-brand-600 bg-brand-50'}`}>{d.type}</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{d.label}</p>
                <p className="text-xs text-gray-400">{d.etab} — {d.city} · {d.contact}</p>
              </div>

              {/* Status */}
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${d.statusColor}`}>
                {d.status}
              </span>

              <span className="text-xs text-gray-400 w-20 text-right hidden lg:block">{d.date}</span>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {d.status === 'Nouvelle' && (
                  <button
                    onClick={() => onNavigate('network-distribution')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
                    Diffuser
                  </button>
                )}
                {d.status === 'Devis reçus' && (
                  <button
                    onClick={() => onNavigate('supplier-quotes')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Voir devis <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-200 transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
