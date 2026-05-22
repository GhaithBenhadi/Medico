import { Router } from 'express'
import supabase from '../lib/supabase.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { sendEmail, tpl } from '../lib/email.js'

const router = Router()
router.use(requireAuth)

// GET /devis?demande_id=xxx
router.get('/', async (req, res) => {
  const { demande_id } = req.query

  let query = supabase
    .from('devis')
    .select('*, fournisseur:organisations!fournisseur_id(id, name, city)')
    .order('created_at', { ascending: false })

  if (demande_id) query = query.eq('demande_id', demande_id)
  if (req.user.role === 'fournisseur') query = query.eq('fournisseur_id', req.user.org_id)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json({ data })
})

// POST /devis — fournisseur soumet un devis
router.post('/', requireRole('fournisseur'), async (req, res) => {
  const payload = {
    ...req.body,
    fournisseur_id: req.user.org_id,
    statut: 'en_attente',
  }

  const { data, error } = await supabase
    .from('devis')
    .insert(payload)
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })

  // Met à jour le statut de la demande
  await supabase.from('demandes')
    .update({ statut: 'devis_recus', updated_at: new Date() })
    .eq('id', data.demande_id)

  // Notifie la centrale
  const { data: dem } = await supabase.from('demandes').select('centrale_id').eq('id', data.demande_id).single()
  const { data: centraleUsers } = await supabase.from('users').select('email').eq('org_id', dem?.centrale_id)
  centraleUsers?.forEach(u => {
    const { subject, html } = tpl.newDevis(data, req.user.organisations?.name)
    sendEmail({ to: u.email, subject, html })
  })

  res.status(201).json({ data })
})

// PATCH /devis/:id/accepter — centrale accepte un devis
router.patch('/:id/accepter', requireRole('centrale', 'medicalliance'), async (req, res) => {
  const { id } = req.params

  // Récupère le devis
  const { data: devis } = await supabase.from('devis').select('*').eq('id', id).single()
  if (!devis) return res.status(404).json({ error: 'Devis non trouvé' })

  // Accepte ce devis, refuse les autres de la même demande
  await supabase.from('devis')
    .update({ statut: 'refuse' })
    .eq('demande_id', devis.demande_id)
    .neq('id', id)

  const { data, error } = await supabase
    .from('devis')
    .update({ statut: 'accepte' })
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })

  // Crée la commande
  const { data: demande } = await supabase.from('demandes').select('*').eq('id', devis.demande_id).single()
  const { data: commande } = await supabase
    .from('commandes')
    .insert({
      demande_id:       devis.demande_id,
      devis_id:         id,
      fournisseur_id:   devis.fournisseur_id,
      centrale_id:      demande.centrale_id,
      etablissement_id: demande.etablissement_id,
      statut:           'confirmee',
    })
    .select()
    .single()

  // Met à jour le statut de la demande
  await supabase.from('demandes').update({ statut: 'commandee', updated_at: new Date() }).eq('id', devis.demande_id)

  // Notifie le fournisseur
  const { data: contacts } = await supabase.from('users').select('email').eq('org_id', devis.fournisseur_id)
  const { data: centrale } = await supabase.from('organisations').select('name').eq('id', demande.centrale_id).single()
  contacts?.forEach(c => {
    const { subject, html } = tpl.devisAccepte(data, centrale?.name)
    sendEmail({ to: c.email, subject, html })
  })

  res.json({ data, commande })
})

// PATCH /devis/:id/refuser
router.patch('/:id/refuser', requireRole('centrale', 'medicalliance'), async (req, res) => {
  const { data, error } = await supabase
    .from('devis').update({ statut: 'refuse' }).eq('id', req.params.id).select().single()
  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

export default router
