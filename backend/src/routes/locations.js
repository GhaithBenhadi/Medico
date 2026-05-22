import { Router } from 'express'
import supabase from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /locations
router.get('/', async (req, res) => {
  let query = supabase
    .from('locations')
    .select('*, etablissement:organisations!etablissement_id(id, name, city), fournisseur:organisations!fournisseur_id(id, name)')
    .order('date_fin', { ascending: true })

  switch (req.user.role) {
    case 'etablissement': query = query.eq('etablissement_id', req.user.org_id);  break
    case 'fournisseur':   query = query.eq('fournisseur_id',   req.user.org_id);  break
    case 'centrale':
      // Voit les locations de ses établissements membres
      const { data: etabs } = await supabase.from('demandes')
        .select('etablissement_id').eq('centrale_id', req.user.org_id)
      const etabIds = [...new Set(etabs?.map(e => e.etablissement_id) || [])]
      query = query.in('etablissement_id', etabIds)
      break
    case 'medicalliance': break
  }

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })

  // Calcule jours restants
  const enriched = data.map(loc => {
    const fin       = new Date(loc.date_fin)
    const today     = new Date()
    const daysLeft  = Math.ceil((fin - today) / (1000 * 60 * 60 * 24))
    return { ...loc, days_left: Math.max(0, daysLeft) }
  })

  res.json({ data: enriched })
})

// POST /locations/:id/renouveler
router.post('/:id/renouveler', async (req, res) => {
  const { duree_mois = 12 } = req.body

  const { data: loc } = await supabase.from('locations').select('*').eq('id', req.params.id).single()
  if (!loc) return res.status(404).json({ error: 'Location non trouvée' })

  const newEnd = new Date(loc.date_fin)
  newEnd.setMonth(newEnd.getMonth() + Number(duree_mois))

  const { data, error } = await supabase
    .from('locations')
    .update({ date_fin: newEnd.toISOString().split('T')[0], statut: 'renouvele' })
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.json({ data })
})

export default router
