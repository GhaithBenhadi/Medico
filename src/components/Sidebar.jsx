import {
  LayoutDashboard, Plus, Network, FileText,
  Package, MapPin, ChevronRight, Stethoscope,
  Bell, Settings, HelpCircle, Users,
} from 'lucide-react'

const navItems = [
  { id: 'dashboard',             label: 'Dashboard',            icon: LayoutDashboard, badge: null },
  { id: 'new-request',           label: 'Nouvelle demande',     icon: Plus,            badge: null },
  { id: 'network-distribution',  label: 'Diffusion réseau',     icon: Network,         badge: '3' },
  { id: 'supplier-quotes',       label: 'Devis & Réponses',     icon: FileText,        badge: '8' },
  { id: 'rental-management',     label: 'Gestion locations',    icon: Package,         badge: null },
  { id: 'supplier-network',      label: 'Réseau fournisseurs',  icon: MapPin,          badge: null },
]

const bottomItems = [
  { id: 'users',    label: 'Équipe',    icon: Users },
  { id: 'settings', label: 'Paramètres', icon: Settings },
  { id: 'help',     label: 'Aide',      icon: HelpCircle },
]

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-surface-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-surface-100">
        <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm">
          <Stethoscope className="w-4 h-4 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-900 tracking-tight">Medico</span>
          <span className="text-xs text-brand-600 font-medium ml-1">Pro</span>
        </div>
      </div>

      {/* Organisation pill */}
      <div className="px-3 pt-4">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-50 transition-colors group">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            G
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">Groupement Sud-Ouest</p>
            <p className="text-[11px] text-gray-400 truncate">Centrale d'achat</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto shrink-0 group-hover:text-gray-400 transition-colors" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-5 pb-2 overflow-y-auto scrollbar-thin">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
          Plateforme
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const active = currentPage === id
            return (
              <li key={id}>
                <button
                  onClick={() => onNavigate(id)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${active
                      ? 'bg-brand-50 text-brand-700 shadow-xs'
                      : 'text-gray-600 hover:bg-surface-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-600' : 'text-gray-400'}`} strokeWidth={active ? 2.2 : 1.8} />
                  <span className="flex-1 text-left">{label}</span>
                  {badge && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'}`}>
                      {badge}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Notifications preview */}
      <div className="px-3 pb-2">
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
          <div className="flex items-start gap-2">
            <Bell className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-800">2 alertes renouvellement</p>
              <p className="text-[11px] text-amber-600 mt-0.5">Locations expirant dans 7 jours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="border-t border-surface-100 px-3 py-3">
        <ul className="space-y-0.5">
          {bottomItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => onNavigate(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-surface-50 hover:text-gray-700 transition-colors"
              >
                <Icon className="w-4 h-4 text-gray-400" strokeWidth={1.8} />
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-2 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            SL
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">Sophie Lambert</p>
            <p className="text-[11px] text-gray-400 truncate">Responsable achats</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
