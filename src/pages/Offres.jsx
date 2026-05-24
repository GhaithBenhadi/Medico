import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock, XCircle, Star, Award, Shield, Truck } from 'lucide-react'
import { DEVIS, DEMANDES } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const STATUT = {
  en_attente: { label: 'En attente',  color: 'bg-amber-500/20 text-amber-400',   icon: Clock },
  accepte:    { label: 'Accepté',     color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle },
  refuse:     { label: 'Refusé',      color: 'bg-red-500/20 text-red-400',       icon: XCircle },
}

const SERVICE_ICONS = { 'Installation': Truck, 'Formation': Award, 'SAV 24h': Shield, 'Garantie 5 ans': Star }

export default function Offres({ user }) {
  const orgId = user?.org_id
  const role = user?.role || 'medicalliance'
  const [selectedDemande, setSelectedDemande] = useState('dem-01')

  let devis = DEVIS
  if (role === 'fournisseur') devis = DEVIS.filter(d => d.fournisseur_id === orgId)

  const demandeIds = [...new Set(devis.map(d => d.demande_id))]
  const devisForDemande = devis.filter(d => d.demande_id === selectedDemande)
  const demande = DEMANDES.find(d => d.id === selectedDemande)

  const lowestPrice = Math.min(...devisForDemande.map(d => d.total_ht))

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Selector demande */}
      {role !== 'fournisseur' && (
        <motion.div variants={fade} className="surface rounded-xl p-4 shadow-card">
          <p className="text-xs text-gray-400 mb-3">Sélectionner une demande</p>
          <div className="flex flex-wrap gap-2">
            {demandeIds.map(id => {
              const d = DEMANDES.find(dd => dd.id === id)
              return (
                <button key={id} onClick={() => setSelectedDemande(id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedDemande === id
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                  }`}>
                  {d?.ref} — {d?.etablissement.name}
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Demande info */}
      {demande && (
        <motion.div variants={fade} className="bg-white/3 border border-white/10 rounded-xl p-4 flex items-start gap-4">
          <FileText size={18} className="text-brand-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-brand-400">{demande.ref}</span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-sm text-white">{demande.etablissement.name}</span>
              <span className="text-xs text-gray-500">{demande.quantite} unités</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{demande.description}</p>
          </div>
          <span className="text-xs text-gray-500 shrink-0">{devisForDemande.length} devis</span>
        </motion.div>
      )}

      {/* Devis comparison cards */}
      <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devisForDemande.map((dev, i) => {
          const s = STATUT[dev.statut] || STATUT.en_attente
          const Icon = s.icon
          const isBest = dev.total_ht === lowestPrice
          return (
            <motion.div key={dev.id} variants={fade}
              className={`surface rounded-xl p-5 shadow-card border transition-all ${
                isBest ? 'border-emerald-500/40 shadow-emerald-500/10' : 'border-white/10'
              }`}>
              {isBest && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-3">
                  <Star size={12} fill="currentColor" /> Offre la moins chère
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xs text-brand-400">{dev.ref}</p>
                  <p className="text-sm font-medium text-white mt-0.5">{dev.fournisseur.name}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.color} flex items-center gap-1`}>
                  <Icon size={11}/> {s.label}
                </span>
              </div>

              <div className="text-3xl font-bold text-white mb-1">
                {dev.total_ht.toLocaleString('fr-FR')} <span className="text-lg text-gray-400">€</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                {dev.prix_unitaire.toLocaleString('fr-FR')} €/u · {dev.quantite} unités · HT
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Délai livraison</span>
                  <span className="text-white">{dev.delai_livraison}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Disponibilité</span>
                  <span className="text-white">{dev.disponibilite}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Paiement</span>
                  <span className="text-white">{dev.conditions_paiement}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Expire le</span>
                  <span className={`${dev.valide_jusqu_au < new Date().toISOString().split('T')[0] ? 'text-red-400' : 'text-white'}`}>
                    {dev.valide_jusqu_au}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 mb-4">
                <p className="text-xs text-gray-500 mb-2">Services inclus</p>
                <div className="flex flex-wrap gap-1.5">
                  {dev.services.map(s => (
                    <span key={s} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              {dev.note && (
                <p className="text-xs text-gray-500 italic mb-4">"{dev.note}"</p>
              )}

              {dev.statut === 'en_attente' && (
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 text-xs hover:text-white hover:border-white/20 transition-colors">
                    Refuser
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 text-white text-xs font-medium transition-colors">
                    Accepter
                  </button>
                </div>
              )}
              {dev.statut === 'accepte' && (
                <div className="text-center text-xs text-emerald-400 py-1">✓ Devis accepté — commande en cours</div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {devisForDemande.length === 0 && (
        <motion.div variants={fade} className="surface rounded-xl p-10 text-center shadow-card">
          <p className="text-gray-500 text-sm">Aucun devis pour cette demande</p>
        </motion.div>
      )}

    </motion.div>
  )
}
