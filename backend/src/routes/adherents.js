import { Router } from 'express'
import supabase from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /adherents?region=&specialite=&tier=&search=
router.get('/', async (req, res) => {
  const { region, specialite, tier, search } = req.query

  let query = supabase
    .from('adherents')
    .select('*, org:organisations!org_id(id, name, city, region, phone)')
    .order('score_qualite', { ascending: false })

  if (tier)       query = query.eq('tier', tier)
  if (region)     query = query.contains('regions', [region])
  if (specialite) query = query.contains('specialites', [specialite])

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })

  let result = data
  if (search) {
    const q = search.toLowerCase()
    result = data.filter(a =>
      a.org?.name?.toLowerCase().includes(q) ||
      a.specialites?.some(s => s.toLowerCase().includes(q))
    )
  }

  res.json({ data: result })
})

// GET /adherents/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('adherents')
    .select('*, org:organisations!org_id(*)')
    .eq('org_id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Adhérent non trouvé' })
  res.json({ data })
})

export default router
