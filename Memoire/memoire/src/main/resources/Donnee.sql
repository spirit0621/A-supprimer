CREATE TABLE etablissement (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    siret VARCHAR(14) UNIQUE NOT NULL,
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(20)
);

CREATE TABLE poste (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(100) NOT NULL,
    description TEXT,
    salaire_min DECIMAL(12, 2),
    salaire_max DECIMAL(12, 2)
);

CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    nsc VARCHAR(15) UNIQUE,
    iban VARCHAR(34),
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(20),
    taux_imposition DECIMAL(5, 2) DEFAULT 0.00,
    etablissement_id INTEGER,
    CONSTRAINT fk_utilisateur_etablissement FOREIGN KEY (etablissement_id) REFERENCES etablissement (id) ON DELETE SET NULL
);

CREATE TABLE contrat (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER NOT NULL,
    poste_id INTEGER,
    type_contrat VARCHAR(50) NOT NULL,
    salaire_base_mensuel DECIMAL(12, 2) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    statut VARCHAR(50) DEFAULT 'ACTIF',
    CONSTRAINT fk_contrat_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON DELETE CASCADE,
    CONSTRAINT fk_contrat_poste FOREIGN KEY (poste_id) REFERENCES poste (id) ON DELETE SET NULL
);

CREATE TABLE fiche_de_paie (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER NOT NULL,
    contrat_id INTEGER NOT NULL,
    periode_mois_annee VARCHAR(7) NOT NULL,
    salaire_base DECIMAL(12, 2) NOT NULL,
    total_brut DECIMAL(12, 2) NOT NULL,
    total_net DECIMAL(12, 2) NOT NULL,
    statut VARCHAR(50) DEFAULT 'BROUILLON',
    date_generation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fiche_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON DELETE CASCADE,
    CONSTRAINT fk_fiche_contrat FOREIGN KEY (contrat_id) REFERENCES contrat (id) ON DELETE CASCADE
);

CREATE TABLE element_paie (
    id SERIAL PRIMARY KEY,
    contrat_id INTEGER,
    fiche_de_paie_id INTEGER,
    
    code VARCHAR(50) NOT NULL,
    libelle VARCHAR(100) NOT NULL,
    type_element VARCHAR(20) NOT NULL, 
    
    
    nature_saisie VARCHAR(20) NOT NULL, 
    valeur VARCHAR(255) NOT NULL,      
    quantite DECIMAL(10, 2) DEFAULT 1, 
    
    date_debut DATE,
    date_fin DATE,   
    
    CONSTRAINT fk_element_paie_contrat FOREIGN KEY (contrat_id) REFERENCES contrat (id) ON DELETE CASCADE,
    CONSTRAINT fk_element_paie_fiche FOREIGN KEY (fiche_de_paie_id) REFERENCES fiche_de_paie (id) ON DELETE CASCADE,
    
    
    CONSTRAINT chk_element_paie_rattachement CHECK (
        (contrat_id IS NOT NULL AND fiche_de_paie_id IS NULL) OR 
        (contrat_id IS NULL AND fiche_de_paie_id IS NOT NULL)
    )
);

CREATE TABLE ligne_fiche_de_paie (
    id SERIAL PRIMARY KEY,
    fiche_de_paie_id INTEGER NOT NULL,
    code VARCHAR(50) NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    type_ligne VARCHAR(50) NOT NULL, 
    base_calcul DECIMAL(12, 2),
    taux_salarial DECIMAL(7, 4),
    montant_salarial DECIMAL(12, 2),
    taux_patronal DECIMAL(7, 4),
    montant_patronal DECIMAL(12, 2),
    CONSTRAINT fk_ligne_fiche FOREIGN KEY (fiche_de_paie_id) REFERENCES fiche_de_paie (id) ON DELETE CASCADE
);

CREATE TABLE absence (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER NOT NULL,
    type_absence VARCHAR(50) NOT NULL, 
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut VARCHAR(20) DEFAULT 'EN_ATTENTE',
    CONSTRAINT fk_absence_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON DELETE CASCADE
);

CREATE TABLE compteur_conge (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER NOT NULL,
    type_conge VARCHAR(50) NOT NULL, 
    jours_acquis DECIMAL(5, 2) DEFAULT 0.00,
    jours_pris DECIMAL(5, 2) DEFAULT 0.00,
    CONSTRAINT fk_compteur_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON DELETE CASCADE
);
