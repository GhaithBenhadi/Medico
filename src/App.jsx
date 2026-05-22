import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import RoleSidebar from './components/RoleSidebar'
import Header from './components/Header'

// Medicalliance
import MedicallanceDashboard from './pages/medicalliance/Dashboard'
// Centrale
import CentraleDashboard from './pages/Dashboard'
import DemandesEtablissements from './pages/centrale/DemandesEtablissements'
import NewRequest from './pages/NewRequest'
import NetworkDistribution from './pages/NetworkDistribution'
import SupplierQuotes from './pages/SupplierQuotes'
import RentalManagement from './pages/RentalManagement'
import SupplierNetwork from './pages/SupplierNetwork'
// Fournisseur
import FournisseurDashboard from './pages/fournisseur/Dashboard'
// Etablissement
import EtablissementDashboard from './pages/etablissement/Dashboard'

const pagesByRole = {
  medicalliance: {
    dashboard:          MedicallanceDashboard,
    adherents:          SupplierNetwork,
    'supplier-network': SupplierNetwork,
    centrales:          CentraleDashboard,
    transactions:       SupplierQuotes,
    performance:        CentraleDashboard,
  },
  centrale: {
    dashboard:                 CentraleDashboard,
    'demandes-etablissements': DemandesEtablissements,
    'new-request':             NewRequest,
    'network-distribution':    NetworkDistribution,
    'supplier-quotes':         SupplierQuotes,
    'rental-management':       RentalManagement,
    'supplier-network':        SupplierNetwork,
  },
  fournisseur: {
    dashboard:       FournisseurDashboard,
    'appels-offres': FournisseurDashboard,
    'mes-devis':     SupplierQuotes,
    commandes:       RentalManagement,
    locations:       RentalManagement,
    catalogue:       SupplierNetwork,
  },
  etablissement: {
    dashboard:       EtablissementDashboard,
    'new-request':   NewRequest,
    'mes-demandes':  EtablissementDashboard,
    'mes-commandes': RentalManagement,
    'mes-locations': RentalManagement,
  },
}

function AppShell() {
  const { user, loading, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleLogin = (loggedUser) => {
    setCurrentPage('dashboard')
  }

  const handleLogout = async () => {
    await logout()
    setCurrentPage('dashboard')
  }

  // Spinner pendant la vérification du token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <span className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    )
  }

  // Non connecté → page login
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const role  = user.role
  const pages = pagesByRole[role] || {}
  const PageComponent = pages[currentPage] || pages['dashboard']

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden w-full">
      <RoleSidebar
        role={role}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} role={role} />
        <main className="flex-1 overflow-y-auto scrollbar-thin px-8 py-6">
          {PageComponent && <PageComponent onNavigate={setCurrentPage} />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
