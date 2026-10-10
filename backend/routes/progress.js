const express = require("express");
const router = express.Router();
const pool = require("../db"); // Connexion à PostgreSQL

// 📌 Récupérer la progression pour un utilisateur
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            "SELECT module_id, progress FROM user_modules WHERE user_id = $1",
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur serveur");
    }
});

// 📌 Mettre à jour la progression pour un utilisateur et un module
router.post("/update", async (req, res) => {
    try {
        console.log("🔄 Requête reçue pour mise à jour :", req.body);
        const { userId, moduleId, increment } = req.body;

        // Vérifier la progression actuelle
        const result = await pool.query(
            "SELECT progress FROM user_modules WHERE user_id = $1 AND module_id = $2",
            [userId, moduleId]
        );

        let newProgress = increment;

        if (result.rows.length > 0) {
            newProgress = Math.min(1, parseFloat(result.rows[0].progress) + increment); // ✅ Empêche de dépasser 1.0 (100%)
            await pool.query(
                "UPDATE user_modules SET progress = $1 WHERE user_id = $2 AND module_id = $3",
                [newProgress, userId, moduleId]
            );
            console.log("✅ Progression mise à jour :", newProgress);
        } else {
            await pool.query(
                "INSERT INTO user_modules (user_id, module_id, progress) VALUES ($1, $2, $3)",
                [userId, moduleId, newProgress]
            );
            console.log("🆕 Nouvelle entrée ajoutée :", { userId, moduleId, newProgress });
        }

        res.json({ success: true, progress: newProgress });
    } catch (err) {
        console.error("❌ Erreur serveur :", err.message);
        res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
});



module.exports = router;
