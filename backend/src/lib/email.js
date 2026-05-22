import { Resend } from 'resend'
import 'dotenv/config'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.EMAIL_FROM || 'notifications@medico.pro'

export async function sendEmail({ to, subject, html }) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[EMAIL] → ${to} | ${subject}`)
    return { id: 'dev-mock' }
  }
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) throw error
    return data
  } catch (err) {
    console.error('[EMAIL] Erreur envoi:', err.message)
  }
}

// Templates
export const tpl = {
  newDemande: (demande, centrale) => ({
    subject: `Nouvelle demande ${demande.ref} — ${demande.categorie}`,
    html: `<p>La centrale <strong>${centrale}</strong> a transmis une nouvelle demande.</p>
           <p><strong>${demande.ref}</strong> — ${demande.quantite} × ${demande.categorie}</p>
           <p>Urgence : ${demande.urgence}</p>
           <a href="${process.env.FRONTEND_URL}/demandes/${demande.id}">Voir la demande</a>`,
  }),

  newDevis: (devis, fournisseur) => ({
    subject: `Nouveau devis ${devis.ref} reçu de ${fournisseur}`,
    html: `<p><strong>${fournisseur}</strong> a soumis un devis de <strong>${devis.total_ht.toLocaleString('fr-FR')} € HT</strong>.</p>
           <p>Délai de livraison : ${devis.delai_livraison}</p>
           <a href="${process.env.FRONTEND_URL}/devis/${devis.id}">Comparer les devis</a>`,
  }),

  devisAccepte: (devis, centrale) => ({
    subject: `Votre devis ${devis.ref} a été accepté`,
    html: `<p>La centrale <strong>${centrale}</strong> a accepté votre devis.</p>
           <p>Montant : <strong>${devis.total_ht.toLocaleString('fr-FR')} € HT</strong></p>
           <a href="${process.env.FRONTEND_URL}/commandes">Voir mes commandes</a>`,
  }),

  locationExpire: (location, joursRestants) => ({
    subject: `Renouvellement à prévoir — ${location.equipement} (J-${joursRestants})`,
    html: `<p>La location <strong>${location.ref}</strong> expire dans <strong>${joursRestants} jours</strong>.</p>
           <p>Équipement : ${location.equipement} × ${location.quantite}</p>
           <a href="${process.env.FRONTEND_URL}/locations">Gérer mes locations</a>`,
  }),
}
