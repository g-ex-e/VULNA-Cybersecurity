// backend/scripts/encryptContract.ts

import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

// 🔐 Paramètres
const PLAINTEXT_FILE = path.join(__dirname, "../data/contract.txt");
const ENCRYPTED_FILE = path.join(__dirname, "../data/contract.enc");
const SECRET_KEY = "eventia-secret"; // Clé faible volontaire
const ALGORITHM = "aes-128-ecb"; // ⚠️ Mode ECB sans IV

// 📂 Charger le fichier texte
if (!fs.existsSync(PLAINTEXT_FILE)) {
  console.error("❌ Le fichier contract.txt est introuvable !");
  process.exit(1);
}

const plaintext = fs.readFileSync(PLAINTEXT_FILE);

// 🛠️ Créer le cipher AES
const cipher = crypto.createCipheriv(
  ALGORITHM,
  Buffer.from(SECRET_KEY.padEnd(16, "\0")), // AES-128 → clé de 16 octets
  null // ECB = pas de vecteur d'initialisation
);

// 🔒 Chiffrer le contenu
let encrypted = cipher.update(plaintext);
encrypted = Buffer.concat([encrypted, cipher.final()]);

// 💾 Sauver
fs.writeFileSync(ENCRYPTED_FILE, encrypted);

console.log("✅ Fichier contract.enc généré avec succès !");
