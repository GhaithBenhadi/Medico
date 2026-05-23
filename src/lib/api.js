// Client HTTP centralisé
// Injecte automatiquement le token JWT dans chaque requête

const BASE_URL = import.meta.env.VITE_API_URL

function getToken() {
  return localStorage.getItem('medico_token')
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Token expiré → déconnexion
  if (res.status === 401) {
    localStorage.removeItem('medico_token')
    localStorage.removeItem('medico_user')
    window.location.href = '/login'
    return
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`)
  return data
}

export const api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  patch:  (path, body)   => request('PATCH',  path, body),
  delete: (path)         => request('DELETE', path),
}

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  login:   (email, password)    => api.post('/auth/login', { email, password }),
  logout:  ()                   => api.post('/auth/logout'),
  me:      ()                   => api.get('/auth/me'),
  refresh: (refresh_token)      => api.post('/auth/refresh', { refresh_token }),
}

// ── Dashboard ─────────────────────────────────────────────
export const dashboardApi = {
  kpis:     ()  => api.get('/dashboard'),
  activity: ()  => api.get('/dashboard/activity'),
}

// ── Demandes ──────────────────────────────────────────────
export const demandesApi = {
  list:          (params = {}) => api.get('/demandes?' + new URLSearchParams(params)),
  get:           (id)          => api.get(`/demandes/${id}`),
  create:        (body)        => api.post('/demandes', body),
  updateStatut:  (id, statut)  => api.patch(`/demandes/${id}/statut`, { statut }),
}

// ── Diffusions ────────────────────────────────────────────
export const diffusionsApi = {
  list:   (demande_id) => api.get(`/diffusions?demande_id=${demande_id}`),
  match:  (demande_id) => api.post('/diffusions/match', { demande_id }),
  send:   (demande_id, fournisseur_ids) => api.post('/diffusions', { demande_id, fournisseur_ids }),
}

// ── Devis ─────────────────────────────────────────────────
export const devisApi = {
  list:     (demande_id) => api.get(`/devis?demande_id=${demande_id}`),
  create:   (body)       => api.post('/devis', body),
  accepter: (id)         => api.patch(`/devis/${id}/accepter`),
  refuser:  (id)         => api.patch(`/devis/${id}/refuser`),
}

// ── Locations ─────────────────────────────────────────────
export const locationsApi = {
  list:      ()                     => api.get('/locations'),
  renouveler:(id, duree_mois)       => api.post(`/locations/${id}/renouveler`, { duree_mois }),
}

// ── Adhérents ─────────────────────────────────────────────
export const adherentsApi = {
  list: (params = {}) => api.get('/adherents?' + new URLSearchParams(params)),
  get:  (id)          => api.get(`/adherents/${id}`),
}
