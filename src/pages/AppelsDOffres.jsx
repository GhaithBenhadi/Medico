import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, MapPin, Package, Clock, Send, ChevronRight, X } from 'lucide-react'
import { DEMANDES, DIFFUSIONS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const URGENCE_COLOR = { urgent: 'text-red-400', standard: 'text-gray-400' }
const CAT_LABEL = { lits: 'Lits', fauteuils: 'Fauteuils', soins: 'Soins', manutention: 'Manutention' }

export default function AppelsDOffres({ user }) {
  const orgId = user?.org_id || 'org-10'
  const [selected, setSelected] = useState(null)
  const [responded, setResponded] = useState(new Set())

  // Appels diffusés à ce fournisseur
  const mesAppels = DIFFUSIONS
    .filter(d => d.fournisseur_id === orgId)
    .map(dif => ({ ...dif, demande: DEMANDES.find(d => d.id === dif.demande_id) }))
    .filter(d => d.demande)

  // Ajouter des appels fictifs pour la démo
  const demodems = DEMANDES.filter(d => !mesAppels.find(a => a.demande_id === d.id))

  const allAppels = [
    ...mesAppels,
    ...demodems.map(d => ({
      id: `demo-${d.id}`, demande_id: d.id, fournisseur_id: orgId,
      statut: 'envoyee', demande: d,
    })),
  ]

  const handleRespond = (id) => {
    setResponded(prev => new Set([...prev, id]))
    setSelected(null)
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

      <motion.div variants={fade} className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-glow">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Appels d'offres</h1>
          <p className="text-sm text-gray-400">{allAppels.length} appels reçus · {responded.size} réponses envoyées</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {allAppels.map(a => {
          const d = a.demande
          const isResponded = responded.has(a.id) || a.statut === 'repondue'
          return (
            <motion.div key={a.id} variants={fade}
              className={`surface rounded-xl p-5 shadow-card border ${isResponded ? 'border-emerald-500/30' : 'border-white/10 hover:border-brand-500/40'} transition-colors`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-mono text-brand-400">{d.ref}</span>
                  <span className="ml-2 text-xs text-gray-500">{d.type_demande === 'achat' ? 'Achat' : 'Location'}</span>
                </div>
                {isResponded
                  ? <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Répondu</span>
                  : <span className={`text-xs ${URGENCE_COLOR[d.urgence]}`}>{d.urgence === 'urgent' ? '🔴 Urgent' : 'Standard'}</span>
                }
              </div>

              <p className="text-sm text-white mb-3 leading-relaxed">{d.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1.5"><Package size={12}/> {d.quantite} × {CAT_LABEL[d.categorie] || d.categorie}</span>
                <span className="flex items-center gap-1.5"><MapPin size={12}/> {d.city} ({d.postal_code})</span>
                <span className="flex items-center gap-1.5"><Clock size={12}/> {d.site_name}</span>
                <span className="flex items-center gap-1.5 text-gray-500">{d.centrale?.name}</span>
              </div>

              {!isResponded ? (
                <button
                  onClick={() => setSelected(a)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium py-2 rounded-lg hover:opacity-90 transition-opacity shadow-glow"
                >
                  <Send size={14}/> Répondre à l'appel
                </button>
              ) : (
                <div className="text-center text-xs text-emerald-400 py-1.5">
                  ✓ Devis envoyé — en attente de validation
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Modal réponse */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-800 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white">Répondre à {selected.demande?.ref}</h2>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white">
                  <X size={18}/>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Prix unitaire HT (€)</label>
                    <input type="number" defaultValue="2490"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Délai de livraison</label>
                    <input type="text" defaultValue="3 jours"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Services inclus</label>
                  <div className="flex flex-wrap gap-2">
                    {['Installation', 'Formation', 'SAV 24h', 'Garantie 5 ans'].map(s => (
                      <label key={s} className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-brand-500" /> {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Note commerciale</label>
                  <textarea rows={3} defaultValue="Lot avec remise groupée. Certification NF EN ISO 9001."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-500 outline-none resize-none" />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => setSelected(null)}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 text-sm hover:text-white transition-colors">
                  Annuler
                </button>
                <button onClick={() => handleRespond(selected.id)}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-glow flex items-center justify-center gap-2">
                  <Send size={14}/> Envoyer le devis
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
