import { motion } from 'framer-motion'
import { ShoppingBag, CheckCircle, Clock, Truck, MapPin, Calendar } from 'lucide-react'
import { DEVIS, DEMANDES, ORGANISATIONS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

// Simulation de commandes basée sur les devis acceptés
const COMMANDES = [
  {
    id: 'cmd-01', ref: 'CMD-2024-041',
    devis_id: 'dev-04', demande_id: 'dem-02',
    fournisseur_id: 'org-10', etablissement_id: 'org-21',
    equipement: 'Fauteuils roulants', quantite: 8,
    montant_ht: 6560, statut: 'en_livraison',
    date_commande: '2024-04-18', date_livraison_prevue: '2024-04-22',
    site: 'Clinique Saint-Joseph, Lyon',
    fournisseur: { id: 'org-10', name: 'MediPro France' },
    etablissement: { id: 'org-21', name: 'Clinique Saint-Joseph' },
  },
  {
    id: 'cmd-02', ref: 'CMD-2024-038',
    devis_id: 'dev-01', demande_id: 'dem-01',
    fournisseur_id: 'org-10', etablissement_id: 'org-20',
    equipement: 'Lits médicalisés électriques', quantite: 20,
    montant_ht: 47200, statut: 'confirmee',
    date_commande: '2024-04-19', date_livraison_prevue: '2024-04-22',
    site: 'EHPAD Les Jardins, Toulouse',
    fournisseur: { id: 'org-10', name: 'MediPro France' },
    etablissement: { id: 'org-20', name: 'EHPAD Les Jardins' },
  },
  {
    id: 'cmd-03', ref: 'CMD-2024-029',
    devis_id: null, demande_id: 'dem-04',
    fournisseur_id: 'org-11', etablissement_id: 'org-22',
    equipement: 'Matelas anti-escarre', quantite: 6,
    montant_ht: 4320, statut: 'livree',
    date_commande: '2024-04-10', date_livraison_prevue: '2024-04-14',
    date_livraison_reelle: '2024-04-13',
    site: 'HAD Sud-Ouest, Bordeaux',
    fournisseur: { id: 'org-11', name: 'SudMed Equipements' },
    etablissement: { id: 'org-22', name: 'HAD Sud-Ouest' },
  },
]

const STATUT = {
  confirmee:    { label: 'Confirmée',    color: 'bg-blue-500/20 text-blue-400',     icon: CheckCircle, step: 1 },
  en_livraison: { label: 'En livraison', color: 'bg-amber-500/20 text-amber-400',   icon: Truck,       step: 2 },
  livree:       { label: 'Livrée',       color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle, step: 3 },
}

const STEPS = ['Confirmée', 'En livraison', 'Livrée']

export default function Commandes({ user }) {
  const orgId = user?.org_id
  const role = user?.role || 'medicalliance'

  let commandes = COMMANDES
  if (role === 'fournisseur')   commandes = COMMANDES.filter(c => c.fournisseur_id === orgId)
  if (role === 'etablissement') commandes = COMMANDES.filter(c => c.etablissement_id === orgId)
  if (role === 'centrale')      commandes = COMMANDES // centrale voit toutes

  const total = commandes.reduce((s, c) => s + c.montant_ht, 0)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Summary */}
      <motion.div variants={fade} className="grid grid-cols-3 gap-4">
        {[
          { label: 'Commandes actives', value: commandes.filter(c => c.statut !== 'livree').length },
          { label: 'Livrées ce mois',   value: commandes.filter(c => c.statut === 'livree').length },
          { label: 'Montant total',      value: `${total.toLocaleString('fr-FR')} €` },
        ].map(s => (
          <div key={s.label} className="surface rounded-xl p-4 shadow-card">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Commandes */}
      <div className="space-y-4">
        {commandes.map(c => {
          const s = STATUT[c.statut] || STATUT.confirmee
          const Icon = s.icon
          return (
            <motion.div key={c.id} variants={fade} className="surface rounded-xl p-5 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs text-brand-400">{c.ref}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${s.color}`}>
                      <Icon size={11}/> {s.label}
                    </span>
                  </div>
                  <p className="text-base font-medium text-white">{c.equipement}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.quantite} unités · {c.fournisseur.name}</p>
                </div>
                <p className="text-xl font-bold text-white">{c.montant_ht.toLocaleString('fr-FR')} €</p>
              </div>

              {/* Progress steps */}
              <div className="flex items-center gap-0 mb-4">
                {STEPS.map((step, i) => {
                  const done = i < s.step
                  const current = i === s.step - 1
                  return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div className={`flex flex-col items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          done ? 'bg-emerald-500 border-emerald-500 text-white' :
                          current ? 'bg-brand-500 border-brand-500 text-white' :
                          'bg-transparent border-white/20 text-gray-600'
                        }`}>
                          {done ? '✓' : i + 1}
                        </div>
                        <span className={`text-xs mt-1 ${done || current ? 'text-white' : 'text-gray-600'}`}>{step}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mb-5 mx-1 ${i < s.step - 1 ? 'bg-emerald-500' : 'bg-white/10'}`} />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <MapPin size={12}/> {c.site}
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Calendar size={12}/> Commandé le {c.date_commande}
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Truck size={12}/>
                  {c.statut === 'livree'
                    ? `Livré le ${c.date_livraison_reelle}`
                    : `Livraison prévue ${c.date_livraison_prevue}`}
                </div>
              </div>

              {c.statut === 'en_livraison' && (
                <div className="mt-3 flex gap-2">
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-colors">
                    Suivre la livraison
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-colors">
                    Contacter le fournisseur
                  </button>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {commandes.length === 0 && (
        <motion.div variants={fade} className="surface rounded-xl p-10 text-center shadow-card">
          <ShoppingBag size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucune commande</p>
        </motion.div>
      )}

    </motion.div>
  )
}
