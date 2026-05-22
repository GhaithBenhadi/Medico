import { useState } from 'react'
import {
  Bed, Armchair, Heart, Activity, Clipboard, Stethoscope,
  ShoppingCart, Clock, MapPin, Upload, ChevronRight,
  AlertCircle, CheckCircle2, ArrowLeft, Zap, Info
} from 'lucide-react'

const categories = [
  { id: 'lits',          label: 'Lits médicalisés',     icon: Bed,          color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'fauteuils',     label: 'Fauteuils & mobilité', icon: Armchair,     color: 'bg-violet-50 text-violet-600 border-violet-200' },
  { id: 'soins',         label: 'Matériel de soins',    icon: Heart,        color: 'bg-red-50 text-red-600 border-red-200' },
  { id: 'diagnostic',    label: 'Diagnostic',           icon: Activity,     color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { id: 'hygiene',       label: 'Hygiène & prévention', icon: Clipboard,    color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'autre',         label: 'Autre équipement',     icon: Stethoscope,  color: 'bg-gray-50 text-gray-600 border-gray-200' },
]

const urgencies = [
  { id: 'standard',   label: 'Standard',       sub: '5-10 jours',  color: 'border-gray-200 text-gray-700' },
  { id: 'prioritaire', label: 'Prioritaire',   sub: '2-4 jours',   color: 'border-amber-300 text-amber-700' },
  { id: 'urgent',     label: 'Urgent',         sub: '24-48h',      color: 'border-red-300 text-red-700' },
]

const requestTypes = [
  { id: 'achat',    label: 'Achat',        sub: 'Acquisition définitive', icon: ShoppingCart },
  { id: 'location', label: 'Location',     sub: 'Mise à disposition',     icon: Clock },
]

const steps = ['Type', 'Détails', 'Localisation', 'Validation']

export default function NewRequest({ onNavigate }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    category: '',
    requestType: '',
    urgency: 'standard',
    quantity: '1',
    duration: '',
    description: '',
    site: '',
    city: '',
    postalCode: '',
    contact: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => onNavigate('network-distribution'), 2200)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Demande créée avec succès</h2>
        <p className="text-gray-500 text-sm">
          Votre demande est en cours de diffusion à votre réseau premium de fournisseurs.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-brand-600">
          <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
          Redirection vers la diffusion réseau…
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Back */}
      <button
        onClick={() => step > 0 ? setStep(step - 1) : onNavigate('dashboard')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {step > 0 ? 'Étape précédente' : 'Retour au dashboard'}
      </button>

      {/* Stepper */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6 mb-6">
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  i < step ? 'bg-brand-600 text-white' :
                  i === step ? 'bg-brand-600 text-white ring-4 ring-brand-100' :
                  'bg-surface-100 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-3 transition-colors ${i < step ? 'bg-brand-200' : 'bg-surface-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 0 – Type */}
      {step === 0 && (
        <div className="space-y-6 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Catégorie de matériel</h3>
            <p className="text-xs text-gray-400 mb-5">Sélectionnez le type d'équipement dont vous avez besoin</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => set('category', id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                    form.category === id
                      ? 'border-brand-500 bg-brand-50 shadow-sm'
                      : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center border shrink-0`}>
                    <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                  </div>
                  <span className={`text-xs font-semibold leading-tight ${form.category === id ? 'text-brand-700' : 'text-gray-700'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Type de demande</h3>
            <p className="text-xs text-gray-400 mb-5">Achat ou location du matériel</p>
            <div className="grid grid-cols-2 gap-3">
              {requestTypes.map(({ id, label, sub, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => set('requestType', id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    form.requestType === id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.requestType === id ? 'bg-brand-600 text-white' : 'bg-surface-100 text-gray-500'}`}>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${form.requestType === id ? 'text-brand-700' : 'text-gray-800'}`}>{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Niveau d'urgence</h3>
            <p className="text-xs text-gray-400 mb-5">Impacte la priorité de diffusion à votre réseau</p>
            <div className="grid grid-cols-3 gap-3">
              {urgencies.map(({ id, label, sub, color }) => (
                <button
                  key={id}
                  onClick={() => set('urgency', id)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    form.urgency === id
                      ? `border-current ${color} bg-opacity-10 shadow-sm`
                      : 'border-surface-200 hover:border-surface-300'
                  } ${form.urgency === id ? color : 'text-gray-600'}`}
                >
                  <p className="text-sm font-bold">{label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 1 – Details */}
      {step === 1 && (
        <div className="space-y-4 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-900">Détails de la demande</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Quantité</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => set('quantity', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
              {form.requestType === 'location' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Durée (mois)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="ex. 12"
                    value={form.duration}
                    onChange={(e) => set('duration', e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description du besoin</label>
              <textarea
                rows={4}
                placeholder="Décrivez précisément vos besoins, spécifications techniques requises, contraintes particulières…"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none placeholder-gray-400"
              />
            </div>

            {/* File upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pièces jointes</label>
              <div className="border-2 border-dashed border-surface-200 rounded-xl p-6 text-center hover:border-brand-200 hover:bg-brand-50/30 transition-all cursor-pointer">
                <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">Glissez vos fichiers ici</p>
                <p className="text-xs text-gray-400 mt-1">PDF, images, cahier des charges — max 20 Mo</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Plus votre description est précise, meilleures seront les offres de vos fournisseurs. Pensez à mentionner les normes ou certifications requises.
            </p>
          </div>
        </div>
      )}

      {/* Step 2 – Location */}
      {step === 2 && (
        <div className="space-y-4 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-900">Localisation & site</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom de l'établissement</label>
              <input
                type="text"
                placeholder="ex. EHPAD Les Jardins, Clinique Saint-Joseph"
                value={form.site}
                onChange={(e) => set('site', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ville</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ex. Toulouse"
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Code postal</label>
                <input
                  type="text"
                  placeholder="31000"
                  value={form.postalCode}
                  onChange={(e) => set('postalCode', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Contact sur site</label>
              <input
                type="text"
                placeholder="Nom et téléphone du responsable"
                value={form.contact}
                onChange={(e) => set('contact', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3 – Review */}
      {step === 3 && (
        <div className="space-y-4 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-card border border-surface-100 divide-y divide-surface-50">
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-900">Récapitulatif de la demande</h3>
            </div>
            {[
              { label: 'Catégorie',     value: categories.find(c => c.id === form.category)?.label || '—' },
              { label: 'Type',          value: form.requestType === 'achat' ? 'Achat' : 'Location' },
              { label: 'Urgence',       value: urgencies.find(u => u.id === form.urgency)?.label || '—' },
              { label: 'Quantité',      value: form.quantity },
              { label: 'Description',   value: form.description || '—' },
              { label: 'Établissement', value: form.site || '—' },
              { label: 'Ville',         value: `${form.city} ${form.postalCode}`.trim() || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-4 px-6 py-3.5">
                <span className="text-xs text-gray-400 w-28 shrink-0 pt-0.5">{label}</span>
                <span className="text-sm text-gray-800 font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-brand-600 to-blue-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" strokeWidth={2.5} />
              <p className="text-sm font-semibold">Diffusion intelligente</p>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              Votre demande sera automatiquement diffusée aux fournisseurs premium correspondant à votre zone géographique et à la catégorie de matériel. Les mieux notés seront contactés en priorité.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Précédent
          </button>
        ) : <div />}

        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 0 && (!form.category || !form.requestType)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Continuer <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Zap className="w-4 h-4" strokeWidth={2.5} />
            Diffuser la demande
          </button>
        )}
      </div>
    </div>
  )
}
