const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const pg = require("pg");

const app = express();
const port = 8081;

// ✅ Configuration des sessions
app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true } // ⚠️ Protection contre attaques XSS
}));

// ✅ Middleware pour traiter les requêtes JSON et URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Configuration des fichiers statiques (corrige le problème du logo)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("views"));

// 🔥 Désactiver les protections qui bloquent l'iframe
app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *");
    next();
});

// ✅ Connexion à la base PostgreSQL
const pool = new pg.Pool({
    user: "user",
    host: "neomarketdb",
    database: "neomarketdb",
    password: "f5SFbvns8acHGFD854sq",
    port: 5432,
});

// ✅ Middleware d'authentification pour protéger les pages
function requireAuth(role) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect("/login"); // ⛔ Empêche l'accès sans session
        }
        if (role && req.session.user.role !== role) {
            return res.status(403).send("⛔ Accès refusé !");
        }
        next();
    };
}

// ✅ Routes pour servir les fichiers HTML
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "views", "login.html")));
app.get("/dashboard", requireAuth("employee"), (req, res) => res.sendFile(path.join(__dirname, "views", "dashboard.html")));
app.get("/vip", requireAuth("admin"), (req, res) => res.sendFile(path.join(__dirname, "views", "vip.html")));
app.get("/logout", (req, res) => res.sendFile(path.join(__dirname, "views", "logout.html")));

// 📌 Route vulnérable à l'injection SQL dans le login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // **⚠️ Vulnérabilité SQL volontaire !**
    const query = `SELECT id::TEXT, username, role FROM users WHERE username = '${username}' AND password = '${password}'`;

    console.log("🔍 Requête SQL exécutée : ", query);

    try {
        const result = await pool.query(query);
        console.log("📊 Résultats SQL : ", result.rows);

        if (result.rows.length === 1) {
            req.session.user = result.rows[0];

            if (result.rows[0].role === "admin") {
                return res.json({ success: true, redirect: "/vip" });
            } else if (result.rows[0].role === "employee") {
                return res.json({ success: true, redirect: "/dashboard" });
            } else {
                return res.json({ success: false, message: "❌ Rôle inconnu !" });
            }
        }

        // ✅ Si injection réussie : afficher les résultats sans bloquer
        if (result.rows.length > 1) {
            return res.json({ success: false, message: '', data: result.rows });
        }

        res.json({ success: false, message: "❌ Identifiants incorrects !" });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: `${err.message}` });
    }
});

// ✅ Route Déconnexion - Corrigée pour bien supprimer la session
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("❌ Erreur lors de la déconnexion :", err);
        }
        res.clearCookie("connect.sid", { path: "/" }); // ✅ Supprime explicitement le cookie de session
        return res.redirect("/login"); // ✅ Redirige proprement vers login
    });
});

// ✅ Lancement du serveur
app.listen(port, () => {
    console.log(`🚀 Site vulnérable disponible sur http://localhost:${port}`);
});
