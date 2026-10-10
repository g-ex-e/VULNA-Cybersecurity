import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SHARED_PATH = '/shared/server.js'; // ← ton backend modifiable en live

let currentServer = null;

const loadAndStartServer = async () => {
  try {
    const code = fs.readFileSync(SHARED_PATH, 'utf-8');
    if (!code.trim()) throw new Error('Code vide');

    const tempPath = path.join(__dirname, 'temp-server.mjs');
    fs.writeFileSync(tempPath, code);

    const modulePath = pathToFileURL(tempPath).href + `?t=${Date.now()}`;
    const dynamicModule = await import(modulePath);

    if (typeof dynamicModule.default?.listen !== 'function') {
      throw new Error('Aucun app.listen trouvé');
    }

    if (currentServer) {
      currentServer.close(() => console.log('🔁 Ancien backend arrêté.'));
    }

    currentServer = dynamicModule.default.listen(3947, () => {
      console.log('✅ Backend relancé depuis shared/server.js');
    });

  } catch (err) {
    if (currentServer) {
      currentServer.close(() => {
        currentServer = null;
        console.log('⚠️ Backend arrêté suite à une erreur.');
      });
    }
    console.error('❌ Erreur dans shared/server.js :', err.message);
  }
};

// Lancement initial uniquement si le fichier existe
if (fs.existsSync(SHARED_PATH)) {
  loadAndStartServer();
} else {
  console.warn('📭 Aucun fichier server.js trouvé. En attente de modifications...');
}

// Watch file : relance automatique à chaque modification
fs.watchFile(SHARED_PATH, () => {
  console.log('📄 Modification détectée dans shared/server.js');
  loadAndStartServer();
});
