import { Search, Bell, Plus, Inbox } from 'lucide-react'
import { useState } from 'react'

const PAGE_TITLES = {
  dashboard:        { title: 'Dashboard',              sub: 'Vue d\'ensemble de votre activité' },
  demandes:         { title: 'Demandes',               sub: 'Toutes les demandes d\'équipements' },
  'demande-detail': { title: 'Détail demande',         sub: 'Informations complètes et suivi' },
  'new-demande':    { title: 'Nouvelle demande',       sub: 'Créez et diffusez une demande d\'équipement' },
  matching:         { title: 'Matching',               sub: 'Matching intelligent avec vos fournisseurs premium' },
  offres:           { title: 'Offres & Devis',         sub: 'Comparez et sélectionnez les meilleures offres' },
  commandes:        { title: 'Commandes',              sub: 'Suivi des commandes passées' },
  locations:        { title: 'Locations',              sub: 'Contrats de location en cours' },
  reseau:           { title: 'Réseau premium',         sub: 'Adhérents certifiés Medicalliance' },
  centrales:        { title: 'Centrales',              sub: 'Centrales d\'achat et groupements actifs' },
  etablissements:   { title: 'Établissements',         sub: 'Établissements de santé membres' },
  messagerie:       { title: 'Messagerie',             sub: 'Communications et échanges' },
  reporting:        { title: 'Reporting',              sub: 'Analyses et indicateurs de performance' },
  'appels-doffres': { title: 'Appels d\'offres',       sub: 'Demandes diffusées correspondant à votre profil' },
}

const ROLE_CTA = {
  medicalliance: { label: 'Nouvelle demande', page: 'new-demande', icon: Plus,  color: 'bg-brand-600 hover:bg-brand-700' },
  centrale:      { label: 'Nouvelle demande', page: 'new-demande', icon: Plus,  color: 'bg-violet-600 hover:bg-violet-700' },
  fournisseur:   { label: 'Appels d\'offres', page: 'appels-doffres', icon: Inbox, color: 'bg-emerald-600 hover:bg-emerald-700' },
  etablissement: { label: 'Nouvelle demande', page: 'new-demande', icon: Plus,  color: 'bg-amber-500 hover:bg-amber-600' },
}

export default function Header({ currentPage, onNavigate, user }) {
  const [searchFocused, setSearchFocused] = useState(false)
  const role = user?.role || 'medicalliance'
  const { title, sub } = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard
  const cta = ROLE_CTA[role]
  const CtaIcon = cta?.icon || Plus

  return (
    <header className="h-14 shrink-0 bg-white border-b border-surface-200 flex items-center px-6 gap-4">
      <div className="min-w-0">
        <h1 className="text-sm font-semibold text-gray-900 truncate">{title}</h1>
        <p className="text-xs text-gray-400 truncate hidden sm:block">{sub}</p>
      </div>

      <div className={`flex-1 max-w-sm relative transition-all duration-200 ${searchFocused ? 'max-w-md' : ''}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher…"
          className="w-full pl-9 pr-10 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100 transition-all"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 font-mono hidden sm:block">⌘K</kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="relative w-8 h-8 rounded-lg hover:bg-surface-50 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-gray-500" strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" />
        </button>

        {cta && (
          <button
            onClick={() => onNavigate(cta.page)}
            className={`flex items-center gap-1.5 ${cta.color} text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm`}
          >
            <CtaIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            {cta.label}
          </button>
        )}
      </div>
    </header>
  )
}
