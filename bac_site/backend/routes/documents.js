const express = require('express');
const path = require('path');
const router = express.Router();

// 🔐 Liste des documents de l'utilisateur connecté
router.get('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const userId = req.session.user.id;

  try {
    const result = await req.db.query(
      'SELECT * FROM documents WHERE user_id = $1',
      [userId]
    );

    return res.redirect('/profile'); // Les documents sont visibles sur la page profil
  } catch (err) {
    console.error('Erreur lors de la récupération des documents :', err);
    res.status(500).send("Erreur serveur.");
  }
});

// 🔓 Accès à un document via son ID — faille IDOR volontaire, AUCUN check
router.get('/:id', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const docId = req.params.id;

  try {
    const result = await req.db.query(
      'SELECT * FROM documents WHERE id = $1',
      [docId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Document introuvable.");
    }

    const doc = result.rows[0];

    // 💥 Faille IDOR : aucun contrôle de propriété ni de rôle
    res.sendFile(doc.filepath, {
      root: path.join(__dirname, '..', '..', 'public')
    });

  } catch (err) {
    console.error('Erreur d’accès au document :', err);
    res.status(500).send("Erreur serveur.");
  }
});

module.exports = router;
