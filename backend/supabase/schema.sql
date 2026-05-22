-- =============================================================
-- MEDICO PRO — Schéma base de données
-- À exécuter dans Supabase SQL Editor
-- =============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- ORGANISATIONS (centrales, fournisseurs, établissements, medicalliance)
-- =============================================================
CREATE TABLE organisations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('medicalliance','centrale','fournisseur','etablissement')),
  region      TEXT,
  city        TEXT,
  postal_code TEXT,
  phone       TEXT,
  website     TEXT,
  logo_url    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- USERS (liés à Supabase Auth)
-- =============================================================
CREATE TABLE users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('medicalliance','centrale','fournisseur','etablissement')),
  org_id      UUID REFERENCES organisations(id),
  title       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger : synchro auto depuis auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, role, org_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'etablissement'),
    (NEW.raw_user_meta_data->>'org_id')::UUID
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================
-- ADHÉRENTS (profil fournisseur enrichi)
-- =============================================================
CREATE TABLE adherents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID UNIQUE REFERENCES organisations(id) ON DELETE CASCADE,
  tier            TEXT DEFAULT 'partner' CHECK (tier IN ('gold','premium','partner')),
  score_qualite   INTEGER DEFAULT 80 CHECK (score_qualite BETWEEN 0 AND 100),
  regions         TEXT[]  DEFAULT '{}',
  specialites     TEXT[]  DEFAULT '{}',
  certifications  TEXT[]  DEFAULT '{}',
  response_rate   NUMERIC(5,2) DEFAULT 85,
  avg_delay_days  INTEGER DEFAULT 5,
  total_orders    INTEGER DEFAULT 0,
  active_rentals  INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'disponible' CHECK (status IN ('disponible','limite','indisponible')),
  joined_at       TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- DEMANDES
-- =============================================================
CREATE TABLE demandes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref             TEXT UNIQUE NOT NULL,   -- ex: DEM-2024
  etablissement_id UUID REFERENCES organisations(id),
  centrale_id     UUID REFERENCES organisations(id),
  categorie       TEXT NOT NULL,          -- lits, fauteuils, soins...
  type_demande    TEXT NOT NULL CHECK (type_demande IN ('achat','location')),
  urgence         TEXT DEFAULT 'standard' CHECK (urgence IN ('standard','prioritaire','urgent')),
  quantite        INTEGER NOT NULL CHECK (quantite > 0),
  duree_mois      INTEGER,               -- si location
  description     TEXT,
  site_name       TEXT,
  city            TEXT,
  postal_code     TEXT,
  contact_name    TEXT,
  contact_phone   TEXT,
  statut          TEXT DEFAULT 'nouvelle'
                  CHECK (statut IN ('nouvelle','diffusee','devis_recus','commandee','livree','annulee')),
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Séquence pour les refs
CREATE SEQUENCE demande_ref_seq START 2025;
CREATE OR REPLACE FUNCTION generate_demande_ref()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ref := 'DEM-' || nextval('demande_ref_seq');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_demande_ref
  BEFORE INSERT ON demandes
  FOR EACH ROW WHEN (NEW.ref IS NULL OR NEW.ref = '')
  EXECUTE FUNCTION generate_demande_ref();

-- =============================================================
-- DIFFUSIONS (quelle demande → quels fournisseurs)
-- =============================================================
CREATE TABLE diffusions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  demande_id      UUID REFERENCES demandes(id) ON DELETE CASCADE,
  fournisseur_id  UUID REFERENCES organisations(id),
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  seen_at         TIMESTAMPTZ,
  statut          TEXT DEFAULT 'envoyee' CHECK (statut IN ('envoyee','vue','repondue','ignoree')),
  UNIQUE (demande_id, fournisseur_id)
);

-- =============================================================
-- DEVIS
-- =============================================================
CREATE TABLE devis (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref             TEXT UNIQUE NOT NULL,
  demande_id      UUID REFERENCES demandes(id) ON DELETE CASCADE,
  fournisseur_id  UUID REFERENCES organisations(id),
  prix_unitaire   NUMERIC(12,2) NOT NULL,
  quantite        INTEGER NOT NULL,
  total_ht        NUMERIC(12,2) NOT NULL,
  delai_livraison TEXT,
  disponibilite   TEXT,
  services        TEXT[]  DEFAULT '{}',
  conditions_paiement TEXT,
  note            TEXT,
  valide_jusqu_au DATE,
  statut          TEXT DEFAULT 'en_attente'
                  CHECK (statut IN ('en_attente','accepte','refuse')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE devis_ref_seq START 880;
CREATE OR REPLACE FUNCTION generate_devis_ref()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ref := 'DEV-' || nextval('devis_ref_seq');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_devis_ref
  BEFORE INSERT ON devis
  FOR EACH ROW WHEN (NEW.ref IS NULL OR NEW.ref = '')
  EXECUTE FUNCTION generate_devis_ref();

-- =============================================================
-- COMMANDES
-- =============================================================
CREATE TABLE commandes (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref                   TEXT UNIQUE NOT NULL,
  demande_id            UUID REFERENCES demandes(id),
  devis_id              UUID REFERENCES devis(id),
  fournisseur_id        UUID REFERENCES organisations(id),
  centrale_id           UUID REFERENCES organisations(id),
  etablissement_id      UUID REFERENCES organisations(id),
  statut                TEXT DEFAULT 'confirmee'
                        CHECK (statut IN ('confirmee','en_preparation','en_livraison','livree','annulee')),
  date_livraison_prevue DATE,
  date_livraison_reelle DATE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE commande_ref_seq START 1820;
CREATE OR REPLACE FUNCTION generate_commande_ref()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ref := 'CMD-' || nextval('commande_ref_seq');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_commande_ref
  BEFORE INSERT ON commandes
  FOR EACH ROW WHEN (NEW.ref IS NULL OR NEW.ref = '')
  EXECUTE FUNCTION generate_commande_ref();

-- =============================================================
-- LOCATIONS
-- =============================================================
CREATE TABLE locations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref             TEXT UNIQUE NOT NULL,
  commande_id     UUID REFERENCES commandes(id),
  etablissement_id UUID REFERENCES organisations(id),
  fournisseur_id  UUID REFERENCES organisations(id),
  equipement      TEXT NOT NULL,
  quantite        INTEGER NOT NULL,
  date_debut      DATE NOT NULL,
  date_fin        DATE NOT NULL,
  mensualite      NUMERIC(10,2) NOT NULL,
  statut          TEXT DEFAULT 'actif'
                  CHECK (statut IN ('actif','expire','renouvele','resilie')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE location_ref_seq START 40;
CREATE OR REPLACE FUNCTION generate_location_ref()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ref := 'LOC-00' || nextval('location_ref_seq');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_location_ref
  BEFORE INSERT ON locations
  FOR EACH ROW WHEN (NEW.ref IS NULL OR NEW.ref = '')
  EXECUTE FUNCTION generate_location_ref();

-- =============================================================
-- NOTIFICATIONS
-- =============================================================
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  link        TEXT,
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE organisations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE adherents      ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE diffusions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE devis          ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;

-- Helper : récupérer le rôle de l'utilisateur connecté
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION current_user_org()
RETURNS UUID AS $$
  SELECT org_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Organisations : tout le monde peut lire
CREATE POLICY "orgs_read_all" ON organisations FOR SELECT USING (true);

-- Users : chacun voit son propre profil; medicalliance voit tous
CREATE POLICY "users_own"          ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "users_medicalliance" ON users FOR SELECT USING (current_user_role() = 'medicalliance');

-- Demandes : filtrées par rôle
CREATE POLICY "demandes_etablissement" ON demandes FOR SELECT
  USING (etablissement_id = current_user_org() OR current_user_role() IN ('medicalliance','centrale'));

CREATE POLICY "demandes_insert_etablissement" ON demandes FOR INSERT
  WITH CHECK (current_user_role() IN ('etablissement','centrale'));

CREATE POLICY "demandes_update_centrale" ON demandes FOR UPDATE
  USING (centrale_id = current_user_org() OR current_user_role() = 'medicalliance');

-- Diffusions : fournisseur voit les siennes
CREATE POLICY "diffusions_fournisseur" ON diffusions FOR SELECT
  USING (fournisseur_id = current_user_org() OR current_user_role() IN ('medicalliance','centrale'));

CREATE POLICY "diffusions_centrale_insert" ON diffusions FOR INSERT
  WITH CHECK (current_user_role() IN ('centrale','medicalliance'));

-- Devis : fournisseur voit les siens; centrale voit ceux de ses demandes
CREATE POLICY "devis_fournisseur" ON devis FOR SELECT
  USING (fournisseur_id = current_user_org() OR current_user_role() IN ('medicalliance','centrale'));

CREATE POLICY "devis_insert_fournisseur" ON devis FOR INSERT
  WITH CHECK (current_user_role() = 'fournisseur');

CREATE POLICY "devis_update_centrale" ON devis FOR UPDATE
  USING (current_user_role() IN ('centrale','medicalliance'));

-- Locations : etablissement voit les siennes
CREATE POLICY "locations_read" ON locations FOR SELECT
  USING (
    etablissement_id = current_user_org()
    OR fournisseur_id = current_user_org()
    OR current_user_role() IN ('medicalliance','centrale')
  );

-- Notifications : chacun voit les siennes
CREATE POLICY "notifs_own" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifs_update_own" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Service role bypass (pour l'API backend)
CREATE POLICY "service_all_orgs"    ON organisations  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_users"   ON users          FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_dem"     ON demandes       FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_diff"    ON diffusions     FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_devis"   ON devis          FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_cmd"     ON commandes      FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_loc"     ON locations      FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_notifs"  ON notifications  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_adh"     ON adherents      FOR ALL USING (auth.role() = 'service_role');

-- Index utiles
CREATE INDEX idx_demandes_centrale      ON demandes(centrale_id);
CREATE INDEX idx_demandes_etablissement ON demandes(etablissement_id);
CREATE INDEX idx_demandes_statut        ON demandes(statut);
CREATE INDEX idx_diffusions_demande     ON diffusions(demande_id);
CREATE INDEX idx_diffusions_fournisseur ON diffusions(fournisseur_id);
CREATE INDEX idx_devis_demande          ON devis(demande_id);
CREATE INDEX idx_locations_etablissement ON locations(etablissement_id);
CREATE INDEX idx_notifications_user     ON notifications(user_id, read);
