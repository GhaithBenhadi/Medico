-- =============================================================
-- MEDICO PRO — Données de démo
-- À exécuter APRÈS schema.sql dans Supabase SQL Editor
-- =============================================================

-- Organisations
INSERT INTO organisations (id, name, type, region, city) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Medicalliance',              'medicalliance', 'National',         'Paris'),
  ('00000000-0000-0000-0000-000000000002', 'Groupement Sud-Ouest',       'centrale',      'Occitanie · PACA', 'Toulouse'),
  ('00000000-0000-0000-0000-000000000003', 'UGAP Île-de-France',         'centrale',      'Île-de-France',    'Paris'),
  ('00000000-0000-0000-0000-000000000010', 'MediPro France',             'fournisseur',   'Occitanie',        'Toulouse'),
  ('00000000-0000-0000-0000-000000000011', 'SudMed Equipements',         'fournisseur',   'Occitanie',        'Montpellier'),
  ('00000000-0000-0000-0000-000000000012', 'Atlantique Médical',         'fournisseur',   'Nouvelle-Aquitaine','Bordeaux'),
  ('00000000-0000-0000-0000-000000000020', 'EHPAD Les Jardins',          'etablissement', 'Occitanie',        'Toulouse'),
  ('00000000-0000-0000-0000-000000000021', 'Clinique Saint-Joseph',      'etablissement', 'Auvergne-Rhône-Alpes','Lyon'),
  ('00000000-0000-0000-0000-000000000022', 'HAD Sud-Ouest',              'etablissement', 'Nouvelle-Aquitaine','Bordeaux');

-- Adhérents
INSERT INTO adherents (org_id, tier, score_qualite, regions, specialites, certifications, response_rate, avg_delay_days, total_orders, status) VALUES
  ('00000000-0000-0000-0000-000000000010', 'gold',    98, ARRAY['Occitanie','PACA','Nouvelle-Aquitaine'], ARRAY['Lits médicalisés','Fauteuils','Manutention'], ARRAY['ISO 9001','NF EN 62353','QUALISAN'], 97, 3, 342, 'disponible'),
  ('00000000-0000-0000-0000-000000000011', 'premium', 94, ARRAY['Occitanie','Auvergne-Rhône-Alpes'],      ARRAY['Lits médicalisés','Matelas anti-escarre'],    ARRAY['ISO 9001','NF EN 62353'],            92, 4, 218, 'disponible'),
  ('00000000-0000-0000-0000-000000000012', 'premium', 91, ARRAY['Nouvelle-Aquitaine','Pays de la Loire'], ARRAY['Fauteuils roulants','Diagnostic'],             ARRAY['ISO 9001','QUALISAN'],               90, 4, 267, 'limite');

-- Comptes utilisateurs de démo
-- NOTE: Ces utilisateurs doivent être créés AUSSI dans Supabase Auth
-- (via Dashboard > Authentication > Users > Add user)
-- avec les mêmes IDs UUID et les metadata role + org_id

INSERT INTO users (id, email, full_name, role, org_id, title) VALUES
  ('10000000-0000-0000-0000-000000000001', 'karim@medicalliance.fr',      'Karim Mansouri',  'medicalliance', '00000000-0000-0000-0000-000000000001', 'Directeur Réseau'),
  ('10000000-0000-0000-0000-000000000002', 'sophie@groupement-so.fr',     'Sophie Lambert',  'centrale',      '00000000-0000-0000-0000-000000000002', 'Responsable achats'),
  ('10000000-0000-0000-0000-000000000003', 'pierre@medipro.fr',           'Pierre Martin',   'fournisseur',   '00000000-0000-0000-0000-000000000010', 'Directeur commercial'),
  ('10000000-0000-0000-0000-000000000004', 'isabelle@ehpad-jardins.fr',   'Isabelle Morin',  'etablissement', '00000000-0000-0000-0000-000000000020', 'Directrice des soins');

-- Demandes de démo
INSERT INTO demandes (ref, etablissement_id, centrale_id, categorie, type_demande, urgence, quantite, description, site_name, city, statut, created_by) VALUES
  ('DEM-2024', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000002', 'lits',      'achat',    'urgent',    20, 'Lits médicalisés électriques 3 plans, certification CE requise.', 'EHPAD Les Jardins',     'Toulouse', 'devis_recus', '10000000-0000-0000-0000-000000000004'),
  ('DEM-2023', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', 'fauteuils', 'achat',    'standard',  12, 'Fauteuils roulants à propulsion manuelle, accoudoirs relevables.','Clinique Saint-Joseph', 'Lyon',     'devis_recus', '10000000-0000-0000-0000-000000000004'),
  ('DEM-2022', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000002', 'fauteuils', 'location',  'standard',  3, 'Lève-personnes mobiles avec sangle de confort.', 'EHPAD Les Jardins',     'Toulouse', 'diffusee',    '10000000-0000-0000-0000-000000000004'),
  ('DEM-2021', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', 'soins',     'location',  'standard',  6, 'Matelas anti-escarre thérapeutiques.', 'HAD Sud-Ouest',         'Bordeaux', 'commandee',   '10000000-0000-0000-0000-000000000004');

-- Diffusions
INSERT INTO diffusions (demande_id, fournisseur_id, statut) VALUES
  ((SELECT id FROM demandes WHERE ref='DEM-2024'), '00000000-0000-0000-0000-000000000010', 'repondue'),
  ((SELECT id FROM demandes WHERE ref='DEM-2024'), '00000000-0000-0000-0000-000000000011', 'repondue'),
  ((SELECT id FROM demandes WHERE ref='DEM-2024'), '00000000-0000-0000-0000-000000000012', 'repondue'),
  ((SELECT id FROM demandes WHERE ref='DEM-2022'), '00000000-0000-0000-0000-000000000010', 'envoyee'),
  ((SELECT id FROM demandes WHERE ref='DEM-2022'), '00000000-0000-0000-0000-000000000011', 'envoyee');

-- Devis
INSERT INTO devis (ref, demande_id, fournisseur_id, prix_unitaire, quantite, total_ht, delai_livraison, disponibilite, services, conditions_paiement, note, valide_jusqu_au, statut) VALUES
  ('DEV-881',
   (SELECT id FROM demandes WHERE ref='DEM-2024'),
   '00000000-0000-0000-0000-000000000010',
   2490, 20, 47200, '3 jours', 'Immédiate',
   ARRAY['Installation','Formation','SAV 24h','Garantie 5 ans'],
   '30 jours net',
   'Lot de 20 unités avec remise groupée 5%. Certification NF EN ISO 9001.',
   CURRENT_DATE + 8, 'en_attente'),
  ('DEV-879',
   (SELECT id FROM demandes WHERE ref='DEM-2024'),
   '00000000-0000-0000-0000-000000000011',
   2350, 20, 45500, '5 jours', 'Sous 48h',
   ARRAY['Installation','SAV 8h-18h','Garantie 3 ans'],
   '45 jours net',
   'Modèle HD3000 certifié CE. Option matelas incluse >15 unités.',
   CURRENT_DATE + 6, 'en_attente'),
  ('DEV-876',
   (SELECT id FROM demandes WHERE ref='DEM-2024'),
   '00000000-0000-0000-0000-000000000012',
   2180, 20, 42600, '7 jours', 'Sous 1 semaine',
   ARRAY['Installation','Garantie 2 ans'],
   '60 jours net',
   'Prix compétitif. Livraison possible par tranche de 5.',
   CURRENT_DATE + 11, 'en_attente');

-- Locations actives
INSERT INTO locations (ref, etablissement_id, fournisseur_id, equipement, quantite, date_debut, date_fin, mensualite, statut) VALUES
  ('LOC-0041', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', 'Lits médicalisés',      20, CURRENT_DATE - 67,  CURRENT_DATE + 298, 4800, 'actif'),
  ('LOC-0038', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000011', 'Fauteuils roulants',    8,  CURRENT_DATE - 110, CURRENT_DATE + 255, 1920, 'actif'),
  ('LOC-0034', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000012', 'Matelas anti-escarre',  6,  CURRENT_DATE - 359, CURRENT_DATE + 6,   720,  'actif'),
  ('LOC-0031', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000010', 'Lève-personnes',        3,  CURRENT_DATE - 365, CURRENT_DATE - 1,   540,  'expire');
