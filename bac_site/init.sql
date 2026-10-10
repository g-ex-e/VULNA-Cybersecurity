-- 🔄 Réinitialisation
DROP TABLE IF EXISTS tickets, documents, users, roles CASCADE;

-- ───────────────────────────────
-- 📘 Rôles
-- ───────────────────────────────
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 👤 Utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL, -- stocké en clair pour la démo (⚠️ mauvaise pratique volontaire)
    role_id INTEGER REFERENCES roles(id)
);

-- 📄 Documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    filepath TEXT NOT NULL
);

-- 🛠️ Tickets
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    created_by INTEGER REFERENCES users(id),
    assigned_to INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL
);

-- ───────────────────────────────
-- 🎭 Insertion des rôles
-- ───────────────────────────────
INSERT INTO roles (name) VALUES
('employee'),  -- id = 1
('manager'),   -- id = 2
('admin'),     -- id = 3
('stagiaire');

-- ───────────────────────────────
-- 👥 Insertion des utilisateurs
-- ───────────────────────────────
INSERT INTO users (username, password, role_id) VALUES
('employee1', 'x@m@jp6J+wr%kGyU', 1), -- 1
('employee2', 'YX4uXH:WVrYej&%5', 1), -- 2
('employee3', '$8smym{tE#%g§7A<', 1), -- 3
('employee4', 'cH6bk!R7F8L8{%8L', 1), -- 4
('employee5', 'g3-{$9kv::6=a!Qq', 1), -- 5
('employee6', '_xv}~d-He4Hjv+<8', 1), -- 6
('employee7', 'yDx§bn{HjJ8~j({H', 1), -- 7
('employee8', '!.}yKynwr3=CP_.h', 1), -- 8
('manager1',  'y?G:Ka6Efk>bUaus', 2), -- 9
('employee10', '3!=_jVN~wv!d.&dK', 1), -- 10
('employee11', '+7N=w5Sj.&PhE%vu', 1), -- 11
('employee12', '6rq86zUqECch5f7d', 1), -- 12
('employee13', 'Zz}§dNCb&CE}§eUD', 1), -- 13
('employee14', '+VfYSdN#HK-C_7(P', 1), -- 14
('employee15', 'E)DK%Ht9:=N)kvf7', 1), -- 15
('employee16', '}Vh78W#@nj778XCx', 1), -- 16
('employee17', 'bf4k!3Bw,$s6qkK<', 1), -- 17
('employee18', '$ShgF§8p&WwCsKh3', 1), -- 18
('employee19', '(?q9DJkvqwTSnm:F', 1), -- 19
('employee20', 'z#}S}y!EtyV#9aPS', 1), -- 20
('employee21', 'gVPS_!m7)8Vh3%@(', 1), -- 21
('employee22', '6rq86zUqECch5f7d', 1), -- 22
('employee23', 'Zz}§dNCb&CE}§eUD', 1), -- 23
('employee24', '+VfYSdN#HK-C_7(P', 1), -- 24
('employee25', 'E)DK%Ht9:=N)kvf7', 1), -- 25
('employee26', '}Vh78W#@nj778XCx', 1), -- 26
('employee27', 'bf4k!3Bw,$s6qkK<', 1), -- 27
('employee28', '$ShgF§8p&WwCsKh3', 1), -- 28
('employee29', '(?q9DJkvqwTSnm:F', 1), -- 29
('employee30', 'z#}S}y!EtyV#9aPS', 1), -- 30
('employee31', '_xv}~d-He4Hjv+<8', 1), -- 31
('employee32', 'yDx§bn{HjJ8~j({H', 1), -- 32
('employee33', '!.}yKynwr3=CP_.h', 1), -- 33
('employee34', 'c#4}e,N§D)j-TENy', 1), -- 34
('employee35', '3!=_jVN~wv!d.&dK', 1), -- 35
('employee36', '+7N=w5Sj.&PhE%vu', 1), -- 36
('employee37', '6rq86zUqECch5f7d', 1), -- 37
('employee38', 'Zz}§dNCb&CE}§eUD', 1), -- 38
('employee39', 'Zz}§dNCb&CE}§eUD', 1), -- 38
('employee40', '+VfYSdN#HK-C_7(P', 1), -- 40
('employee41', 'E)DK%Ht9:=N)kvf7', 1), -- 41
('employee42', '}Vh78W#@nj778XCx', 1), -- 42
('employee43', 'bf4k!3Bw,$s6qkK<', 1), -- 43
('employee44', '$ShgF§8p&WwCsKh3', 1), -- 44
('employee45', '(?q9DJkvqwTSnm:F', 1), -- 45
('employee46', 'z#}S}y!EtyV#9aPS', 1), -- 46
('employee47', 'gVPS_!m7)8Vh3%@(', 1), -- 47
('employee48', '4566qsda5fDSGH5d', 1), -- 48
('stagiaire1', 'stagiaire1', 4), -- STAGIAIRE 49
('admin1', '6rq86zUqECch5f7d', 3); -- ADMIN (a desac acces profile) 50

-- ───────────────────────────────
-- 📎 Documents personnels
-- ───────────────────────────────
INSERT INTO documents (title, filepath, user_id) VALUES
('Fiche de paie Avril 2025 Camille Laurent', 'docs/12.pdf', 39), 
('Reglement Intérieur.pdf', '/docs/ReglementInterieur3.pdf', 1),
('Fiche de paie Avril 2025 Benjamin Mercier', 'docs/21.pdf', 17),
('Fiche de paie Avril 2025 Julie Marin', 'docs/6.pdf', 22),
('Planning RH.pdf', '/docs/planningrh2.pdf', 5),  
('Aide dev backend.pdf', '/docs/aide_backend.pdf', 6),
('Attestation de stage.pdf', '/docs/attestation_stage.pdf', 9), -- Manager
('Fiche de paie Avril 2025 Maxime Roux', 'docs/7.pdf', 13),
('Fiche de paie Avril 2025 Manon Garcia', 'docs/2.pdf', 11),
('Fiche de paie Avril 2025 Louis Caron', 'docs/4.pdf', 19),
('Reglement Intérieur.pdf', '/docs/ReglementInterieur4.pdf', 20),
('Nouveau Logo Corphub.pdf', '/docs/Nouveau_Logo_Corphub2.pdf', 2),
('Fiche de paie Avril 2025 Nathan Fontaine', 'docs/13.pdf', 31),
('Fiche de paie Avril 2025 Hugo Lemoine', 'docs/20.pdf', 36),
('Nouveau Logo Corphub.pdf', '/docs/Nouveau_Logo_Corphub3.pdf', 3),
('Fiche de paie Avril 2025 Sarah Adam', 'docs/10.pdf', 10),
('Fiche de paie Avril 2025 Sophie Dubois', 'docs/17.pdf', 27),
('Fiche de paie Avril 2025 Théo Bernard', 'docs/19.pdf', 20),
('Planning RH.pdf', '/docs/planningrh3.pdf', 7),
('Reglement Intérieur.pdf', '/docs/ReglementInterieur1.pdf', 39),
('Fiche de paie Avril 2025 Inès Lefevre', 'docs/5.pdf', 7),
('Aide dev backend.pdf', '/docs/aide_backend3.pdf', 13),
('Nouveau Logo Corphub.pdf', '/docs/Nouveau_Logo_Corphub4.pdf', 5),
('Fiche de paie Avril 2025 Julien Lefèvre', 'docs/9.pdf', 35),
('Fiche de paie Avril 2025 Alfred Boulo', 'docs/1.pdf', 4),
('Aide dev backend.pdf', '/docs/aide_backend2.pdf', 11),
('Fiche de paie Avril 2025 Romain Gauthier', 'docs/15.pdf', 24),
('Planning RH.pdf', '/docs/planningrh.pdf', 1),
('Fiche de paie Avril 2025 Clara Moreau', 'docs/18.pdf', 42),
('Problème accès admin', 'docs/probleme_acces_admin.pdf', 21), -- id docs : 30
('Nouveau Logo Corphub.pdf', '/docs/Nouveau_Logo_Corphub.pdf', 14),
('Reglement Intérieur.pdf', '/docs/ReglementInterieur2.pdf', 12),
('Fiche de paie Avril 2025 Chloé Girard', 'docs/8.pdf', 6),
('Fiche de paie Avril 2025 Léa Dupuis', 'docs/11.pdf', 47),
('Fiche de paie Avril 2025 Emma Richard', 'docs/16.pdf', 15),
('Fiche de paie Avril 2025 Lucas Perrin', 'docs/14.pdf', 2),
('Fiche de paie Avril 2025 Antoine Marchand', 'docs/3.pdf', 1),
('Convention de stage.pdf', '/docs/convention_stage.pdf', 49); -- Stagiaire

-- ───────────────────────────────
-- 🎫 Tickets de support
-- ───────────────────────────────
INSERT INTO tickets (created_by, assigned_to, title, message) VALUES
(1, 3, 'Demande d’accès', 'Je voudrais accéder au dashboard manager...'),
(2, 3, 'Ticket suspect', 'Le fichier /admin/reports/Q1-2025.pdf contient un token ?'),
(3, 1, 'Rapport RH', 'Un salarié demande à consulter ses stats personnelles');
