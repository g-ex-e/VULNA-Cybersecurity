require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { Pool } = require('pg');

const app = express();

// ───────────────────────────────
// 🔐 Session
// ───────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// ───────────────────────────────
// 📦 Middleware
// ───────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ───────────────────────────────
// 🎨 EJS / Views
// ───────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ───────────────────────────────
// 🛢️ Base de données
// ───────────────────────────────
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use((req, res, next) => {
  req.db = pool;
  next();
});

// ───────────────────────────────
// 🏠 Accueil
// ───────────────────────────────
app.get('/', (req, res) => {
  res.render('index', {
    user: req.session.user,
    docs: []
  });
});

// ───────────────────────────────
// 🔐 Login
// ───────────────────────────────
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('login', { error: 'Veuillez remplir tous les champs.' });
  }

  try {
    const result = await req.db.query(
      `SELECT users.*, roles.name AS role_name 
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE username = $1 AND password = $2`,
      [username, password]
    );

    if (result.rowCount === 1) {
      const user = result.rows[0];
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role_name
      };
      return res.redirect(`/profile?id=${user.id}`);
    } else {
      return res.render('login', { error: 'Identifiants incorrects.' });
    }
  } catch (err) {
    console.error('Erreur lors de la connexion :', err);
    res.status(500).send('Erreur interne du serveur.');
  }
});

// ───────────────────────────────
// 📄 Documents
// ───────────────────────────────
const documentsRoutes = require('./routes/documents');
app.use('/d0cs842k', documentsRoutes);

// ───────────────────────────────
// 👤 Profil utilisateur
// ───────────────────────────────
app.get('/profile', async (req, res) => {
  const currentUser = req.session.user;
  if (!currentUser) return res.redirect('/login');

  let userIdToView = currentUser.id;

  if (req.query.id) {
    userIdToView = parseInt(req.query.id, 10);
  }

  try {
    const userResult = await req.db.query(
      `SELECT users.*, roles.name AS role_name 
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE users.id = $1`,
      [userIdToView]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).send("Utilisateur non trouvé.");
    }

    const rawUser = userResult.rows[0];

    // 🔒 Si c’est un profil admin mais l’utilisateur connecté N’EST PAS cet admin → bloquer
    if (
      rawUser.role_name === 'admin' &&
      rawUser.id !== currentUser.id
    ) {
      return res.status(403).send("⛔ Accès interdit au profil administrateur.");
    }

    const userToDisplay = {
      id: rawUser.id,
      username: rawUser.username,
      role: rawUser.role_name
    };

    const docResult = await req.db.query(
      'SELECT * FROM documents WHERE user_id = $1',
      [userIdToView]
    );

    res.render('profile', {
      user: userToDisplay,
      docs: docResult.rows
    });
  } catch (err) {
    console.error("Erreur lors de l'affichage du profil :", err);
    res.status(500).send("Erreur serveur.");
  }
});



// ───────────────────────────────
// 🚪 Déconnexion
// ───────────────────────────────
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// ───────────────────────────────
// 🚀 Démarrage serveur
// ───────────────────────────────
const PORT = process.env.PORT || 1041;
app.listen(PORT, () => {
  console.log(`✅ Serveur corphub en ligne sur http://localhost:${PORT}`);
});
