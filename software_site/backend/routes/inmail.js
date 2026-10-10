import express from 'express';
import multer from 'multer';
import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ✅ On utilise getDocument directement
const getDocument = pdfjsLib.getDocument;

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const data = new Uint8Array(fs.readFileSync(filePath));

    // ✅ Worker désactivé ici pour éviter les erreurs dans Node.js
    const loadingTask = getDocument({
      data,
      worker: null, // <== Important
    });

    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map(item => item.str).join(' ');
      fullText += text + '\n';
    }

    const { email, subject } = req.body;

    const message = `
À : ${email}
Sujet : ${subject}

Bonjour,

Voici le contenu du document :

${fullText}

---

Document traité par docucloud/pdf-reader v1.0
Licence MIT — © 2024 — http://github.localhost:3698/
`;

    fs.unlinkSync(filePath); // 🧹 Nettoyage du fichier temporaire

    // ✅ Envoi du message au frontend
    res.json({ message });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du traitement du PDF' });
  }
});

export default router;
