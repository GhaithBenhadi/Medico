import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronRight, ChevronLeft, Package, MapPin, Settings, Send, AlertCircle } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Équipement',    icon: Package },
  { id: 2, label: 'Localisation',  icon: MapPin },
  { id: 3, label: 'Paramètres',    icon: Settings },
  { id: 4, label: 'Diffusion',     icon: Send },
]

const CATEGORIES = ['Lits médicalisés', 'Fauteuils roulants', 'Matelas anti-escarre', 'Lève-personnes', 'Tables de soins', 'Déambulateurs', 'Matériel respiratoire', 'Autre']

export default function NewDemande({ onNavigate, user }) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    categorie: '',
    description: '',
    quantite: '',
    type_demande: 'achat',
    urgence: 'standard',
    site_name: '',
    city: '',
    postal_code: '',
    contact_name: user?.full_name || '',
    date_limite: '',
    budget_estime: '',
    notes: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-12 shadow-card border border-surface-100 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Demande créée avec succès !</h2>
          <p className="text-sm text-gray-500 mb-8">Votre demande a été enregistrée et sera diffusée aux adhérents correspondants.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => onNavigate('demandes')}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Voir mes demandes
            </button>
            <button
              onClick={() => { setSubmitted(false); setStep(1); setForm({ ...form, description: '', quantite: '' }) }}
              className="px-6 py-2.5 bg-surface-100 hover:bg-surface-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Nouvelle demande
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Nouvelle demande</h2>
        <p className="text-sm text-gray-500 mt-0.5">Créez et diffusez une demande d'équipement médical</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const done = step > s.id
          const active = step === s.id
          const Icon = s.icon
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-2 flex-1 ${i > 0 ? '' : ''}`}>
                {i > 0 && <div className={`h-px flex-1 ${done ? 'bg-brand-500' : 'bg-surface-200'}`} />}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    done ? 'bg-brand-600' : active ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-surface-200'
                  }`}>
                    {done
                      ? <CheckCircle2 className="w-4 h-4 text-white" />
                      : <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                    }
                  </div>
                  <span className={`text-[11px] font-medium mt-1 whitespace-nowrap ${active ? 'text-brand-700' : done ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`h-px flex-1 ${done ? 'bg-brand-500' : 'bg-surface-200'}`} />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-card border border-surface-100"
        >
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-gray-900">Quel équipement demandez-vous ?</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Catégorie</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => set('categorie', c)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
                        form.categorie === c
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-surface-200 text-gray-700 hover:border-brand-300 hover:bg-surface-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description détaillée</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="Spécifications techniques, certifications requises…"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Quantité</label>
                  <input type="number" min="1" value={form.quantite} onChange={e => set('quantite', e.target.value)}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="ex: 20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Type de demande</label>
                  <select value={form.type_demande} onChange={e => set('type_demande', e.target.value)}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white"
                  >
                    <option value="achat">Achat</option>
                    <option value="location">Location</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-gray-900">Où livrer l'équipement ?</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom du site / établissement</label>
                <input type="text" value={form.site_name} onChange={e => set('site_name', e.target.value)}
                  className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="EHPAD Les Jardins…"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ville</label>
                  <input type="text" value={form.city} onChange={e => set('city', e.target.value)}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="Toulouse"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Code postal</label>
                  <input type="text" value={form.postal_code} onChange={e => set('postal_code', e.target.value)}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="31000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Contact sur place</label>
                <input type="text" value={form.contact_name} onChange={e => set('contact_name', e.target.value)}
                  className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-gray-900">Paramètres de la demande</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Niveau d'urgence</label>
                <div className="flex gap-3">
                  {['urgent', 'standard', 'faible'].map(u => (
                    <button key={u} onClick={() => set('urgence', u)}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all capitalize ${
                        form.urgence === u
                          ? u === 'urgent' ? 'border-red-400 bg-red-50 text-red-700'
                          : u === 'standard' ? 'border-brand-400 bg-brand-50 text-brand-700'
                          : 'border-gray-300 bg-gray-50 text-gray-700'
                          : 'border-surface-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >{u}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date limite de réponse</label>
                  <input type="date" value={form.date_limite} onChange={e => set('date_limite', e.target.value)}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Budget estimé (€ HT)</label>
                  <input type="number" value={form.budget_estime} onChange={e => set('budget_estime', e.target.value)}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="50 000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Notes complémentaires</label>
                <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
                  className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="Conditions particulières, contraintes logistiques…"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-gray-900">Prêt à diffuser ?</h3>
              <div className="bg-surface-50 rounded-xl p-5 border border-surface-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Récapitulatif</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Catégorie</span>
                    <span className="font-semibold text-gray-800">{form.categorie || '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quantité</span>
                    <span className="font-semibold text-gray-800">{form.quantite || '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type</span>
                    <span className="font-semibold text-gray-800 capitalize">{form.type_demande}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Site</span>
                    <span className="font-semibold text-gray-800">{form.site_name || '—'}, {form.city}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Urgence</span>
                    <span className={`font-semibold capitalize ${form.urgence === 'urgent' ? 'text-red-600' : 'text-gray-800'}`}>{form.urgence}</span>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">La demande sera diffusée aux adhérents Medicalliance correspondant à votre zone géographique.</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : onNavigate('demandes')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-surface-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-surface-50 transition-colors shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 1 ? 'Annuler' : 'Précédent'}
        </button>
        {step < 4 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            Diffuser la demande
          </button>
        )}
      </div>
    </div>
  )
}
