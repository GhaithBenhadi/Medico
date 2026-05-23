// =============================================================
// MOCK API — simule tous les appels backend sans serveur
// Utilise les données de mockData.js avec état in-memory
// =============================================================
import {
  DEMO_USERS, ADHERENTS, DEMANDES, DIFFUSIONS, DEVIS, LOCATIONS, DASHBOARD_KPIS,
} from './mockData'

// État mutable en mémoire (réinitialisé au reload, parfait pour la démo)
let _demandes   = [...DEMANDES]
let _diffusions = [...DIFFUSIONS]
let _devis      = [...DEVIS]
let _locations  = [...LOCATIONS]
let _idSeq      = 1000

const uid = () => `mock-${++_idSeq}-${Math.random().toString(36).slice(2, 6)}`
const wait = (ms = 350) => new Promise(r => setTimeout(r, ms))

// ── AUTH ──────────────────────────────────────────────────
export const mockAuth = {
  async login(email, password) {
    await wait(600)
    const user = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) throw new Error('Email ou mot de passe incorrect')
    const { password: _, ...safeUser } = user
    const token = btoa(JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + 86400000 }))
    return { token, user: safeUser }
  },

  async me(userId) {
    await wait(200)
    const user = DEMO_USERS.find(u => u.id === userId)
    if (!user) throw new Error('Utilisateur non trouvé')
    const { password: _, ...safeUser } = user
    return { user: safeUser }
  },
}

// ── DASHBOARD ─────────────────────────────────────────────
export const mockDashboard = {
  async kpis(role) {
    await wait(300)
    return { kpis: DASHBOARD_KPIS[role] || {} }
  },

  async activity() {
    await wait(250)
    const items = [
      ..._devis.slice(0, 2).map(d => ({
        type: 'devis', id: d.id, label: `Nouveau devis ${d.ref}`,
        detail: `${d.fournisseur?.name} · ${d.total_ht?.toLocaleString('fr-FR')} € HT`,
        statut: d.statut, at: d.created_at,
      })),
      ..._demandes.slice(0, 3).map(d => ({
        type: 'demande', id: d.id, label: `Demande ${d.ref}`,
        detail: `${d.etablissement?.name} · ${d.categorie}`,
        statut: d.statut, at: d.created_at,
      })),
    ]
    return { data: items.sort((a, b) => new Date(b.at) - new Date(a.at)) }
  },
}

// ── DEMANDES ──────────────────────────────────────────────
export const mockDemandes = {
  async list({ role, org_id, statut } = {}) {
    await wait(400)
    let data = [..._demandes]
    if (role === 'etablissement') data = data.filter(d => d.etablissement_id === org_id)
    else if (role === 'centrale') data = data.filter(d => d.centrale_id === org_id)
    else if (role === 'fournisseur') {
      const myDemIds = _diffusions.filter(d => d.fournisseur_id === org_id).map(d => d.demande_id)
      data = data.filter(d => myDemIds.includes(d.id))
    }
    if (statut) data = data.filter(d => d.statut === statut)
    return { data }
  },

  async get(id) {
    await wait(250)
    const dem = _demandes.find(d => d.id === id)
    if (!dem) throw new Error('Demande non trouvée')
    const devis = _devis.filter(d => d.demande_id === id)
    const diffusions = _diffusions.filter(d => d.demande_id === id)
    return { data: { ...dem, devis, diffusions } }
  },

  async create(body, user) {
    await wait(500)
    const ref = `DEM-${2025 + _demandes.length}`
    const newDem = {
      id: uid(), ref,
      etablissement_id: user.role === 'etablissement' ? user.org_id : body.etablissement_id,
      centrale_id: user.role === 'centrale' ? user.org_id : body.centrale_id || 'org-02',
      ...body,
      statut: 'nouvelle',
      created_at: new Date().toISOString(),
      etablissement: { id: user.org_id, name: user.organisations?.name, city: '' },
      centrale: { id: 'org-02', name: 'Groupement Sud-Ouest' },
    }
    _demandes = [newDem, ..._demandes]
    return { data: newDem }
  },

  async updateStatut(id, statut) {
    await wait(300)
    _demandes = _demandes.map(d => d.id === id ? { ...d, statut } : d)
    return { data: _demandes.find(d => d.id === id) }
  },
}

// ── DIFFUSIONS ────────────────────────────────────────────
export const mockDiffusions = {
  async list(demande_id) {
    await wait(300)
    return { data: _diffusions.filter(d => d.demande_id === demande_id) }
  },

  async match(demande_id) {
    await wait(400)
    const dem = _demandes.find(d => d.id === demande_id)
    return {
      data: ADHERENTS.map(a => ({
        ...a,
        matched: a.regions.some(r => ['Occitanie','PACA','National'].includes(r)),
        notified: _diffusions.some(d => d.demande_id === demande_id && d.fournisseur_id === a.org_id),
      })).sort((a, b) => b.score_qualite - a.score_qualite),
    }
  },

  async send(demande_id, fournisseur_ids) {
    await wait(600)
    const newDiffs = fournisseur_ids
      .filter(fid => !_diffusions.some(d => d.demande_id === demande_id && d.fournisseur_id === fid))
      .map(fid => ({
        id: uid(), demande_id, fournisseur_id: fid,
        statut: 'envoyee', sent_at: new Date().toISOString(),
        fournisseur: ADHERENTS.find(a => a.org_id === fid)?.org,
      }))
    _diffusions = [..._diffusions, ...newDiffs]
    _demandes = _demandes.map(d => d.id === demande_id ? { ...d, statut: 'diffusee' } : d)
    return { data: newDiffs, count: newDiffs.length }
  },
}

// ── DEVIS ─────────────────────────────────────────────────
export const mockDevis = {
  async list({ demande_id, fournisseur_id } = {}) {
    await wait(350)
    let data = [..._devis]
    if (demande_id)    data = data.filter(d => d.demande_id === demande_id)
    if (fournisseur_id) data = data.filter(d => d.fournisseur_id === fournisseur_id)
    return { data }
  },

  async create(body, user) {
    await wait(500)
    const ref = `DEV-${880 + _devis.length}`
    const newDevis = {
      id: uid(), ref,
      fournisseur_id: user.org_id,
      ...body,
      statut: 'en_attente',
      created_at: new Date().toISOString(),
      fournisseur: { id: user.org_id, name: user.organisations?.name },
    }
    _devis = [newDevis, ..._devis]
    _demandes = _demandes.map(d =>
      d.id === body.demande_id ? { ...d, statut: 'devis_recus' } : d
    )
    return { data: newDevis }
  },

  async accepter(id) {
    await wait(500)
    _devis = _devis.map(d => {
      if (d.id === id) return { ...d, statut: 'accepte' }
      const target = _devis.find(x => x.id === id)
      if (target && d.demande_id === target.demande_id) return { ...d, statut: 'refuse' }
      return d
    })
    const accepted = _devis.find(d => d.id === id)
    _demandes = _demandes.map(d =>
      d.id === accepted?.demande_id ? { ...d, statut: 'commandee' } : d
    )
    return { data: accepted }
  },

  async refuser(id) {
    await wait(300)
    _devis = _devis.map(d => d.id === id ? { ...d, statut: 'refuse' } : d)
    return { data: _devis.find(d => d.id === id) }
  },
}

// ── LOCATIONS ─────────────────────────────────────────────
export const mockLocations = {
  async list({ role, org_id } = {}) {
    await wait(350)
    let data = [..._locations]
    if (role === 'etablissement') data = data.filter(l => l.etablissement_id === org_id)
    if (role === 'fournisseur')   data = data.filter(l => l.fournisseur_id === org_id)
    return { data }
  },

  async renouveler(id, duree_mois = 12) {
    await wait(400)
    _locations = _locations.map(l => {
      if (l.id !== id) return l
      const newEnd = new Date(l.date_fin)
      newEnd.setMonth(newEnd.getMonth() + Number(duree_mois))
      return {
        ...l,
        date_fin: newEnd.toISOString().split('T')[0],
        days_left: Math.ceil((newEnd - new Date()) / 86400000),
        statut: 'renouvele',
      }
    })
    return { data: _locations.find(l => l.id === id) }
  },
}

// ── ADHÉRENTS ─────────────────────────────────────────────
export const mockAdherents = {
  async list({ region, tier, search } = {}) {
    await wait(400)
    let data = [...ADHERENTS]
    if (tier)   data = data.filter(a => a.tier === tier)
    if (region) data = data.filter(a => a.regions.includes(region))
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(a =>
        a.org?.name?.toLowerCase().includes(q) ||
        a.specialites?.some(s => s.toLowerCase().includes(q))
      )
    }
    return { data }
  },
}
