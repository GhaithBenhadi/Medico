import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// Client service_role — accès total, contourne RLS
// Utilisé uniquement côté backend, jamais exposé au client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export default supabase
