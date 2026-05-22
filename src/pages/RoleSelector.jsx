import { useState } from 'react'
import { Building2, Users, Package, LayoutGrid, ArrowRight, Stethoscope, Shield, Zap } from 'lucide-react'

const roles = [
  {
    id: 'medicalliance',
    label: 'Medicalliance',
    sub: 'Orchestrateur du réseau',
    description: 'Supervision globale, gestion des centrales et des adhérents, KPIs plateforme.',
    icon: LayoutGrid,
    gradient: 'from-brand-600 to-blue-700',
    bg: 'bg-brand-50',
    border: 'border-brand-200',
    ring: 'ring-brand-400',
    accent: 'text-brand-600',
    tag: 'Admin réseau',
    tagColor: 'bg-brand-100 text-brand-700',
  },
  {
    id: 'centrale',
    label: 'Centrale / Groupement',
    sub: 'Acheteur central',
    description: 'Reçoit les demandes des établissements, diffuse aux adhérents Medicalliance, valide les commandes.',
    icon: Building2,
    gradient: 'from-violet-600 to-purple-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    ring: 'ring-violet-400',
    accent: 'text-violet-600',
    tag: 'Groupement',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'fournisseur',
    label: 'Adhérent Medicalliance',
    sub: 'Fournisseur premium',
    description: 'Reçoit les appels d\'offres, soumet des devis, gère les commandes et livraisons.',
    icon: Package,
    gradient: 'from-emerald-600 to-green-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    ring: 'ring-emerald-400',
    accent: 'text-emerald-600',
    tag: 'Adhérent premium',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'etablissement',
    label: 'Établissement de santé',
    sub: 'Utilisateur final',
    description: 'Passe des demandes d\'équipements via sa centrale, suit ses commandes et locations.',
    icon: Stethoscope,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    ring: 'ring-amber-400',
    accent: 'text-amber-600',
    tag: 'EHPAD / Hôpital',
    tagColor: 'bg-amber-100 text-amber-700',
  },
]

const personas = {
  medicalliance: { name: 'Karim Mansouri', title: 'Directeur Réseau', org: 'Medicalliance', initials: 'KM', from: 'from-brand-500 to-blue-600' },
  centrale:      { name: 'Sophie Lambert', title: 'Responsable achats', org: 'Groupement Sud-Ouest', initials: 'SL', from: 'from-violet-500 to-purple-600' },
  fournisseur:   { name: 'Pierre Martin',  title: 'Directeur commercial', org: 'MediPro France', initials: 'PM', from: 'from-emerald-500 to-green-600' },
  etablissement: { name: 'Isabelle Morin', title: 'Directrice des soins', org: 'EHPAD Les Jardins — Toulouse', initials: 'IM', from: 'from-amber-500 to-orange-500' },
}

export default function RoleSelector({ onSelectRole }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-8">
      {/* Logo header */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg">
          <Stethoscope className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Medico</span>
          <span className="text-base text-brand-600 font-semibold ml-1.5">Pro</span>
        </div>
      </div>

      <div className="text-center mb-10 max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre espace</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Medico Pro connecte 4 acteurs autour d'une plateforme commune.
          Chaque espace est adapté à votre rôle et vos responsabilités.
        </p>
      </div>

      {/* Flow diagram */}
      <div className="flex items-center gap-2 mb-10 flex-wrap justify-center">
        {[
          { label: 'Établissement', color: 'bg-amber-500' },
          { label: '→', color: '' },
          { label: 'Centrale', color: 'bg-violet-500' },
          { label: '→', color: '' },
          { label: 'Adhérents', color: 'bg-emerald-500' },
        ].map(({ label, color }, i) => (
          color ? (
            <span key={i} className="flex items-center gap-2 text-xs font-semibold text-white px-3 py-1.5 rounded-full shadow-sm" style={{ background: '' }}>
              <span className={`${color} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm`}>{label}</span>
            </span>
          ) : (
            <span key={i} className="text-gray-400 font-bold text-lg">→</span>
          )
        ))}
        <span className="text-gray-400 font-bold text-lg">·</span>
        <span className="bg-brand-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
          <Shield className="w-3 h-3" />Medicalliance supervise tout
        </span>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
        {roles.map((role) => {
          const Icon = role.icon
          const persona = personas[role.id]
          const isHovered = hovered === role.id
          return (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              onMouseEnter={() => setHovered(role.id)}
              onMouseLeave={() => setHovered(null)}
              className={`
                group relative text-left bg-white rounded-2xl border-2 p-6 transition-all duration-200
                hover:shadow-card-hover hover:-translate-y-0.5
                ${isHovered ? `${role.border} ring-2 ${role.ring} ring-opacity-30` : 'border-surface-100 shadow-card'}
              `}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4 shadow-sm`}>
                <Icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>

              {/* Labels */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight">{role.label}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${role.tagColor}`}>
                  {role.tag}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-3">{role.sub}</p>
              <p className="text-xs text-gray-600 leading-relaxed mb-5">{role.description}</p>

              {/* Persona preview */}
              <div className="flex items-center gap-2.5 pt-4 border-t border-surface-100">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${persona.from} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                  {persona.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{persona.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{persona.org}</p>
                </div>
                <ArrowRight className={`w-4 h-4 ml-auto shrink-0 transition-all ${isHovered ? `${role.accent} translate-x-1` : 'text-gray-300'}`} />
              </div>
            </button>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 mt-8">Prototype interactif — Medico Pro · 2026</p>
    </div>
  )
}
