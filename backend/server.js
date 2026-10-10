const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5000;
const SECRET_KEY = "votre_secret_jwt";

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "projet_owasp",
  password: "password",
  port: 5432,
});

app.use(cors());
app.use(express.json());

// 📌 Inscription
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id, username",
      [username, hashedPassword]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

// 📌 Connexion
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur de connexion" });
  }
});

// 📌 Progression
const progressRoutes = require("./routes/progress");
app.use("/progress", progressRoutes);

// ✅ Route de base
app.get("/", (req, res) => {
  res.send("🚀 API Backend en cours d'exécution !");
});

// 📌 Récupérer username + statut tutoriel + date d'inscription
app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT username, has_seen_intro, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erreur serveur :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// 📌 Marquer le tutoriel comme vu
app.post("/user/:userId/seen-intro", async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query("UPDATE users SET has_seen_intro = TRUE WHERE id = $1", [userId]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Erreur serveur :", err.message);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

// 📊 Récupérer progression + temps passé pour l'utilisateur
app.get("/user/:userId/metrics", async (req, res) => {
  const { userId } = req.params;

  try {
    // 🔄 Récupérer la progression
    const progressResult = await pool.query(
      "SELECT module_id, progress FROM user_modules WHERE user_id = $1",
      [userId]
    );


    // 🎯 Conversion des progressions (de 0-1 vers 0-100)
    const moduleProgress = progressResult.rows.map(row => ({
      ...row,
      progress: row.progress * 100
    }));

    res.json({
      moduleProgress,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// 🎯 Lancement du serveur
app.listen(port, () => {
  console.log(`✅ Serveur démarré sur le port ${port}`);
});
