import { Router } from 'express'
import supabase from '../lib/supabase.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { sendEmail, tpl } from '../lib/email.js'

const router = Router()
router.use(requireAuth)

// Filtre les demandes selon le rôle de l'utilisateur
function scopeQuery(query, user) {
  switch (user.role) {
    case 'etablissement':
      return query.eq('etablissement_id', user.org_id)
    case 'centrale':
      return query.eq('centrale_id', user.org_id)
    case 'fournisseur':
      // Le fournisseur voit les demandes où il a une diffusion
      return query.in('id',
        supabase.from('diffusions').select('demande_id').eq('fournisseur_id', user.org_id)
      )
    case 'medicalliance':
      return query // tout voir
    default:
      return query.eq('id', 'impossible')
  }
}

// GET /demandes
router.get('/', async (req, res) => {
  const { statut, limit = 50, offset = 0 } = req.query

  let query = supabase
    .from('demandes')
    .select(`
      *,
      etablissement:organisations!etablissement_id(id, name, city),
      centrale:organisations!centrale_id(id, name),
      devis(count),
      diffusions(count)
    `)
    .order('created_at', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1)

  query = scopeQuery(query, req.user)
  if (statut) query = query.eq('statut', statut)

  const { data, error, count } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json({ data, count })
})

// GET /demandes/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('demandes')
    .select(`
      *,
      etablissement:organisations!etablissement_id(id, name, city, phone),
      centrale:organisations!centrale_id(id, name),
      devis(*, fournisseur:organisations!fournisseur_id(id, name)),
      diffusions(*, fournisseur:organisations!fournisseur_id(id, name))
    `)
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Demande non trouvée' })
  res.json({ data })
})

// POST /demandes
router.post('/', requireRole('etablissement', 'centrale'), async (req, res) => {
  const user = req.user
  const payload = {
    ...req.body,
    etablissement_id: user.role === 'etablissement' ? user.org_id : req.body.etablissement_id,
    centrale_id:      user.role === 'centrale'      ? user.org_id : req.body.centrale_id,
    created_by:       user.id,
    statut:           'nouvelle',
  }

  const { data, error } = await supabase
    .from('demandes')
    .insert(payload)
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })

  // Notifie la centrale si c'est un établissement qui crée
  if (user.role === 'etablissement') {
    const { data: centraleUsers } = await supabase
      .from('users')
      .select('email')
      .eq('org_id', data.centrale_id)
      .eq('role', 'centrale')

    centraleUsers?.forEach(u => {
      const { subject, html } = tpl.newDemande(data, req.user.organisations?.name)
      sendEmail({ to: u.email, subject, html })
    })
  }

  res.status(201).json({ data })
})

// PATCH /demandes/:id/statut
router.patch('/:id/statut', requireRole('centrale', 'medicalliance'), async (req, res) => {
  const { statut } = req.body
  const validStatuts = ['nouvelle','diffusee','devis_recus','commandee','livree','annulee']
  if (!validStatuts.includes(statut)) {
    return res.status(400).json({ error: 'Statut invalide' })
  }

  const { data, error } = await supabase
    .from('demandes')
    .update({ statut, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

export default router
