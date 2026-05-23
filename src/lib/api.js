// =============================================================
// API CLIENT
// En mode démo (VITE_USE_MOCK=true ou pas d'API URL) :
//   → utilise mockApi.js, aucun serveur nécessaire
// En production :
//   → appelle le vrai backend Express via VITE_API_URL
// =============================================================
import {
  mockAuth, mockDashboard, mockDemandes, mockDiffusions,
  mockDevis, mockLocations, mockAdherents,
} from './mockApi'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
  || !import.meta.env.VITE_API_URL
  || import.meta.env.VITE_API_URL === 'http://localhost:3001'
  || import.meta.env.VITE_API_URL.startsWith('${{') // unresolved Vercel template

// ── Helpers pour le mode réel ─────────────────────────────
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function getToken() { return localStorage.getItem('medico_token') }

async function http(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data = {}
  try { data = JSON.parse(text) } catch { /* non-JSON response */ }
  if (res.status === 401) {
    // Session expirée (on avait déjà un token) → déconnecter et recharger
    // Échec de login (pas de token) → lancer l'erreur normalement pour l'afficher
    if (token) {
      localStorage.removeItem('medico_token')
      localStorage.removeItem('medico_user')
      window.location.reload()
      return
    }
    throw new Error(data.error || 'Identifiants incorrects')
  }
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`)
  return data
}

// ── Helper pour récupérer l'utilisateur courant depuis localStorage ──
function currentUser() {
  try { return JSON.parse(localStorage.getItem('medico_user') || 'null') } catch { return null }
}

// =============================================================
// AUTH
// =============================================================
export const authApi = {
  login: (email, password) => USE_MOCK
    ? mockAuth.login(email, password)
    : http('POST', '/auth/login', { email, password }),

  me: () => USE_MOCK
    ? mockAuth.me(currentUser()?.id)
    : http('GET', '/auth/me'),

  logout: () => USE_MOCK
    ? Promise.resolve({ ok: true })
    : http('POST', '/auth/logout'),
}

// =============================================================
// DASHBOARD
// =============================================================
export const dashboardApi = {
  kpis: () => USE_MOCK
    ? mockDashboard.kpis(currentUser()?.role)
    : http('GET', '/dashboard'),

  activity: () => USE_MOCK
    ? mockDashboard.activity()
    : http('GET', '/dashboard/activity'),
}

// =============================================================
// DEMANDES
// =============================================================
export const demandesApi = {
  list: (params = {}) => {
    const user = currentUser()
    return USE_MOCK
      ? mockDemandes.list({ role: user?.role, org_id: user?.org_id, ...params })
      : http('GET', '/demandes?' + new URLSearchParams(params))
  },

  get: (id) => USE_MOCK
    ? mockDemandes.get(id)
    : http('GET', `/demandes/${id}`),

  create: (body) => {
    const user = currentUser()
    return USE_MOCK
      ? mockDemandes.create(body, user)
      : http('POST', '/demandes', body)
  },

  updateStatut: (id, statut) => USE_MOCK
    ? mockDemandes.updateStatut(id, statut)
    : http('PATCH', `/demandes/${id}/statut`, { statut }),
}

// =============================================================
// DIFFUSIONS
// =============================================================
export const diffusionsApi = {
  list: (demande_id) => USE_MOCK
    ? mockDiffusions.list(demande_id)
    : http('GET', `/diffusions?demande_id=${demande_id}`),

  match: (demande_id) => USE_MOCK
    ? mockDiffusions.match(demande_id)
    : http('POST', '/diffusions/match', { demande_id }),

  send: (demande_id, fournisseur_ids) => USE_MOCK
    ? mockDiffusions.send(demande_id, fournisseur_ids)
    : http('POST', '/diffusions', { demande_id, fournisseur_ids }),
}

// =============================================================
// DEVIS
// =============================================================
export const devisApi = {
  list: (demande_id) => {
    const user = currentUser()
    return USE_MOCK
      ? mockDevis.list({ demande_id, fournisseur_id: user?.role === 'fournisseur' ? user.org_id : undefined })
      : http('GET', `/devis?demande_id=${demande_id}`)
  },

  create: (body) => {
    const user = currentUser()
    return USE_MOCK
      ? mockDevis.create(body, user)
      : http('POST', '/devis', body)
  },

  accepter: (id) => USE_MOCK
    ? mockDevis.accepter(id)
    : http('PATCH', `/devis/${id}/accepter`),

  refuser: (id) => USE_MOCK
    ? mockDevis.refuser(id)
    : http('PATCH', `/devis/${id}/refuser`),
}

// =============================================================
// LOCATIONS
// =============================================================
export const locationsApi = {
  list: () => {
    const user = currentUser()
    return USE_MOCK
      ? mockLocations.list({ role: user?.role, org_id: user?.org_id })
      : http('GET', '/locations')
  },

  renouveler: (id, duree_mois) => USE_MOCK
    ? mockLocations.renouveler(id, duree_mois)
    : http('POST', `/locations/${id}/renouveler`, { duree_mois }),
}

// =============================================================
// ADHÉRENTS
// =============================================================
export const adherentsApi = {
  list: (params = {}) => USE_MOCK
    ? mockAdherents.list(params)
    : http('GET', '/adherents?' + new URLSearchParams(params)),

  get: (id) => USE_MOCK
    ? Promise.resolve({ data: null })
    : http('GET', `/adherents/${id}`),
}
