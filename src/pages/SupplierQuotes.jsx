import { useState } from 'react'
import {
  Star, Clock, Truck, Shield, CheckCircle2, ChevronDown,
  Award, TrendingDown, ArrowRight, X, ThumbsUp, Package,
  FileText, Zap, MoreHorizontal, Filter
} from 'lucide-react'

const quotes = [
  {
    id: 'DEV-881',
    supplier: 'MediPro France',
    initials: 'MP',
    gradient: 'from-blue-500 to-brand-600',
    score: 98,
    unitPrice: 2490,
    qty: 20,
    totalPrice: 47200,
    delivery: '3 jours',
    availability: 'Immédiate',
    services: ['Installation', 'Formation', 'SAV 24h', 'Garantie 5 ans'],
    premium: true,
    recommended: true,
    status: 'Nouveau',
    statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
    note: 'Lot de 20 unités avec remise groupée de 5%. Certification NF EN ISO 9001.',
    validUntil: '30 mai 2024',
    paymentTerms: '30 jours net',
  },
  {
    id: 'DEV-879',
    supplier: 'SudMed Equipements',
    initials: 'SM',
    gradient: 'from-violet-500 to-purple-600',
    score: 94,
    unitPrice: 2350,
    qty: 20,
    totalPrice: 45500,
    delivery: '5 jours',
    availability: 'Sous 48h',
    services: ['Installation', 'SAV 8h-18h', 'Garantie 3 ans'],
    premium: true,
    recommended: false,
    status: 'Nouveau',
    statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
    note: 'Modèle HD3000 certifié CE. Option matelas incluse pour commande > 15 unités.',
    validUntil: '28 mai 2024',
    paymentTerms: '45 jours net',
  },
  {
    id: 'DEV-876',
    supplier: 'HealthCare Sud',
    initials: 'HC',
    gradient: 'from-emerald-500 to-green-600',
    score: 89,
    unitPrice: 2180,
    qty: 20,
    totalPrice: 42600,
    delivery: '7 jours',
    availability: 'Sous 1 semaine',
    services: ['Installation', 'Garantie 2 ans'],
    premium: false,
    recommended: false,
    status: 'Lu',
    statusColor: 'text-gray-600 bg-gray-50 border-gray-200',
    note: 'Prix compétitif. Livraison possible par tranche de 5 unités.',
    validUntil: '2 juin 2024',
    paymentTerms: '60 jours net',
  },
  {
    id: 'DEV-874',
    supplier: 'Méditec PSDM',
    initials: 'MT',
    gradient: 'from-amber-500 to-orange-500',
    score: 85,
    unitPrice: 2290,
    qty: 18,
    totalPrice: 41220,
    delivery: '6 jours',
    availability: 'Partielle (18/20)',
    services: ['SAV 8h-18h', 'Garantie 2 ans'],
    premium: false,
    recommended: false,
    status: 'Lu',
    statusColor: 'text-gray-600 bg-gray-50 border-gray-200',
    note: 'Stock limité à 18 unités disponibles immédiatement. 2 unités en 15 jours.',
    validUntil: '25 mai 2024',
    paymentTerms: '30 jours net',
  },
]

const serviceIcons = {
  'Installation': Package,
  'Formation': Award,
  'SAV 24h': Shield,
  'SAV 8h-18h': Shield,
  'Garantie 5 ans': CheckCircle2,
  'Garantie 3 ans': CheckCircle2,
  'Garantie 2 ans': CheckCircle2,
}

function QuoteCard({ quote, selected, onSelect, onAccept }) {
  const [expanded, setExpanded] = useState(false)
  const savings = quotes[0].totalPrice - quote.totalPrice

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 ${
      selected ? 'border-brand-400 shadow-card-hover ring-2 ring-brand-100' :
      quote.recommended ? 'border-brand-200 shadow-card' : 'border-surface-100 shadow-card'
    }`}>
      {quote.recommended && (
        <div className="bg-gradient-to-r from-brand-600 to-blue-500 px-5 py-2 rounded-t-2xl flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          <span className="text-xs font-bold text-white">Recommandé par Medico</span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${quote.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
            {quote.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-gray-900">{quote.supplier}</h3>
              {quote.premium && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded-full">
                  <Shield className="w-2.5 h-2.5" />PREMIUM
                </span>
              )}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${quote.statusColor}`}>
                {quote.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Ref. {quote.id} · Valide jusqu'au {quote.validUntil}</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
            <Star className="w-3 h-3" fill="currentColor" />
            {quote.score}
          </div>
        </div>

        {/* Price highlight */}
        <div className="bg-surface-50 rounded-xl p-4 mb-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Prix unitaire</p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">
              {quote.unitPrice.toLocaleString('fr-FR')} €
              <span className="text-xs font-normal text-gray-400 ml-1">HT/unité</span>
            </p>
          </div>
          <div className="w-px h-10 bg-surface-200" />
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Total ({quote.qty} unités)</p>
            <p className="text-2xl font-bold text-brand-700 tabular-nums">
              {quote.totalPrice.toLocaleString('fr-FR')} €
              <span className="text-xs font-normal text-gray-400 ml-1">HT</span>
            </p>
          </div>
          {!quote.recommended && savings > 0 && (
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-semibold mb-1">vs. meilleure offre</p>
              <p className="text-sm font-bold text-red-500 flex items-center gap-1 justify-end">
                <TrendingDown className="w-3.5 h-3.5" />
                -{savings.toLocaleString('fr-FR')} €
              </p>
            </div>
          )}
        </div>

        {/* Metadata row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: Clock,   label: 'Délai livraison', value: quote.delivery },
            { icon: Package, label: 'Disponibilité',   value: quote.availability },
            { icon: FileText, label: 'Paiement',       value: quote.paymentTerms },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-surface-100 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold">{label}</p>
                <p className="text-xs font-semibold text-gray-700">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {quote.services.map((s) => {
            const Icon = serviceIcons[s] || CheckCircle2
            return (
              <span key={s} className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full font-medium">
                <Icon className="w-3 h-3" strokeWidth={2} />
                {s}
              </span>
            )
          })}
        </div>

        {/* Note */}
        <p className="text-xs text-gray-500 bg-surface-50 rounded-lg px-3 py-2.5 leading-relaxed mb-4">
          {quote.note}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(quote.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              selected
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-surface-100 text-gray-700 hover:bg-surface-200'
            }`}
          >
            {selected ? '✓ Sélectionné' : 'Sélectionner'}
          </button>
          <button
            onClick={() => onAccept(quote.id)}
            className="flex items-center gap-1.5 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <ThumbsUp className="w-3.5 h-3.5" strokeWidth={2.5} />
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SupplierQuotes({ onNavigate }) {
  const [selected, setSelected] = useState(null)
  const [accepted, setAccepted] = useState(null)
  const [sortBy, setSortBy] = useState('score')

  const toggleSelect = (id) => setSelected(prev => prev === id ? null : id)
  const handleAccept = (id) => setAccepted(id)

  const sorted = [...quotes].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score
    if (sortBy === 'price') return a.totalPrice - b.totalPrice
    if (sortBy === 'delay') return parseInt(a.delivery) - parseInt(b.delivery)
    return 0
  })

  if (accepted) {
    const q = quotes.find(q => q.id === accepted)
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Offre acceptée</h2>
        <p className="text-gray-500 text-sm mb-1">
          Vous avez sélectionné l'offre de <span className="font-semibold text-gray-700">{q?.supplier}</span>
        </p>
        <p className="text-2xl font-bold text-brand-700 mt-4">{q?.totalPrice.toLocaleString('fr-FR')} € HT</p>
        <p className="text-xs text-gray-400 mt-1">Livraison prévue dans {q?.delivery}</p>
        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={() => onNavigate('rental-management')}
            className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-brand-700 transition-colors"
          >
            Voir les locations <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAccepted(null)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-surface-200 text-gray-600 hover:bg-surface-50 transition-colors"
          >
            Retour aux devis
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      {/* Demand context */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-5">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400">DEM-2024</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">URGENT</span>
            </div>
            <h2 className="text-base font-bold text-gray-900">20 lits médicalisés — EHPAD Toulouse</h2>
            <p className="text-xs text-gray-400 mt-0.5">Sophie Lambert · {quotes.length} devis reçus · Délai d'acceptation : 3 jours</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Trier par</span>
            {[['score', 'Qualité'], ['price', 'Prix'], ['delay', 'Délai']].map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setSortBy(val)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  sortBy === val ? 'bg-brand-600 text-white' : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary comparison bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Prix min',      value: `${Math.min(...quotes.map(q => q.totalPrice)).toLocaleString('fr-FR')} €`, color: 'text-green-600' },
          { label: 'Prix max',      value: `${Math.max(...quotes.map(q => q.totalPrice)).toLocaleString('fr-FR')} €`, color: 'text-red-500' },
          { label: 'Meilleur score', value: `${Math.max(...quotes.map(q => q.score))}/100`, color: 'text-brand-600' },
          { label: 'Délai min',     value: `${Math.min(...quotes.map(q => parseInt(q.delivery)))} jours`, color: 'text-violet-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-card border border-surface-100">
            <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
            <p className={`text-lg font-bold tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quote cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sorted.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            selected={selected === quote.id}
            onSelect={toggleSelect}
            onAccept={handleAccept}
          />
        ))}
      </div>
    </div>
  )
}
