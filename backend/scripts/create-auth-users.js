// =============================================================
// Crée les 4 comptes démo dans Supabase Auth avec les UUIDs
// qui correspondent à la table public.users du seed.sql
//
// Usage :
//   node backend/scripts/create-auth-users.js
// (depuis la racine du projet, avec le fichier backend/.env rempli)
// =============================================================
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY   // service_role key — droit admin
)

const DEMO_USERS = [
  {
    id:       '10000000-0000-0000-0000-000000000001',
    email:    'karim@medicalliance.fr',
    name:     'Karim Mansouri',
    password: 'demo1234',
  },
  {
    id:       '10000000-0000-0000-0000-000000000002',
    email:    'sophie@groupement-so.fr',
    name:     'Sophie Lambert',
    password: 'demo1234',
  },
  {
    id:       '10000000-0000-0000-0000-000000000003',
    email:    'pierre@medipro.fr',
    name:     'Pierre Martin',
    password: 'demo1234',
  },
  {
    id:       '10000000-0000-0000-0000-000000000004',
    email:    'isabelle@ehpad-jardins.fr',
    name:     'Isabelle Morin',
    password: 'demo1234',
  },
]

console.log('Création des comptes démo dans Supabase Auth...\n')

for (const u of DEMO_USERS) {
  const { data, error } = await supabase.auth.admin.createUser({
    id:             u.id,
    email:          u.email,
    password:       u.password,
    email_confirm:  true,           // pas besoin de validation email
    user_metadata:  { full_name: u.name },
  })

  if (error) {
    // "User already registered" n'est pas bloquant
    if (error.message.includes('already')) {
      console.log(`⚠️  ${u.email} — déjà existant (OK)`)
    } else {
      console.error(`❌  ${u.email} — ${error.message}`)
    }
  } else {
    console.log(`✅  ${u.email} — créé (id: ${data.user.id})`)
  }
}

console.log('\nTerminé. Vous pouvez maintenant vous connecter avec le mot de passe demo1234')
