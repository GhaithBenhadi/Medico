import { ChevronRight, Stethoscope, Bell } from 'lucide-react'

const roleConfig = {
  medicalliance: {
    accentBg:   'bg-brand-600',
    accentText: 'text-brand-600',
    activeBg:   'bg-brand-50',
    orgGradient: 'from-brand-500 to-blue-600',
    orgLabel:    'Orchestrateur réseau',
    orgName:     'Medicalliance',
    userName:    'Karim Mansouri',
    userTitle:   'Directeur Réseau',
    userInitials:'KM',
    userGradient:'from-brand-500 to-blue-600',
    alertText:   '3 centrales en attente',
    alertSub:    'Validation d\'adhésion requise',
    alertColor:  'border-brand-100 bg-brand-50',
    alertIcon:   'text-brand-600',
    alertText2:  'text-brand-800',
    alertSub2:   'text-brand-600',
    orgInitial:  'M',
  },
  centrale: {
    accentBg:    'bg-violet-600',
    accentText:  'text-violet-600',
    activeBg:    'bg-violet-50',
    orgGradient: 'from-violet-500 to-purple-600',
    orgLabel:    'Centrale d\'achat',
    orgName:     'Groupement Sud-Ouest',
    userName:    'Sophie Lambert',
    userTitle:   'Responsable achats',
    userInitials:'SL',
    userGradient:'from-violet-400 to-purple-600',
    alertText:   '2 alertes renouvellement',
    alertSub:    'Locations expirant dans 7 jours',
    alertColor:  'border-amber-100 bg-amber-50',
    alertIcon:   'text-amber-600',
    alertText2:  'text-amber-800',
    alertSub2:   'text-amber-600',
    orgInitial:  'G',
  },
  fournisseur: {
    accentBg:    'bg-emerald-600',
    accentText:  'text-emerald-600',
    activeBg:    'bg-emerald-50',
    orgGradient: 'from-emerald-500 to-green-600',
    orgLabel:    'Adhérent Premium',
    orgName:     'MediPro France',
    userName:    'Pierre Martin',
    userTitle:   'Directeur commercial',
    userInitials:'PM',
    userGradient:'from-emerald-400 to-green-600',
    alertText:   '4 appels d\'offres reçus',
    alertSub:    'Délai de réponse : 48h',
    alertColor:  'border-emerald-100 bg-emerald-50',
    alertIcon:   'text-emerald-600',
    alertText2:  'text-emerald-800',
    alertSub2:   'text-emerald-600',
    orgInitial:  'M',
  },
  etablissement: {
    accentBg:    'bg-amber-600',
    accentText:  'text-amber-600',
    activeBg:    'bg-amber-50',
    orgGradient: 'from-amber-500 to-orange-500',
    orgLabel:    'Établissement de santé',
    orgName:     'EHPAD Les Jardins',
    userName:    'Isabelle Morin',
    userTitle:   'Directrice des soins',
    userInitials:'IM',
    userGradient:'from-amber-400 to-orange-500',
    alertText:   '1 commande en livraison',
    alertSub:    'Livraison prévue demain',
    alertColor:  'border-amber-100 bg-amber-50',
    alertIcon:   'text-amber-600',
    alertText2:  'text-amber-800',
    alertSub2:   'text-amber-600',
    orgInitial:  'E',
  },
}

const navByRole = {
  medicalliance: [
    { id: 'dashboard',    label: 'Vue globale',        icon: 'LayoutDashboard', badge: null },
    { id: 'centrales',    label: 'Mes centrales',      icon: 'Building2',       badge: '12' },
    { id: 'adherents',    label: 'Adhérents réseau',   icon: 'Users',           badge: null },
    { id: 'transactions', label: 'Toutes transactions', icon: 'ArrowLeftRight',  badge: null },
    { id: 'performance',  label: 'Performance réseau', icon: 'TrendingUp',      badge: null },
    { id: 'supplier-network', label: 'Cartographie',   icon: 'MapPin',          badge: null },
  ],
  centrale: [
    { id: 'dashboard',             label: 'Dashboard',          icon: 'LayoutDashboard', badge: null },
    { id: 'demandes-etablissements', label: 'Demandes reçues',  icon: 'Inbox',           badge: '5' },
    { id: 'network-distribution',  label: 'Diffusion réseau',   icon: 'Network',         badge: '3' },
    { id: 'supplier-quotes',       label: 'Devis & Réponses',   icon: 'FileText',        badge: '8' },
    { id: 'rental-management',     label: 'Gestion locations',  icon: 'Package',         badge: null },
    { id: 'supplier-network',      label: 'Réseau fournisseurs', icon: 'MapPin',         badge: null },
  ],
  fournisseur: [
    { id: 'dashboard',      label: 'Mon tableau de bord', icon: 'LayoutDashboard', badge: null },
    { id: 'appels-offres',  label: 'Appels d\'offres',    icon: 'Bell',            badge: '4' },
    { id: 'mes-devis',      label: 'Mes devis',           icon: 'FileText',        badge: '2' },
    { id: 'commandes',      label: 'Mes commandes',       icon: 'ShoppingCart',    badge: null },
    { id: 'locations',      label: 'Mes locations',       icon: 'Package',         badge: null },
    { id: 'catalogue',      label: 'Mon catalogue',       icon: 'Grid',            badge: null },
  ],
  etablissement: [
    { id: 'dashboard',      label: 'Mon espace',          icon: 'LayoutDashboard', badge: null },
    { id: 'new-request',    label: 'Nouvelle demande',    icon: 'Plus',            badge: null },
    { id: 'mes-demandes',   label: 'Mes demandes',        icon: 'FileText',        badge: '3' },
    { id: 'mes-commandes',  label: 'Mes commandes',       icon: 'ShoppingCart',    badge: null },
    { id: 'mes-locations',  label: 'Mes équipements',     icon: 'Package',         badge: null },
  ],
}

import {
  LayoutDashboard, Building2, Users, TrendingUp, MapPin, Network,
  FileText, Package, Inbox, ShoppingCart, Plus, Grid,
  Settings, HelpCircle, LogOut, ArrowLeftRight,
} from 'lucide-react'

const iconMap = {
  LayoutDashboard, Building2, Users, TrendingUp, MapPin, Network,
  FileText, Package, Inbox, Bell, ShoppingCart, Plus, Grid, ArrowLeftRight,
}

export default function RoleSidebar({ role, currentPage, onNavigate, onLogout }) {
  const cfg = roleConfig[role]
  const nav = navByRole[role] || []

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-surface-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-surface-100">
        <div className={`w-7 h-7 rounded-lg ${cfg.accentBg} flex items-center justify-center shadow-sm`}>
          <Stethoscope className="w-4 h-4 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-900 tracking-tight">Medico</span>
          <span className={`text-xs ${cfg.accentText} font-medium ml-1`}>Pro</span>
        </div>
      </div>

      {/* Org pill */}
      <div className="px-3 pt-4">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-50 transition-colors group">
          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${cfg.orgGradient} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
            {cfg.orgInitial}
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{cfg.orgName}</p>
            <p className="text-[11px] text-gray-400 truncate">{cfg.orgLabel}</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto shrink-0 group-hover:text-gray-400 transition-colors" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-5 pb-2 overflow-y-auto scrollbar-thin">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
        <ul className="space-y-0.5">
          {nav.map(({ id, label, icon, badge }) => {
            const Icon = iconMap[icon] || LayoutDashboard
            const active = currentPage === id
            return (
              <li key={id}>
                <button
                  onClick={() => onNavigate(id)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${active ? `${cfg.activeBg} ${cfg.accentText}` : 'text-gray-600 hover:bg-surface-50 hover:text-gray-900'}
                  `}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${active ? cfg.accentText : 'text-gray-400'}`}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  <span className="flex-1 text-left">{label}</span>
                  {badge && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? `bg-white/60 ${cfg.accentText}` : 'bg-gray-100 text-gray-500'}`}>
                      {badge}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Alert pill */}
      <div className="px-3 pb-2">
        <div className={`rounded-xl border p-3 ${cfg.alertColor}`}>
          <div className="flex items-start gap-2">
            <Bell className={`w-3.5 h-3.5 ${cfg.alertIcon} mt-0.5 shrink-0`} />
            <div>
              <p className={`text-xs font-semibold ${cfg.alertText2}`}>{cfg.alertText}</p>
              <p className={`text-[11px] ${cfg.alertSub2} mt-0.5`}>{cfg.alertSub}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-surface-100 px-3 py-3">
        <ul className="space-y-0.5 mb-2">
          {[
            { icon: Settings,  label: 'Paramètres' },
            { icon: HelpCircle,label: 'Aide' },
          ].map(({ icon: Icon, label }) => (
            <li key={label}>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-surface-50 hover:text-gray-700 transition-colors">
                <Icon className="w-4 h-4 text-gray-400" strokeWidth={1.8} />
                {label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.8} />
              Changer d'espace
            </button>
          </li>
        </ul>

        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors">
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${cfg.userGradient} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
            {cfg.userInitials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{cfg.userName}</p>
            <p className="text-[11px] text-gray-400 truncate">{cfg.userTitle}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
