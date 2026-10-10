const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const SHARED_FILE = path.join('/shared', 'server.js');

// Code par défaut à injecter si le fichier n'existe pas
const DEFAULT_CODE = `import express from 'express';
import cors from 'cors';
import inmailRoute from '/app/routes/inmail.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://host.docker.internal:5173'],
  methods: ['GET', 'POST']
}));

app.use(express.json());

app.use('/api/inmail', inmailRoute);

app.get('/', (req, res) => {
  res.send('Backend Docucloud UP port 3947');
});

export default app;`;

// Création du fichier s'il n'existe pas
if (!fs.existsSync(SHARED_FILE)) {
  fs.writeFileSync(SHARED_FILE, DEFAULT_CODE, 'utf-8');
}

router.post('/', (req, res) => {
  const { code } = req.body;

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Code invalide' });
  }

  try {
    fs.writeFileSync(SHARED_FILE, code, 'utf-8');
    res.status(200).json({ message: '✅ Code enregistré avec succès' });
  } catch (err) {
    console.error('Erreur lors de l\'écriture :', err);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du fichier' });
  }
});

router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(SHARED_FILE)) {
      return res.status(200).send('');
    }

    const content = fs.readFileSync(SHARED_FILE, 'utf-8');
    res.status(200).send(content);
  } catch (err) {
    console.error('Erreur lors de la lecture :', err);
    res.status(500).json({ error: 'Fichier introuvable ou illisible' });
  }
});

module.exports = router;
