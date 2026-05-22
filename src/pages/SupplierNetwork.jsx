import { useState } from 'react'
import {
  MapPin, Star, Shield, CheckCircle2, Clock, Users,
  TrendingUp, Package, Award, Search, Filter,
  ChevronRight, Zap, Globe, Phone, Mail
} from 'lucide-react'

const suppliers = [
  {
    id: 1,
    name: 'MediPro France',
    initials: 'MP',
    gradient: 'from-blue-500 to-brand-600',
    score: 98,
    tier: 'Premium Gold',
    tierColor: 'text-amber-700 bg-amber-50 border-amber-300',
    tierIcon: '🥇',
    regions: ['Occitanie', 'PACA', 'Nouvelle-Aquitaine'],
    specialties: ['Lits médicalisés', 'Fauteuils', 'Manutention'],
    capacity: 'Haute',
    responseRate: '97%',
    avgDelay: '3j',
    orders: 342,
    activeRentals: 24,
    joinDate: 'janv. 2021',
    status: 'Disponible',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    contact: { name: 'Pierre Martin', phone: '05 61 XX XX XX', email: 'p.martin@medipro.fr' },
    certifications: ['ISO 9001', 'NF EN 62353', 'QUALISAN'],
    cities: 8,
    featured: true,
  },
  {
    id: 2,
    name: 'SudMed Equipements',
    initials: 'SM',
    gradient: 'from-violet-500 to-purple-600',
    score: 94,
    tier: 'Premium',
    tierColor: 'text-violet-700 bg-violet-50 border-violet-300',
    tierIcon: '🥈',
    regions: ['Occitanie', 'Auvergne-Rhône-Alpes'],
    specialties: ['Lits médicalisés', 'Matelas anti-escarre', 'Prévention'],
    capacity: 'Haute',
    responseRate: '92%',
    avgDelay: '4j',
    orders: 218,
    activeRentals: 18,
    joinDate: 'mars 2021',
    status: 'Disponible',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    contact: { name: 'Claire Dubois', phone: '04 67 XX XX XX', email: 'c.dubois@sudmed.fr' },
    certifications: ['ISO 9001', 'NF EN 62353'],
    cities: 6,
    featured: true,
  },
  {
    id: 3,
    name: 'Atlantique Médical',
    initials: 'AM',
    gradient: 'from-sky-500 to-cyan-500',
    score: 91,
    tier: 'Premium',
    tierColor: 'text-violet-700 bg-violet-50 border-violet-300',
    tierIcon: '🥈',
    regions: ['Nouvelle-Aquitaine', 'Pays de la Loire'],
    specialties: ['Fauteuils roulants', 'Diagnostic', 'Soins'],
    capacity: 'Haute',
    responseRate: '90%',
    avgDelay: '4j',
    orders: 267,
    activeRentals: 31,
    joinDate: 'juin 2021',
    status: 'Limité',
    statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
    contact: { name: 'Marc Leroy', phone: '05 56 XX XX XX', email: 'm.leroy@atlantiquemedical.fr' },
    certifications: ['ISO 9001', 'QUALISAN'],
    cities: 5,
    featured: true,
  },
  {
    id: 4,
    name: 'HealthCare Sud',
    initials: 'HC',
    gradient: 'from-emerald-500 to-green-600',
    score: 89,
    tier: 'Partenaire',
    tierColor: 'text-gray-600 bg-gray-50 border-gray-200',
    tierIcon: '🏅',
    regions: ['PACA', 'Languedoc-Roussillon'],
    specialties: ['Lits', 'Fauteuils', 'Matériel de soins'],
    capacity: 'Moyenne',
    responseRate: '88%',
    avgDelay: '5j',
    orders: 156,
    activeRentals: 12,
    joinDate: 'sept. 2022',
    status: 'Disponible',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    contact: { name: 'Sophie Blanc', phone: '04 91 XX XX XX', email: 's.blanc@healthcaresud.fr' },
    certifications: ['ISO 9001'],
    cities: 4,
    featured: false,
  },
  {
    id: 5,
    name: 'Méditec PSDM',
    initials: 'MT',
    gradient: 'from-amber-500 to-orange-500',
    score: 85,
    tier: 'Partenaire',
    tierColor: 'text-gray-600 bg-gray-50 border-gray-200',
    tierIcon: '🏅',
    regions: ['Haute-Garonne', 'Ariège'],
    specialties: ['Lits médicalisés', 'Manutention'],
    capacity: 'Haute',
    responseRate: '84%',
    avgDelay: '6j',
    orders: 98,
    activeRentals: 7,
    joinDate: 'jan. 2023',
    status: 'Disponible',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    contact: { name: 'Jean Roux', phone: '05 61 XX XX XX', email: 'j.roux@meditec.fr' },
    certifications: ['ISO 9001'],
    cities: 3,
    featured: false,
  },
  {
    id: 6,
    name: 'Nord Médical Services',
    initials: 'NM',
    gradient: 'from-rose-500 to-pink-600',
    score: 87,
    tier: 'Partenaire',
    tierColor: 'text-gray-600 bg-gray-50 border-gray-200',
    tierIcon: '🏅',
    regions: ['Hauts-de-France', 'Normandie'],
    specialties: ['Respiratoire', 'Diagnostic', 'Soins'],
    capacity: 'Haute',
    responseRate: '86%',
    avgDelay: '4j',
    orders: 134,
    activeRentals: 9,
    joinDate: 'mai 2022',
    status: 'Disponible',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    contact: { name: 'Isabelle Morin', phone: '03 20 XX XX XX', email: 'i.morin@nordmedical.fr' },
    certifications: ['ISO 9001', 'NF EN 62353'],
    cities: 6,
    featured: false,
  },
]

const allSpecialties = [...new Set(suppliers.flatMap(s => s.specialties))]
const allRegions = [...new Set(suppliers.flatMap(s => s.regions))]

function SupplierCard({ s, onContact }) {
  const [showContact, setShowContact] = useState(false)

  return (
    <div className={`bg-white rounded-2xl shadow-card border transition-all duration-200 hover:shadow-card-hover ${s.featured ? 'border-brand-200' : 'border-surface-100'}`}>
      {s.featured && (
        <div className="bg-gradient-to-r from-brand-600 to-violet-600 px-5 py-1.5 rounded-t-2xl flex items-center gap-2">
          <Award className="w-3 h-3 text-white" strokeWidth={2.5} />
          <span className="text-[11px] font-bold text-white">Adhérent vedette</span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
            {s.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-bold text-gray-900">{s.name}</h3>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${s.tierColor}`}>
                {s.tierIcon} {s.tier}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{s.regions.join(' · ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded-lg shrink-0">
            <Star className="w-3 h-3" fill="currentColor" />
            {s.score}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Commandes', value: s.orders, icon: Package },
            { label: 'Taux réponse', value: s.responseRate, icon: CheckCircle2 },
            { label: 'Délai moy.', value: s.avgDelay, icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-surface-50 rounded-xl p-3 text-center">
              <p className="text-base font-bold text-gray-900 tabular-nums">{value}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {s.specialties.map((sp) => (
            <span key={sp} className="text-[11px] text-gray-600 bg-surface-100 px-2 py-0.5 rounded-md font-medium">
              {sp}
            </span>
          ))}
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {s.certifications.map((c) => (
            <span key={c} className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full font-medium">
              <Shield className="w-2.5 h-2.5" strokeWidth={2.5} />
              {c}
            </span>
          ))}
        </div>

        {/* Status + contact */}
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${s.statusColor}`}>
            {s.status}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowContact(!showContact)}
              className="text-xs font-semibold text-gray-600 hover:text-gray-800 border border-surface-200 px-3 py-1.5 rounded-lg hover:bg-surface-50 transition-colors"
            >
              Contact
            </button>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-lg transition-colors">
              <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
              Solliciter
            </button>
          </div>
        </div>

        {showContact && (
          <div className="mt-4 pt-4 border-t border-surface-100 space-y-2 animate-fade-in">
            <p className="text-xs font-semibold text-gray-700">{s.contact.name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Phone className="w-3 h-3" /> {s.contact.phone}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Mail className="w-3 h-3" /> {s.contact.email}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SupplierNetwork({ onNavigate }) {
  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedTier, setSelectedTier] = useState('all')

  const filtered = suppliers.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.specialties.some(sp => sp.toLowerCase().includes(search.toLowerCase()))
    const matchRegion = selectedRegion === 'all' || s.regions.includes(selectedRegion)
    const matchTier = selectedTier === 'all' ||
      (selectedTier === 'premium' && (s.tier === 'Premium' || s.tier === 'Premium Gold')) ||
      (selectedTier === 'partner' && s.tier === 'Partenaire')
    return matchSearch && matchRegion && matchTier
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Adhérents actifs',    value: suppliers.length,                                    icon: Users,       color: 'bg-brand-50 text-brand-600' },
          { label: 'Premium & Gold',      value: suppliers.filter(s => s.tier !== 'Partenaire').length, icon: Award,      color: 'bg-violet-50 text-violet-600' },
          { label: 'Régions couvertes',   value: allRegions.length,                                   icon: Globe,       color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Score qualité moyen', value: Math.round(suppliers.reduce((s, r) => s + r.score, 0) / suppliers.length), icon: Star, color: 'bg-amber-50 text-amber-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-card border border-surface-100">
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-4 h-4" strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search & filters */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un fournisseur ou une spécialité…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium shrink-0">Tier</span>
            {[['all', 'Tous'], ['premium', 'Premium'], ['partner', 'Partenaire']].map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setSelectedTier(val)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  selectedTier === val ? 'bg-brand-600 text-white' : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium shrink-0">Région</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="text-xs font-semibold bg-surface-100 text-gray-600 px-3 py-1.5 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="all">Toutes</option>
              {allRegions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <span className="text-xs text-gray-400">{filtered.length} résultat(s)</span>
        </div>
      </div>

      {/* Region coverage map placeholder */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-5 overflow-hidden relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Couverture géographique</h3>
          <span className="text-xs text-gray-400">{allRegions.length} régions couvertes</span>
        </div>
        {/* SVG France map simplified */}
        <div className="h-56 relative bg-gradient-to-br from-brand-50 to-surface-100 rounded-xl overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 380" className="w-full h-full" fill="none">
              <path d="M120 20 L200 10 L280 30 L320 80 L340 140 L380 180 L360 230 L320 280 L280 340 L200 370 L130 350 L80 300 L60 250 L20 200 L40 150 L80 100 Z" fill="#0e90e7" opacity="0.3" stroke="#0e90e7" strokeWidth="2"/>
              <path d="M230 80 L270 90 L290 130 L260 150 L220 140 L210 110 Z" fill="#8b5cf6" opacity="0.5"/>
              <path d="M160 200 L200 190 L230 210 L220 250 L180 260 L150 240 Z" fill="#10b981" opacity="0.5"/>
              <path d="M100 120 L140 110 L150 150 L120 170 L90 155 Z" fill="#f59e0b" opacity="0.5"/>
            </svg>
          </div>

          {/* City dots */}
          {[
            { x: '45%', y: '72%', label: 'Toulouse', active: true },
            { x: '56%', y: '75%', label: 'Montpellier', active: true },
            { x: '70%', y: '78%', label: 'Marseille', active: true },
            { x: '28%', y: '58%', label: 'Bordeaux', active: true },
            { x: '78%', y: '52%', label: 'Nice', active: true },
            { x: '52%', y: '38%', label: 'Lyon', active: true },
            { x: '38%', y: '20%', label: 'Paris', active: false },
            { x: '25%', y: '18%', label: 'Rennes', active: false },
          ].map(({ x, y, label, active }) => (
            <div key={label} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
              <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${active ? 'bg-brand-500' : 'bg-gray-300'}`} />
              <span className={`absolute left-4 top-0 text-[10px] font-semibold whitespace-nowrap ${active ? 'text-brand-700' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-500 inline-block" />Zones couvertes</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-300 inline-block" />Hors réseau</span>
        </div>
      </div>

      {/* Supplier grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <SupplierCard key={s.id} s={s} />
        ))}
      </div>
    </div>
  )
}
