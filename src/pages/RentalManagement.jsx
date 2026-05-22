import { useState } from 'react'
import {
  Package, Calendar, AlertTriangle, CheckCircle2, Clock,
  RefreshCcw, ChevronRight, MoreHorizontal, Filter,
  TrendingUp, Truck, Shield, Bell, ArrowUpRight, Wrench
} from 'lucide-react'

const rentals = [
  {
    id: 'LOC-0041',
    equipment: 'Lits médicalisés × 20',
    category: 'Lits',
    site: 'EHPAD Les Jardins — Toulouse',
    supplier: 'MediPro France',
    startDate: '15 mars 2024',
    endDate: '15 mars 2025',
    daysLeft: 298,
    totalDays: 365,
    monthlyRate: 4800,
    status: 'Actif',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    alert: null,
    icon: '🛏️',
    iconBg: 'bg-blue-50',
  },
  {
    id: 'LOC-0038',
    equipment: 'Fauteuils roulants × 8',
    category: 'Mobilité',
    site: 'Clinique Saint-Joseph — Lyon',
    supplier: 'SudMed Equipements',
    startDate: '1 fév. 2024',
    endDate: '1 fév. 2025',
    daysLeft: 255,
    totalDays: 365,
    monthlyRate: 1920,
    status: 'Actif',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    alert: null,
    icon: '♿',
    iconBg: 'bg-violet-50',
  },
  {
    id: 'LOC-0034',
    equipment: 'Matelas anti-escarre × 6',
    category: 'Prévention',
    site: 'EHPAD Bellevue — Nîmes',
    supplier: 'HealthCare Sud',
    startDate: '28 mai 2023',
    endDate: '28 mai 2024',
    daysLeft: 6,
    totalDays: 365,
    monthlyRate: 720,
    status: 'Expiration proche',
    statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
    alert: 'Renouvellement à valider avant le 28 mai',
    icon: '🩺',
    iconBg: 'bg-amber-50',
  },
  {
    id: 'LOC-0031',
    equipment: 'Lève-personnes × 3',
    category: 'Manutention',
    site: 'HAD Grenoble — Grenoble',
    supplier: 'Méditec PSDM',
    startDate: '10 avr. 2023',
    endDate: '10 avr. 2024',
    daysLeft: 0,
    totalDays: 365,
    monthlyRate: 540,
    status: 'Expiré',
    statusColor: 'text-red-700 bg-red-50 border-red-200',
    alert: 'Location expirée — renouvellement ou retour requis',
    icon: '🏗️',
    iconBg: 'bg-red-50',
  },
  {
    id: 'LOC-0028',
    equipment: 'Concentrateurs O₂ × 4',
    category: 'Respiratoire',
    site: 'HAD Sud-Ouest — Bordeaux',
    supplier: 'Atlantique Médical',
    startDate: '1 jan. 2024',
    endDate: '31 déc. 2024',
    daysLeft: 224,
    totalDays: 366,
    monthlyRate: 1160,
    status: 'Actif',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    alert: null,
    icon: '💨',
    iconBg: 'bg-emerald-50',
  },
]

function ProgressBar({ value, max, danger }) {
  const pct = Math.min((value / max) * 100, 100)
  const color = danger
    ? pct < 5 ? 'bg-red-500' : pct < 20 ? 'bg-amber-500' : 'bg-green-500'
    : 'bg-brand-500'
  return (
    <div className="w-full h-1.5 bg-surface-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

const tabs = ['Toutes', 'Actives', 'Alertes', 'Expirées']

export default function RentalManagement({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('Toutes')
  const [renewingId, setRenewingId] = useState(null)

  const filtered = rentals.filter(r => {
    if (activeTab === 'Actives')  return r.status === 'Actif'
    if (activeTab === 'Alertes')  return r.alert !== null
    if (activeTab === 'Expirées') return r.status === 'Expiré'
    return true
  })

  const alertCount  = rentals.filter(r => r.alert).length
  const activeCount = rentals.filter(r => r.status === 'Actif').length
  const totalMonthly = rentals.filter(r => r.status === 'Actif').reduce((s, r) => s + r.monthlyRate, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Alert banners */}
      {rentals.filter(r => r.alert).map(r => (
        <div key={r.id} className={`flex items-start gap-3 p-4 rounded-xl border ${
          r.status === 'Expiré' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${r.status === 'Expiré' ? 'text-red-500' : 'text-amber-500'}`} />
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${r.status === 'Expiré' ? 'text-red-800' : 'text-amber-800'}`}>
              {r.equipment} — {r.site}
            </p>
            <p className={`text-xs mt-0.5 ${r.status === 'Expiré' ? 'text-red-600' : 'text-amber-600'}`}>{r.alert}</p>
          </div>
          <button
            onClick={() => setRenewingId(r.id)}
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              r.status === 'Expiré' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            Renouveler
          </button>
        </div>
      ))}

      {/* Renew modal */}
      {renewingId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-modal border border-surface-100 p-8 max-w-md w-full animate-slide-up">
            <h3 className="text-base font-bold text-gray-900 mb-1">Renouveler la location</h3>
            <p className="text-sm text-gray-500 mb-6">
              {rentals.find(r => r.id === renewingId)?.equipment}
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Durée de renouvellement</label>
                <select className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
                  <option>6 mois</option>
                  <option>12 mois</option>
                  <option>24 mois</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Note</label>
                <textarea
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm resize-none focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="Informations complémentaires…"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setRenewingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-surface-200 text-sm font-semibold text-gray-600 hover:bg-surface-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setRenewingId(null)}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Locations actives',     value: activeCount,                                   unit: '',     icon: Package,   color: 'bg-green-50 text-green-600' },
          { label: 'Alertes en cours',      value: alertCount,                                    unit: '',     icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
          { label: 'Coût mensuel total',    value: totalMonthly.toLocaleString('fr-FR'),          unit: ' €',   icon: TrendingUp, color: 'bg-brand-50 text-brand-600' },
          { label: 'Interventions SAV',     value: 1,                                             unit: ' / mois', icon: Wrench,  color: 'bg-violet-50 text-violet-600' },
        ].map(({ label, value, unit, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-card border border-surface-100">
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-4 h-4" strokeWidth={2} />
            </div>
            <p className="text-xl font-bold text-gray-900 tabular-nums">{value}{unit}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tab filter */}
      <div className="flex items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === t ? 'bg-brand-600 text-white' : 'bg-white border border-surface-200 text-gray-600 hover:border-surface-300 shadow-xs'
            }`}
          >
            {t}
            {t === 'Alertes' && alertCount > 0 && (
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === t ? 'bg-white/20' : 'bg-amber-100 text-amber-700'}`}>
                {alertCount}
              </span>
            )}
          </button>
        ))}
        <span className="text-xs text-gray-400 ml-2">{filtered.length} contrat(s)</span>
      </div>

      {/* Rental list */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
        <div className="divide-y divide-surface-50">
          {filtered.map((r) => {
            const pct = Math.round((r.daysLeft / r.totalDays) * 100)
            return (
              <div key={r.id} className="group hover:bg-surface-50 transition-colors">
                <div className="flex items-center gap-5 px-6 py-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${r.iconBg} flex items-center justify-center text-xl shrink-0`}>
                    {r.icon}
                  </div>

                  {/* Main */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono text-gray-400">{r.id}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${r.statusColor}`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 truncate">{r.equipment}</p>
                    <p className="text-xs text-gray-400 truncate">{r.site}</p>
                  </div>

                  {/* Supplier */}
                  <div className="hidden md:block min-w-0 w-36">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Fournisseur</p>
                    <p className="text-xs font-semibold text-gray-700 truncate">{r.supplier}</p>
                  </div>

                  {/* Dates */}
                  <div className="hidden lg:block w-40">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Période</p>
                    <p className="text-xs text-gray-600">{r.startDate}</p>
                    <p className="text-xs text-gray-400">→ {r.endDate}</p>
                  </div>

                  {/* Progress */}
                  <div className="w-32 hidden xl:block">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Restant</p>
                      <p className={`text-[10px] font-bold ${r.daysLeft < 15 ? 'text-red-500' : r.daysLeft < 60 ? 'text-amber-500' : 'text-green-600'}`}>
                        {r.daysLeft}j
                      </p>
                    </div>
                    <ProgressBar value={r.daysLeft} max={r.totalDays} danger />
                  </div>

                  {/* Monthly rate */}
                  <div className="w-24 text-right">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Mensualité</p>
                    <p className="text-sm font-bold text-gray-900 tabular-nums">{r.monthlyRate.toLocaleString('fr-FR')} €</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {r.alert && (
                      <button
                        onClick={() => setRenewingId(r.id)}
                        className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        Renouveler
                      </button>
                    )}
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-200 transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
