import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'
import supabase from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Client anon pour les opérations auth côté utilisateur
const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' })
  }

  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password })
  if (error) {
    return res.status(401).json({ error: 'Identifiants incorrects' })
  }

  // Charge le profil
  const { data: user } = await supabase
    .from('users')
    .select('id, email, full_name, role, title, org_id, organisations(id, name, type, region)')
    .eq('id', data.user.id)
    .single()

  res.json({
    token:        data.session.access_token,
    refresh_token: data.session.refresh_token,
    user,
  })
})

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body
  if (!refresh_token) return res.status(400).json({ error: 'refresh_token manquant' })

  const { data, error } = await supabaseAuth.auth.refreshSession({ refresh_token })
  if (error) return res.status(401).json({ error: 'Token expiré' })

  res.json({ token: data.session.access_token, refresh_token: data.session.refresh_token })
})

// GET /auth/me
router.get('/me', requireAuth, async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, email, full_name, role, title, org_id, organisations(id, name, type, region)')
    .eq('id', req.user.id)
    .single()

  res.json({ user })
})

// POST /auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  res.json({ ok: true })
})

export default router
