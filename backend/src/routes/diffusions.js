import { Router } from 'express'
import supabase from '../lib/supabase.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { sendEmail, tpl } from '../lib/email.js'

const router = Router()
router.use(requireAuth)

// GET /diffusions?demande_id=xxx — fournisseurs notifiés pour une demande
router.get('/', requireRole('centrale', 'medicalliance'), async (req, res) => {
  const { demande_id } = req.query
  if (!demande_id) return res.status(400).json({ error: 'demande_id requis' })

  const { data, error } = await supabase
    .from('diffusions')
    .select('*, fournisseur:organisations!fournisseur_id(id, name, city), adherents!inner(*)')
    .eq('demande_id', demande_id)
    .order('sent_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json({ data })
})

// POST /diffusions/match — calcule les fournisseurs matchés pour une demande
router.post('/match', requireRole('centrale', 'medicalliance'), async (req, res) => {
  const { demande_id } = req.body

  const { data: demande } = await supabase
    .from('demandes')
    .select('*, centrale:organisations!centrale_id(region)')
    .eq('id', demande_id)
    .single()

  if (!demande) return res.status(404).json({ error: 'Demande non trouvée' })

  // Cherche les adhérents disponibles ayant la bonne région ou spécialité
  const { data: adherents } = await supabase
    .from('adherents')
    .select('*, org:organisations!org_id(id, name, city, region)')
    .neq('status', 'indisponible')
    .order('score_qualite', { ascending: false })

  // Algorithme de matching simple basé sur région et score
  const matched = adherents
    .map(a => ({
      ...a,
      matched: a.regions.some(r =>
        demande.centrale?.region?.toLowerCase().includes(r.toLowerCase()) ||
        r.toLowerCase().includes('national')
      ),
      matchScore: a.score_qualite,
    }))
    .sort((a, b) => b.matchScore - a.matchScore)

  res.json({ data: matched })
})

// POST /diffusions — diffuse une demande à une liste de fournisseurs
router.post('/', requireRole('centrale', 'medicalliance'), async (req, res) => {
  const { demande_id, fournisseur_ids } = req.body
  if (!demande_id || !fournisseur_ids?.length) {
    return res.status(400).json({ error: 'demande_id et fournisseur_ids requis' })
  }

  // Crée les diffusions (ignore les doublons)
  const rows = fournisseur_ids.map(id => ({ demande_id, fournisseur_id: id }))
  const { data, error } = await supabase
    .from('diffusions')
    .upsert(rows, { onConflict: 'demande_id,fournisseur_id' })
    .select()

  if (error) return res.status(400).json({ error: error.message })

  // Met à jour le statut de la demande
  await supabase.from('demandes').update({ statut: 'diffusee', updated_at: new Date() }).eq('id', demande_id)

  // Envoie les emails aux fournisseurs
  const { data: demande } = await supabase.from('demandes').select('*').eq('id', demande_id).single()
  for (const fid of fournisseur_ids) {
    const { data: contacts } = await supabase.from('users').select('email').eq('org_id', fid)
    contacts?.forEach(c => {
      const { subject, html } = tpl.newDemande(demande, 'votre centrale')
      sendEmail({ to: c.email, subject, html })
    })
  }

  res.status(201).json({ data, count: data.length })
})

export default router
