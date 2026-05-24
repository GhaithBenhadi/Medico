import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, Package, User, Building2, Clock, CheckCircle2, FileText, Send, Star } from 'lucide-react'
import { DEMANDES, DEVIS, DIFFUSIONS } from '../lib/mockData'

const STATUT_META = {
  nouvelle:    { label: 'Nouvelle',    color: 'text-gray-700 bg-gray-100' },
  diffusee:    { label: 'Diffusée',    color: 'text-violet-700 bg-violet-50' },
  en_attente:  { label: 'En attente', color: 'text-amber-700 bg-amber-50' },
  devis_recus: { label: 'Devis reçus',color: 'text-blue-700 bg-blue-50' },
  commandee:   { label: 'Commandée',  color: 'text-green-700 bg-green-50' },
}

const TIMELINE = [
  { id: 'nouvelle',    label: 'Demande créée',      done: true },
  { id: 'diffusee',   label: 'Diffusée aux adhérents', done: true },
  { id: 'devis_recus',label: 'Devis reçus',         done: true },
  { id: 'commandee',  label: 'Commandée',           done: false },
  { id: 'livree',     label: 'Livrée',              done: false },
]

export default function DemandeDetail({ onNavigate, params, user }) {
  const id = params?.id || 'dem-01'
  const demande = DEMANDES.find(d => d.id === id) || DEMANDES[0]
  const devis = DEVIS.filter(d => d.demande_id === demande.id)
  const diffusions = DIFFUSIONS.filter(d => d.demande_id === demande.id)

  const statMeta = STATUT_META[demande.statut] || STATUT_META.nouvelle

  const timelineIdx = TIMELINE.findIndex(t => t.id === demande.statut)

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => onNavigate('demandes')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux demandes
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-surface-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono text-gray-400 bg-surface-50 px-2 py-1 rounded">{demande.ref}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statMeta.color}`}>{statMeta.label}</span>
              {demande.urgence === 'urgent' && (
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">URGENT</span>
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{demande.description}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Quantité demandée</p>
            <p className="text-2xl font-bold text-gray-900">{demande.quantite}</p>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">{demande.type_demande}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-surface-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Établissement</p>
              <p className="text-sm font-semibold text-gray-800">{demande.etablissement?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Localisation</p>
              <p className="text-sm font-semibold text-gray-800">{demande.city} {demande.postal_code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Contact</p>
              <p className="text-sm font-semibold text-gray-800">{demande.contact_name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-surface-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-5">Suivi de la demande</h3>
          <div className="space-y-4">
            {TIMELINE.map((step, i) => {
              const isDone = i <= timelineIdx
              const isCurrent = i === timelineIdx
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isDone ? 'bg-brand-600' : 'bg-surface-100'
                  }`}>
                    {isDone
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      : <span className="w-2 h-2 rounded-full bg-surface-300" />
                    }
                  </div>
                  <span className={`text-sm ${isCurrent ? 'font-semibold text-gray-900' : isDone ? 'text-gray-600' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-surface-100">
            <p className="text-xs text-gray-400 mb-1">Centrale</p>
            <p className="text-sm font-semibold text-gray-800">{demande.centrale?.name}</p>
          </div>
        </div>

        {/* Devis */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-card border border-surface-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-900">Devis reçus ({devis.length})</h3>
            {devis.length > 0 && (
              <button
                onClick={() => onNavigate('offres')}
                className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1"
              >
                Comparer les offres <Star className="w-3 h-3" />
              </button>
            )}
          </div>

          {devis.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Send className="w-8 h-8 mb-3 opacity-30" />
              <p className="text-sm font-medium">En attente de devis</p>
              <p className="text-xs mt-1">{diffusions.length} fournisseur{diffusions.length !== 1 ? 's' : ''} notifié{diffusions.length !== 1 ? 's' : ''}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {devis.map(d => (
                <div key={d.id} className={`rounded-xl border p-4 transition-all ${d.statut === 'accepte' ? 'border-green-200 bg-green-50' : 'border-surface-200 bg-surface-50 hover:border-brand-200'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-400">{d.ref}</span>
                        {d.statut === 'accepte' && <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">Accepté</span>}
                        {d.statut === 'en_attente' && <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">En attente</span>}
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{d.fournisseur?.name}</p>
                      <p className="text-xs text-gray-400 mt-1">Délai: {d.delai_livraison} · {d.disponibilite}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{d.total_ht?.toLocaleString('fr-FR')} €</p>
                      <p className="text-xs text-gray-400">HT · {d.prix_unitaire?.toLocaleString('fr-FR')} €/u</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {d.services?.map(s => (
                      <span key={s} className="text-[11px] bg-white border border-surface-200 px-2 py-0.5 rounded text-gray-600">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
