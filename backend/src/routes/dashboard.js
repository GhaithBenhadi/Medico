import { Router } from 'express'
import supabase from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /dashboard — agrège les KPIs selon le rôle
router.get('/', async (req, res) => {
  const { user } = req
  let kpis = {}

  try {
    if (user.role === 'medicalliance') {
      const [centrales, adherents, demandes, volume] = await Promise.all([
        supabase.from('organisations').select('id', { count: 'exact' }).eq('type', 'centrale'),
        supabase.from('adherents').select('id', { count: 'exact' }),
        supabase.from('demandes').select('id', { count: 'exact' }).neq('statut', 'annulee'),
        supabase.from('devis').select('total_ht').eq('statut', 'accepte'),
      ])
      const totalVolume = volume.data?.reduce((s, d) => s + Number(d.total_ht), 0) || 0
      kpis = {
        centrales_actives: centrales.count || 0,
        adherents_actifs:  adherents.count || 0,
        demandes_actives:  demandes.count  || 0,
        volume_total:      totalVolume,
      }

    } else if (user.role === 'centrale') {
      const [demandes, devis, locations, etabs] = await Promise.all([
        supabase.from('demandes').select('id', { count: 'exact' }).eq('centrale_id', user.org_id).not('statut', 'in', '(annulee,livree)'),
        supabase.from('devis').select('demande_id').in('demande_id',
          (await supabase.from('demandes').select('id').eq('centrale_id', user.org_id)).data?.map(d => d.id) || []
        ).eq('statut', 'en_attente'),
        supabase.from('locations').select('id, mensualite').in('etablissement_id',
          (await supabase.from('demandes').select('etablissement_id').eq('centrale_id', user.org_id)).data?.map(d => d.etablissement_id) || []
        ).eq('statut', 'actif'),
        supabase.from('adherents').select('id', { count: 'exact' }),
      ])
      const mensualiteTotale = locations.data?.reduce((s, l) => s + Number(l.mensualite), 0) || 0
      kpis = {
        demandes_actives:   demandes.count  || 0,
        devis_en_attente:   devis.data?.length || 0,
        locations_actives:  locations.data?.length || 0,
        mensualite_totale:  mensualiteTotale,
        fournisseurs_actifs: etabs.count || 0,
      }

    } else if (user.role === 'fournisseur') {
      const [ao, devisEnv, commandes, locations] = await Promise.all([
        supabase.from('diffusions').select('id', { count: 'exact' }).eq('fournisseur_id', user.org_id).eq('statut', 'envoyee'),
        supabase.from('devis').select('id', { count: 'exact' }).eq('fournisseur_id', user.org_id).eq('statut', 'en_attente'),
        supabase.from('commandes').select('id', { count: 'exact' }).eq('fournisseur_id', user.org_id).not('statut', 'in', '(livree,annulee)'),
        supabase.from('devis').select('total_ht').eq('fournisseur_id', user.org_id).eq('statut', 'accepte'),
      ])
      const ca = locations.data?.reduce((s, d) => s + Number(d.total_ht), 0) || 0
      kpis = {
        appels_offres_actifs: ao.count  || 0,
        devis_envoyes:        devisEnv.count || 0,
        commandes_en_cours:   commandes.count || 0,
        ca_total:             ca,
      }

    } else if (user.role === 'etablissement') {
      const [demandes, equipements, locations, alertes] = await Promise.all([
        supabase.from('demandes').select('id', { count: 'exact' }).eq('etablissement_id', user.org_id).not('statut', 'in', '(livree,annulee)'),
        supabase.from('locations').select('quantite').eq('etablissement_id', user.org_id).eq('statut', 'actif'),
        supabase.from('locations').select('id', { count: 'exact' }).eq('etablissement_id', user.org_id).eq('statut', 'actif'),
        supabase.from('locations').select('id', { count: 'exact' }).eq('etablissement_id', user.org_id)
          .lt('date_fin', new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]),
      ])
      const totalEquipements = equipements.data?.reduce((s, l) => s + l.quantite, 0) || 0
      kpis = {
        demandes_actives:     demandes.count || 0,
        equipements_en_service: totalEquipements,
        locations_actives:    locations.count || 0,
        alertes_renouvellement: alertes.count || 0,
      }
    }

    res.json({ kpis })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /dashboard/activity — activité récente (dernières 10 actions)
router.get('/activity', async (req, res) => {
  const { user } = req
  const items = []

  const [recentDemandes, recentDevis, recentCommandes] = await Promise.all([
    supabase.from('demandes').select('id, ref, categorie, statut, created_at, etablissement:organisations!etablissement_id(name)')
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('devis').select('id, ref, total_ht, statut, created_at, fournisseur:organisations!fournisseur_id(name)')
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('commandes').select('id, ref, statut, created_at')
      .order('created_at', { ascending: false }).limit(3),
  ])

  recentDemandes.data?.forEach(d => items.push({
    type: 'demande', id: d.id, label: `Demande ${d.ref}`,
    detail: `${d.etablissement?.name} · ${d.categorie}`, statut: d.statut, at: d.created_at,
  }))
  recentDevis.data?.forEach(d => items.push({
    type: 'devis', id: d.id, label: `Devis ${d.ref}`,
    detail: `${d.fournisseur?.name} · ${d.total_ht?.toLocaleString('fr-FR')} € HT`, statut: d.statut, at: d.created_at,
  }))
  recentCommandes.data?.forEach(c => items.push({
    type: 'commande', id: c.id, label: `Commande ${c.ref}`,
    detail: c.statut, statut: c.statut, at: c.created_at,
  }))

  items.sort((a, b) => new Date(b.at) - new Date(a.at))
  res.json({ data: items.slice(0, 10) })
})

export default router
