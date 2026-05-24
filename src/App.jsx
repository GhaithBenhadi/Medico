import { useState } from 'react'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

// Shared pages
import Demandes from './pages/Demandes'
import DemandeDetail from './pages/DemandeDetail'
import NewDemande from './pages/NewDemande'
import Offres from './pages/Offres'
import Commandes from './pages/Commandes'
import Locations from './pages/Locations'
import Messagerie from './pages/Messagerie'
import Reporting from './pages/Reporting'

// Medicalliance-only
import Dashboard from './pages/Dashboard'
import Matching from './pages/Matching'
import Reseau from './pages/Reseau'
import Centrales from './pages/Centrales'
import Etablissements from './pages/Etablissements'

// Role-specific dashboards
import DashboardCentrale from './pages/DashboardCentrale'
import DashboardFournisseur from './pages/DashboardFournisseur'
import DashboardEtablissement from './pages/DashboardEtablissement'

// Fournisseur-specific
import AppelsDOffres from './pages/AppelsDOffres'

const PAGES_BY_ROLE = {
  medicalliance: {
    dashboard: Dashboard,
    demandes: Demandes,
    'demande-detail': DemandeDetail,
    'new-demande': NewDemande,
    matching: Matching,
    offres: Offres,
    commandes: Commandes,
    locations: Locations,
    reseau: Reseau,
    centrales: Centrales,
    etablissements: Etablissements,
    messagerie: Messagerie,
    reporting: Reporting,
  },
  centrale: {
    dashboard: DashboardCentrale,
    demandes: Demandes,
    'demande-detail': DemandeDetail,
    'new-demande': NewDemande,
    commandes: Commandes,
    locations: Locations,
    messagerie: Messagerie,
    reporting: Reporting,
  },
  fournisseur: {
    dashboard: DashboardFournisseur,
    'appels-doffres': AppelsDOffres,
    offres: Offres,
    commandes: Commandes,
    locations: Locations,
    messagerie: Messagerie,
  },
  etablissement: {
    dashboard: DashboardEtablissement,
    'new-demande': NewDemande,
    demandes: Demandes,
    'demande-detail': DemandeDetail,
    commandes: Commandes,
    locations: Locations,
    messagerie: Messagerie,
  },
}

export default function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setPage] = useState('dashboard')
  const [pageParams, setParams] = useState({})

  const navigate = (page, params = {}) => { setPage(page); setParams(params) }

  if (!user) return <Login onLogin={(u) => { setUser(u); setPage('dashboard') }} />

  const pages = PAGES_BY_ROLE[user.role] || PAGES_BY_ROLE.medicalliance
  const PageComponent = pages[currentPage] || pages.dashboard

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden w-full">
      <Sidebar currentPage={currentPage} onNavigate={navigate} onLogout={() => { setUser(null); setPage('dashboard') }} user={user} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentPage={currentPage} onNavigate={navigate} user={user} />
        <main className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
          <PageComponent onNavigate={navigate} params={pageParams} user={user} />
        </main>
      </div>
    </div>
  )
}
