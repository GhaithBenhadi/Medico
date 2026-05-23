// =============================================================
// MOCK DATA — toutes les données de démo centralisées
// Correspondent exactement aux comptes de la page Login
// =============================================================

export const DEMO_USERS = [
  {
    id: '10000000-0001',
    email: 'karim@medicalliance.fr',
    password: 'demo1234',
    full_name: 'Karim Mansouri',
    role: 'medicalliance',
    title: 'Directeur Réseau',
    org_id: 'org-01',
    organisations: { id: 'org-01', name: 'Medicalliance', type: 'medicalliance', region: 'National' },
  },
  {
    id: '10000000-0002',
    email: 'sophie@groupement-so.fr',
    password: 'demo1234',
    full_name: 'Sophie Lambert',
    role: 'centrale',
    title: 'Responsable achats',
    org_id: 'org-02',
    organisations: { id: 'org-02', name: 'Groupement Sud-Ouest', type: 'centrale', region: 'Occitanie · PACA' },
  },
  {
    id: '10000000-0003',
    email: 'pierre@medipro.fr',
    password: 'demo1234',
    full_name: 'Pierre Martin',
    role: 'fournisseur',
    title: 'Directeur commercial',
    org_id: 'org-10',
    organisations: { id: 'org-10', name: 'MediPro France', type: 'fournisseur', region: 'Occitanie' },
  },
  {
    id: '10000000-0004',
    email: 'isabelle@ehpad-jardins.fr',
    password: 'demo1234',
    full_name: 'Isabelle Morin',
    role: 'etablissement',
    title: 'Directrice des soins',
    org_id: 'org-20',
    organisations: { id: 'org-20', name: 'EHPAD Les Jardins', type: 'etablissement', region: 'Occitanie' },
  },
]

// ── Organisations ─────────────────────────────────────────
export const ORGANISATIONS = [
  { id: 'org-01', name: 'Medicalliance',          type: 'medicalliance', region: 'National',           city: 'Paris' },
  { id: 'org-02', name: 'Groupement Sud-Ouest',   type: 'centrale',      region: 'Occitanie · PACA',   city: 'Toulouse' },
  { id: 'org-03', name: 'UGAP Île-de-France',     type: 'centrale',      region: 'Île-de-France',      city: 'Paris' },
  { id: 'org-04', name: 'Groupement Grand-Est',   type: 'centrale',      region: 'Grand-Est',          city: 'Strasbourg' },
  { id: 'org-05', name: 'CAHPP Nouvelle-Aquitaine',type:'centrale',       region: 'Nouvelle-Aquitaine', city: 'Bordeaux' },
  { id: 'org-10', name: 'MediPro France',         type: 'fournisseur',   region: 'Occitanie',          city: 'Toulouse' },
  { id: 'org-11', name: 'SudMed Equipements',     type: 'fournisseur',   region: 'Occitanie',          city: 'Montpellier' },
  { id: 'org-12', name: 'Atlantique Médical',     type: 'fournisseur',   region: 'Nouvelle-Aquitaine', city: 'Bordeaux' },
  { id: 'org-13', name: 'HealthCare Sud',         type: 'fournisseur',   region: 'PACA',               city: 'Marseille' },
  { id: 'org-14', name: 'Méditec PSDM',          type: 'fournisseur',   region: 'Haute-Garonne',      city: 'Toulouse' },
  { id: 'org-15', name: 'Nord Médical Services',  type: 'fournisseur',   region: 'Hauts-de-France',    city: 'Lille' },
  { id: 'org-20', name: 'EHPAD Les Jardins',      type: 'etablissement', region: 'Occitanie',          city: 'Toulouse' },
  { id: 'org-21', name: 'Clinique Saint-Joseph',  type: 'etablissement', region: 'Auvergne-Rhône-Alpes',city:'Lyon' },
  { id: 'org-22', name: 'HAD Sud-Ouest',          type: 'etablissement', region: 'Nouvelle-Aquitaine', city: 'Bordeaux' },
]

// ── Adhérents ─────────────────────────────────────────────
export const ADHERENTS = [
  {
    org_id: 'org-10',
    tier: 'gold', score_qualite: 98,
    regions: ['Occitanie', 'PACA', 'Nouvelle-Aquitaine'],
    specialites: ['Lits médicalisés', 'Fauteuils', 'Manutention'],
    certifications: ['ISO 9001', 'NF EN 62353', 'QUALISAN'],
    response_rate: 97, avg_delay_days: 3, total_orders: 342,
    active_rentals: 24, status: 'disponible',
    org: { id: 'org-10', name: 'MediPro France', city: 'Toulouse', region: 'Occitanie', phone: '05 61 XX XX XX' },
  },
  {
    org_id: 'org-11',
    tier: 'premium', score_qualite: 94,
    regions: ['Occitanie', 'Auvergne-Rhône-Alpes'],
    specialites: ['Lits médicalisés', 'Matelas anti-escarre', 'Prévention'],
    certifications: ['ISO 9001', 'NF EN 62353'],
    response_rate: 92, avg_delay_days: 4, total_orders: 218,
    active_rentals: 18, status: 'disponible',
    org: { id: 'org-11', name: 'SudMed Equipements', city: 'Montpellier', region: 'Occitanie', phone: '04 67 XX XX XX' },
  },
  {
    org_id: 'org-12',
    tier: 'premium', score_qualite: 91,
    regions: ['Nouvelle-Aquitaine', 'Pays de la Loire'],
    specialites: ['Fauteuils roulants', 'Diagnostic', 'Soins'],
    certifications: ['ISO 9001', 'QUALISAN'],
    response_rate: 90, avg_delay_days: 4, total_orders: 267,
    active_rentals: 31, status: 'limite',
    org: { id: 'org-12', name: 'Atlantique Médical', city: 'Bordeaux', region: 'Nouvelle-Aquitaine', phone: '05 56 XX XX XX' },
  },
  {
    org_id: 'org-13',
    tier: 'partner', score_qualite: 89,
    regions: ['PACA', 'Languedoc-Roussillon'],
    specialites: ['Lits', 'Fauteuils', 'Matériel de soins'],
    certifications: ['ISO 9001'],
    response_rate: 88, avg_delay_days: 5, total_orders: 156,
    active_rentals: 12, status: 'disponible',
    org: { id: 'org-13', name: 'HealthCare Sud', city: 'Marseille', region: 'PACA', phone: '04 91 XX XX XX' },
  },
  {
    org_id: 'org-14',
    tier: 'partner', score_qualite: 85,
    regions: ['Haute-Garonne', 'Ariège'],
    specialites: ['Lits médicalisés', 'Manutention'],
    certifications: ['ISO 9001'],
    response_rate: 84, avg_delay_days: 6, total_orders: 98,
    active_rentals: 7, status: 'disponible',
    org: { id: 'org-14', name: 'Méditec PSDM', city: 'Toulouse', region: 'Haute-Garonne', phone: '05 61 XX XX XX' },
  },
  {
    org_id: 'org-15',
    tier: 'partner', score_qualite: 87,
    regions: ['Hauts-de-France', 'Normandie'],
    specialites: ['Respiratoire', 'Diagnostic', 'Soins'],
    certifications: ['ISO 9001', 'NF EN 62353'],
    response_rate: 86, avg_delay_days: 4, total_orders: 134,
    active_rentals: 9, status: 'disponible',
    org: { id: 'org-15', name: 'Nord Médical Services', city: 'Lille', region: 'Hauts-de-France', phone: '03 20 XX XX XX' },
  },
]

// ── Demandes ──────────────────────────────────────────────
const today = new Date()
const daysAgo = (n) => new Date(today - n * 86400000).toISOString()

export const DEMANDES = [
  {
    id: 'dem-01', ref: 'DEM-2024',
    etablissement_id: 'org-20', centrale_id: 'org-02',
    categorie: 'lits', type_demande: 'achat', urgence: 'urgent',
    quantite: 20, description: 'Lits médicalisés électriques 3 plans, certification CE requise.',
    site_name: 'EHPAD Les Jardins', city: 'Toulouse', postal_code: '31000',
    contact_name: 'Isabelle Morin',
    statut: 'devis_recus',
    created_at: daysAgo(0.1),
    etablissement: { id: 'org-20', name: 'EHPAD Les Jardins', city: 'Toulouse' },
    centrale: { id: 'org-02', name: 'Groupement Sud-Ouest' },
  },
  {
    id: 'dem-02', ref: 'DEM-2023',
    etablissement_id: 'org-21', centrale_id: 'org-02',
    categorie: 'fauteuils', type_demande: 'achat', urgence: 'standard',
    quantite: 12, description: 'Fauteuils roulants à propulsion manuelle, accoudoirs relevables.',
    site_name: 'Clinique Saint-Joseph', city: 'Lyon', postal_code: '69000',
    contact_name: 'Marc Dupont',
    statut: 'devis_recus',
    created_at: daysAgo(1),
    etablissement: { id: 'org-21', name: 'Clinique Saint-Joseph', city: 'Lyon' },
    centrale: { id: 'org-02', name: 'Groupement Sud-Ouest' },
  },
  {
    id: 'dem-03', ref: 'DEM-2022',
    etablissement_id: 'org-20', centrale_id: 'org-02',
    categorie: 'fauteuils', type_demande: 'location', urgence: 'standard',
    quantite: 3, description: 'Lève-personnes mobiles avec sangle de confort.',
    site_name: 'EHPAD Les Jardins', city: 'Toulouse', postal_code: '31000',
    contact_name: 'Isabelle Morin',
    statut: 'diffusee',
    created_at: daysAgo(2),
    etablissement: { id: 'org-20', name: 'EHPAD Les Jardins', city: 'Toulouse' },
    centrale: { id: 'org-02', name: 'Groupement Sud-Ouest' },
  },
  {
    id: 'dem-04', ref: 'DEM-2021',
    etablissement_id: 'org-22', centrale_id: 'org-02',
    categorie: 'soins', type_demande: 'location', urgence: 'standard',
    quantite: 6, description: 'Matelas anti-escarre thérapeutiques.',
    site_name: 'HAD Sud-Ouest', city: 'Bordeaux', postal_code: '33000',
    contact_name: 'Claire Roux',
    statut: 'commandee',
    created_at: daysAgo(3),
    etablissement: { id: 'org-22', name: 'HAD Sud-Ouest', city: 'Bordeaux' },
    centrale: { id: 'org-02', name: 'Groupement Sud-Ouest' },
  },
]

// ── Diffusions ────────────────────────────────────────────
export const DIFFUSIONS = [
  { id: 'dif-01', demande_id: 'dem-01', fournisseur_id: 'org-10', statut: 'repondue',
    fournisseur: { id: 'org-10', name: 'MediPro France' } },
  { id: 'dif-02', demande_id: 'dem-01', fournisseur_id: 'org-11', statut: 'repondue',
    fournisseur: { id: 'org-11', name: 'SudMed Equipements' } },
  { id: 'dif-03', demande_id: 'dem-01', fournisseur_id: 'org-12', statut: 'repondue',
    fournisseur: { id: 'org-12', name: 'Atlantique Médical' } },
  { id: 'dif-04', demande_id: 'dem-03', fournisseur_id: 'org-10', statut: 'envoyee',
    fournisseur: { id: 'org-10', name: 'MediPro France' } },
  { id: 'dif-05', demande_id: 'dem-03', fournisseur_id: 'org-11', statut: 'envoyee',
    fournisseur: { id: 'org-11', name: 'SudMed Equipements' } },
]

// ── Devis ─────────────────────────────────────────────────
const inDays = (n) => new Date(today.getTime() + n * 86400000).toISOString().split('T')[0]

export const DEVIS = [
  {
    id: 'dev-01', ref: 'DEV-881',
    demande_id: 'dem-01', fournisseur_id: 'org-10',
    prix_unitaire: 2490, quantite: 20, total_ht: 47200,
    delai_livraison: '3 jours', disponibilite: 'Immédiate',
    services: ['Installation', 'Formation', 'SAV 24h', 'Garantie 5 ans'],
    conditions_paiement: '30 jours net',
    note: 'Lot de 20 unités avec remise groupée 5%. Certification NF EN ISO 9001.',
    valide_jusqu_au: inDays(8),
    statut: 'en_attente',
    created_at: daysAgo(0.1),
    fournisseur: { id: 'org-10', name: 'MediPro France' },
  },
  {
    id: 'dev-02', ref: 'DEV-879',
    demande_id: 'dem-01', fournisseur_id: 'org-11',
    prix_unitaire: 2350, quantite: 20, total_ht: 45500,
    delai_livraison: '5 jours', disponibilite: 'Sous 48h',
    services: ['Installation', 'SAV 8h-18h', 'Garantie 3 ans'],
    conditions_paiement: '45 jours net',
    note: 'Modèle HD3000 certifié CE. Option matelas incluse >15 unités.',
    valide_jusqu_au: inDays(6),
    statut: 'en_attente',
    created_at: daysAgo(0.2),
    fournisseur: { id: 'org-11', name: 'SudMed Equipements' },
  },
  {
    id: 'dev-03', ref: 'DEV-876',
    demande_id: 'dem-01', fournisseur_id: 'org-12',
    prix_unitaire: 2180, quantite: 20, total_ht: 42600,
    delai_livraison: '7 jours', disponibilite: 'Sous 1 semaine',
    services: ['Installation', 'Garantie 2 ans'],
    conditions_paiement: '60 jours net',
    note: 'Prix compétitif. Livraison possible par tranche de 5 unités.',
    valide_jusqu_au: inDays(11),
    statut: 'en_attente',
    created_at: daysAgo(0.3),
    fournisseur: { id: 'org-12', name: 'Atlantique Médical' },
  },
  // Devis du fournisseur connecté (org-10) sur d'autres demandes
  {
    id: 'dev-04', ref: 'DEV-874',
    demande_id: 'dem-02', fournisseur_id: 'org-10',
    prix_unitaire: 820, quantite: 8, total_ht: 6560,
    delai_livraison: '4 jours', disponibilite: 'Immédiate',
    services: ['Livraison', 'Garantie 2 ans'],
    conditions_paiement: '30 jours net',
    note: 'Modèle ergonomique, poids max 130 kg.',
    valide_jusqu_au: inDays(12),
    statut: 'accepte',
    created_at: daysAgo(1),
    fournisseur: { id: 'org-10', name: 'MediPro France' },
  },
]

// ── Locations ─────────────────────────────────────────────
export const LOCATIONS = [
  {
    id: 'loc-01', ref: 'LOC-0041',
    etablissement_id: 'org-20', fournisseur_id: 'org-10',
    equipement: 'Lits médicalisés', quantite: 20,
    date_debut: new Date(today - 67 * 86400000).toISOString().split('T')[0],
    date_fin:   new Date(today + 298 * 86400000).toISOString().split('T')[0],
    mensualite: 4800, statut: 'actif',
    days_left: 298,
    etablissement: { id: 'org-20', name: 'EHPAD Les Jardins', city: 'Toulouse' },
    fournisseur:   { id: 'org-10', name: 'MediPro France' },
  },
  {
    id: 'loc-02', ref: 'LOC-0038',
    etablissement_id: 'org-21', fournisseur_id: 'org-11',
    equipement: 'Fauteuils roulants', quantite: 8,
    date_debut: new Date(today - 110 * 86400000).toISOString().split('T')[0],
    date_fin:   new Date(today + 255 * 86400000).toISOString().split('T')[0],
    mensualite: 1920, statut: 'actif',
    days_left: 255,
    etablissement: { id: 'org-21', name: 'Clinique Saint-Joseph', city: 'Lyon' },
    fournisseur:   { id: 'org-11', name: 'SudMed Equipements' },
  },
  {
    id: 'loc-03', ref: 'LOC-0034',
    etablissement_id: 'org-20', fournisseur_id: 'org-12',
    equipement: 'Matelas anti-escarre', quantite: 6,
    date_debut: new Date(today - 359 * 86400000).toISOString().split('T')[0],
    date_fin:   new Date(today + 6 * 86400000).toISOString().split('T')[0],
    mensualite: 720, statut: 'actif',
    days_left: 6,
    etablissement: { id: 'org-20', name: 'EHPAD Les Jardins', city: 'Toulouse' },
    fournisseur:   { id: 'org-12', name: 'Atlantique Médical' },
  },
  {
    id: 'loc-04', ref: 'LOC-0031',
    etablissement_id: 'org-22', fournisseur_id: 'org-10',
    equipement: 'Lève-personnes', quantite: 3,
    date_debut: new Date(today - 366 * 86400000).toISOString().split('T')[0],
    date_fin:   new Date(today - 1 * 86400000).toISOString().split('T')[0],
    mensualite: 540, statut: 'expire',
    days_left: 0,
    etablissement: { id: 'org-22', name: 'HAD Sud-Ouest', city: 'Bordeaux' },
    fournisseur:   { id: 'org-10', name: 'MediPro France' },
  },
]

// ── Dashboard data par rôle ───────────────────────────────
export const DASHBOARD_KPIS = {
  medicalliance: {
    centrales_actives: 12,
    adherents_actifs: 127,
    demandes_actives: 74,
    volume_total: 1840000,
  },
  centrale: {
    demandes_actives: 24,
    devis_en_attente: 8,
    locations_actives: 41,
    mensualite_totale: 9820,
    fournisseurs_actifs: 127,
  },
  fournisseur: {
    appels_offres_actifs: 4,
    devis_envoyes: 11,
    commandes_en_cours: 7,
    ca_total: 52000,
  },
  etablissement: {
    demandes_actives: 3,
    equipements_en_service: 42,
    locations_actives: 4,
    alertes_renouvellement: 1,
  },
}
