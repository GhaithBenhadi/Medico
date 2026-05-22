import { useState } from 'react'
import {
  Zap, MapPin, Star, Clock, CheckCircle2, Users,
  TrendingUp, Shield, Award, ChevronRight, Filter,
  RefreshCcw, Send
} from 'lucide-react'

const suppliers = [
  {
    id: 1,
    name: 'MediPro France',
    initials: 'MP',
    gradient: 'from-blue-500 to-brand-600',
    score: 98,
    region: 'Occitanie · PACA',
    cities: ['Toulouse', 'Montpellier', 'Marseille', 'Nîmes'],
    delay: '3 jours',
    capacity: 'Haute',
    capacityColor: 'text-green-600 bg-green-50',
    status: 'Disponible',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    specialty: ['Lits médicalisés', 'Fauteuils'],
    responseRate: '97%',
    orders: 342,
    matched: true,
    premium: true,
    notified: false,
  },
  {
    id: 2,
    name: 'SudMed Equipements',
    initials: 'SM',
    gradient: 'from-violet-500 to-purple-600',
    score: 94,
    region: 'Occitanie',
    cities: ['Toulouse', 'Albi', 'Carcassonne', 'Foix'],
    delay: '4 jours',
    capacity: 'Haute',
    capacityColor: 'text-green-600 bg-green-50',
    status: 'Disponible',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    specialty: ['Lits médicalisés', 'Matelas'],
    responseRate: '92%',
    orders: 218,
    matched: true,
    premium: true,
    notified: false,
  },
  {
    id: 3,
    name: 'HealthCare Sud',
    initials: 'HC',
    gradient: 'from-emerald-500 to-green-600',
    score: 89,
    region: 'PACA · Languedoc',
    cities: ['Marseille', 'Nice', 'Montpellier'],
    delay: '5 jours',
    capacity: 'Moyenne',
    capacityColor: 'text-amber-600 bg-amber-50',
    status: 'Disponible',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    specialty: ['Lits', 'Fauteuils', 'Soins'],
    responseRate: '88%',
    orders: 156,
    matched: true,
    premium: false,
    notified: false,
  },
  {
    id: 4,
    name: 'Méditec PSDM',
    initials: 'MT',
    gradient: 'from-amber-500 to-orange-500',
    score: 85,
    region: 'Haute-Garonne',
    cities: ['Toulouse', 'Muret', 'Saint-Gaudens'],
    delay: '6 jours',
    capacity: 'Haute',
    capacityColor: 'text-green-600 bg-green-50',
    status: 'Disponible',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    specialty: ['Lits médicalisés'],
    responseRate: '84%',
    orders: 98,
    matched: true,
    premium: false,
    notified: false,
  },
  {
    id: 5,
    name: 'Atlantique Médical',
    initials: 'AM',
    gradient: 'from-sky-500 to-cyan-500',
    score: 91,
    region: 'Nouvelle-Aquitaine',
    cities: ['Bordeaux', 'Pau', 'Bayonne', 'Agen'],
    delay: '5 jours',
    capacity: 'Haute',
    capacityColor: 'text-green-600 bg-green-50',
    status: 'Limité',
    statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
    specialty: ['Lits', 'Fauteuils', 'Diagnostic'],
    responseRate: '90%',
    orders: 267,
    matched: false,
    premium: true,
    notified: false,
  },
]

function ScoreBadge({ score }) {
  const color = score >= 95 ? 'text-green-600' : score >= 88 ? 'text-blue-600' : 'text-amber-600'
  const bg = score >= 95 ? 'bg-green-50' : score >= 88 ? 'bg-blue-50' : 'bg-amber-50'
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${bg}`}>
      <Star className={`w-3 h-3 ${color}`} strokeWidth={2.5} fill="currentColor" />
      <span className={`text-xs font-bold ${color}`}>{score}</span>
    </div>
  )
}

function ScoreBar({ value, max = 100, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right tabular-nums">{value}%</span>
    </div>
  )
}

export default function NetworkDistribution({ onNavigate }) {
  const [items, setItems] = useState(suppliers)
  const [sent, setSent] = useState(false)
  const [filter, setFilter] = useState('all')

  const toggleNotify = (id) => {
    setItems(prev => prev.map(s => s.id === id ? { ...s, notified: !s.notified } : s))
  }

  const notifiedCount = items.filter(s => s.notified).length
  const matchedCount = items.filter(s => s.matched).length

  const handleSend = () => {
    setSent(true)
    setItems(prev => prev.map(s => s.matched ? { ...s, notified: true } : s))
  }

  const displayed = filter === 'matched' ? items.filter(s => s.matched)
    : filter === 'premium' ? items.filter(s => s.premium)
    : items

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Context banner */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-gray-900">Diffusion en cours</h2>
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">URGENT</span>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              <span className="font-semibold">DEM-2024</span> — 20 lits médicalisés · EHPAD Toulouse
            </p>
            <p className="text-xs text-gray-400 mt-1">Créée par Sophie Lambert · il y a 2 minutes</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-2xl font-bold text-brand-600 tabular-nums">{matchedCount}</p>
              <p className="text-xs text-gray-400">matchés</p>
            </div>
            <div className="w-px h-10 bg-surface-200" />
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{items.length}</p>
              <p className="text-xs text-gray-400">fournisseurs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Matching stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Score matching moyen', value: '91.4', unit: '/100', icon: TrendingUp, color: 'text-brand-600 bg-brand-50' },
          { label: 'Délai moyen de réponse', value: '4.6', unit: 'jours', icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Taux de réponse moy.', value: '90', unit: '%', icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
          { label: 'Fournisseurs premium', value: '3', unit: `/${items.length}`, icon: Award, color: 'text-violet-600 bg-violet-50' },
        ].map(({ label, value, unit, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-card border border-surface-100">
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-4 h-4" strokeWidth={2} />
            </div>
            <p className="text-xl font-bold text-gray-900 tabular-nums">
              {value}<span className="text-sm font-medium text-gray-400 ml-0.5">{unit}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-white rounded-xl border border-surface-200 overflow-hidden shadow-xs">
          {[['all', 'Tous'], ['matched', 'Matchés'], ['premium', 'Premium']].map(([val, lbl]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                filter === val ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-surface-50'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">{displayed.length} résultat(s)</span>

        {!sent ? (
          <button
            onClick={handleSend}
            className="ml-auto flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            Diffuser aux matchés ({matchedCount})
          </button>
        ) : (
          <div className="ml-auto flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-xl text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Diffusée à {matchedCount} fournisseurs
          </div>
        )}
      </div>

      {/* Supplier cards */}
      <div className="grid grid-cols-1 gap-4">
        {displayed.map((s) => (
          <div
            key={s.id}
            className={`bg-white rounded-2xl shadow-card border transition-all duration-200 overflow-hidden ${
              s.matched ? 'border-surface-100 hover:shadow-card-hover' : 'border-surface-100 opacity-70'
            }`}
          >
            <div className="flex items-start gap-5 p-5">
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
                {s.initials}
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-sm font-bold text-gray-900">{s.name}</h3>
                  {s.premium && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded-full">
                      <Shield className="w-2.5 h-2.5" />PREMIUM
                    </span>
                  )}
                  {s.matched && (
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                      MATCHÉ
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.statusColor}`}>
                    {s.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <MapPin className="w-3 h-3" />
                  {s.region} · {s.cities.join(', ')}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Score qualité</p>
                    <ScoreBar value={s.score} color="bg-brand-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Taux réponse</p>
                    <ScoreBar value={parseInt(s.responseRate)} color="bg-green-500" />
                  </div>
                  <div className="flex items-start flex-col">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Délai moyen</p>
                    <span className="text-xs font-semibold text-gray-700">{s.delay}</span>
                  </div>
                  <div className="flex items-start flex-col">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Commandes</p>
                    <span className="text-xs font-semibold text-gray-700">{s.orders} réalisées</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {s.specialty.map((sp) => (
                    <span key={sp} className="text-[11px] text-gray-600 bg-surface-100 px-2 py-0.5 rounded-md font-medium">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <ScoreBadge score={s.score} />

                <button
                  onClick={() => toggleNotify(s.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    s.notified
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-surface-50 text-gray-600 border-surface-200 hover:border-brand-300 hover:text-brand-600'
                  }`}
                >
                  {s.notified ? <><CheckCircle2 className="w-3.5 h-3.5" /> Notifié</> : <><Send className="w-3.5 h-3.5" /> Notifier</>}
                </button>

                <button
                  onClick={() => onNavigate('supplier-quotes')}
                  className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1"
                >
                  Voir profil <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
