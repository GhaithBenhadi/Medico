import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import authRoutes      from './routes/auth.js'
import demandesRoutes  from './routes/demandes.js'
import diffusionsRoutes from './routes/diffusions.js'
import devisRoutes     from './routes/devis.js'
import locationsRoutes from './routes/locations.js'
import adherentsRoutes from './routes/adherents.js'
import dashboardRoutes from './routes/dashboard.js'

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middleware ─────────────────────────────────────────────
app.use(helmet())

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://plateforme-medicalliance.codepros.fr',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '2mb' }))

// ── Routes ─────────────────────────────────────────────────
app.use('/auth',       authRoutes)
app.use('/demandes',   demandesRoutes)
app.use('/diffusions', diffusionsRoutes)
app.use('/devis',      devisRoutes)
app.use('/locations',  locationsRoutes)
app.use('/adherents',  adherentsRoutes)
app.use('/dashboard',  dashboardRoutes)

// ── Health check ───────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true, env: process.env.NODE_ENV }))

// ── 404 ────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Route non trouvée' }))

// ── Error handler ──────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 Medico API → http://localhost:${PORT}`)
  console.log(`   ENV: ${process.env.NODE_ENV}`)
  console.log(`   Supabase: ${process.env.SUPABASE_URL?.slice(0, 40)}...\n`)
})
