import jwt from 'jsonwebtoken'
import supabase from '../lib/supabase.js'

// Vérifie le JWT Supabase et charge l'utilisateur
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' })
  }

  const token = header.slice(7)
  try {
    // Vérification signature JWT Supabase
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET)

    // Charge le profil utilisateur complet
    const { data: user, error } = await supabase
      .from('users')
      .select('*, organisations(*)')
      .eq('id', decoded.sub)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' })
  }
}

// Guard par rôle — usage : requireRole('centrale','medicalliance')
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Non authentifié' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Accès réservé : ${roles.join(', ')}` })
    }
    next()
  }
}
