import { Search, Bell, Plus } from 'lucide-react'
import { useState } from 'react'

const pageTitles = {
  'dashboard':                 { title: 'Dashboard',              sub: 'Vue d\'ensemble de votre activité' },
  'new-request':               { title: 'Nouvelle demande',       sub: 'Créez et diffusez une demande d\'équipement' },
  'network-distribution':      { title: 'Diffusion réseau',       sub: 'Matching intelligent avec vos fournisseurs premium' },
  'supplier-quotes':           { title: 'Devis & Réponses',       sub: 'Comparez et sélectionnez les meilleures offres' },
  'rental-management':         { title: 'Gestion locations',      sub: 'Suivi des équipements en location' },
  'supplier-network':          { title: 'Réseau fournisseurs',    sub: 'Vos adhérents premium et leur couverture' },
  'demandes-etablissements':   { title: 'Demandes reçues',        sub: 'Demandes transmises par vos établissements membres' },
  'appels-offres':             { title: 'Appels d\'offres',       sub: 'Demandes reçues via Medicalliance' },
  'mes-devis':                 { title: 'Mes devis',              sub: 'Devis soumis et en attente de réponse' },
  'commandes':                 { title: 'Mes commandes',          sub: 'Commandes en cours et livrées' },
  'mes-demandes':              { title: 'Mes demandes',           sub: 'Demandes transmises à votre centrale' },
  'mes-commandes':             { title: 'Mes commandes',          sub: 'Suivi de vos commandes' },
  'mes-locations':             { title: 'Mes équipements',        sub: 'Équipements en location et en service' },
  'centrales':                 { title: 'Mes centrales',          sub: 'Centrales et groupements actifs sur le réseau' },
  'adherents':                 { title: 'Adhérents réseau',       sub: 'Gestion des adhérents Medicalliance' },
  'transactions':              { title: 'Transactions',           sub: 'Toutes les transactions de la plateforme' },
  'performance':               { title: 'Performance réseau',     sub: 'KPIs et indicateurs du réseau' },
  'catalogue':                 { title: 'Mon catalogue',          sub: 'Produits et références disponibles' },
  'locations':                 { title: 'Mes locations',          sub: 'Équipements loués en cours' },
}

const roleCta = {
  medicalliance: null,
  centrale:      { label: 'Nouvelle demande', page: 'new-request', color: 'bg-violet-600 hover:bg-violet-700' },
  fournisseur:   { label: 'Répondre à un AO', page: 'appels-offres', color: 'bg-emerald-600 hover:bg-emerald-700' },
  etablissement: { label: 'Nouvelle demande', page: 'new-request', color: 'bg-amber-500 hover:bg-amber-600' },
}

export default function Header({ currentPage, onNavigate, role }) {
  const [searchFocused, setSearchFocused] = useState(false)
  const { title, sub } = pageTitles[currentPage] || pageTitles['dashboard']
  const cta = roleCta[role]

  return (
    <header className="h-14 shrink-0 bg-white border-b border-surface-200 flex items-center px-8 gap-6">
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
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            {cta.label}
          </button>
        )}
      </div>
    </header>
  )
}
