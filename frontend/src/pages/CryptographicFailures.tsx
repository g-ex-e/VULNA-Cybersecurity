import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SunIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import logoWhite from "../assets/logo_white.png";
import logoBlack from "../assets/logo_black.png";
import { useNavigate } from "react-router-dom";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { AnimatePresence } from "framer-motion";


const CryptographicFailures: React.FC = () => {
  const [isBottom, setIsBottom] = useState(false);
const [quizStep, setQuizStep] = useState(0); // ✅ Indice de la question actuelle

  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("darkMode") === "false" ? false : true
  );

  const [stepIndex, setStepIndex] = useState(0);

const [quizAnswers, setQuizAnswers] = useState(["", "", "", "", ""]);
const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
const [progress, setProgress] = useState(0); // ✅ Gère la progression actuelle du module
const [isRestarting, setIsRestarting] = useState(false);
const [isInfoOpen, setIsInfoOpen] = useState(false);

// ✅ Données générales à adapter selon la vulnérabilité
const moduleContextInfo = {
  iframeSupport: false, // false = nécessite un nouvel onglet
  terminalUsage: "non" // "non" | "optionnel" | "requis"
};

// ✅ Liste des questions du quizz
const quizQuestions = [
  {
    question: "🛡️ Quel scénario illustre le mieux un échec cryptographique ?",
    choices: [
      "Un token d'authentification est stocké en clair dans un fichier JavaScript accessible publiquement.",
      "Un utilisateur fait une faute de frappe en saisissant son mot de passe.",
      "Un site affiche une alerte 'Maintenance en cours' pendant une mise à jour."
    ],
    answer: "Un token d'authentification est stocké en clair dans un fichier JavaScript accessible publiquement."
  },
  {
    question: "🔑 Quel est l'algorithme JWT utilisé par Eventia ?",
    answer: "HS256"
  },
  {
    question: "🛡️ Quel est le token JWT de l'admin Eventia ?",
    answer: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV2ZW50aWEuY29tIiwicm9sZSI6ImFkbWluIn0.52TJkZVncSY64Sh2Eaa5Cv3KCpypuuniShxzIU_VvqQ",
    hint: "https://jwt.io/"
  },
  {
    question: "🔒 Quel algorithme de chiffrement est utilisé pour crypter le fichier 'contract.enc' ?",
    answer: "AES"
  },
  {
    question: "📧 Quel est le contact client du nouveau contrat confidentiel ?",
    answer: "julie.durand@grandhotel.com",
    hint: "https://gchq.github.io/CyberChef/"
  }
];



const fetchProgress = useCallback(async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    console.log("🔄 Récupération de la progression...");
    const response = await fetch(`http://localhost:5000/progress/${userId}`);
    const data = await response.json();
    const moduleProgress = data.find((p) => p.module_id === 5);

    if (moduleProgress) {
      const progressValue = parseFloat(moduleProgress.progress);
      setProgress(progressValue);
      console.log("📊 Progression actuelle :", progressValue);

      if (progressValue >= 1) {
        setQuizStep(quizQuestions.length); // 🔥 Aller à la fin du quizz si à 100%
      } else {
        setQuizStep(Math.floor(progressValue * quizQuestions.length));
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de la progression :", error);
  }
}, [setProgress, quizQuestions.length]); // ✅ Ajoute quizQuestions.length dans les dépendances



const updateProgress = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    // 🔄 Récupérer la progression actuelle AVANT l'incrémentation
    const response = await fetch(`http://localhost:5000/progress/${userId}`);
    const data = await response.json();
    const moduleProgress = data.find((p) => p.module_id === 5);

    let currentProgress = moduleProgress ? parseFloat(moduleProgress.progress) : 0;

    if (currentProgress >= 1) {
      console.log("🎉 Progression déjà complète, mise à jour annulée.");
      return;
    }

    const newProgress = Math.min(1, currentProgress + 0.2);
    setProgress(newProgress); // ✅ Met à jour l'état local après mise à jour
        
    console.log("🔄 Envoi de la mise à jour de la progression...");
    await fetch("http://localhost:5000/progress/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: parseInt(userId),
        moduleId: 5,
        increment: 0.2,
      }),
    });

    // 🆕 Récupérer la nouvelle progression depuis le serveur après l'update
    fetchProgress();
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de la progression :", error);
  }
};



// ✅ Vérifie que la mise à jour de la progression est bien appelée après une bonne réponse :
const handleQuizAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  const newAnswers = [...quizAnswers];
  newAnswers[quizStep] = value;
  setQuizAnswers(newAnswers);

  if (isRestarting) return; // ✅ Bloque les réponses pendant la réinitialisation

  if (value.toLowerCase().trim() === quizQuestions[quizStep].answer.toLowerCase()) {
    setIsCorrect(true);
  
    // 🔄 Met immédiatement à jour la question suivante
    setQuizStep((prev) => prev + 1);
    
    updateProgress(); 
  
    setTimeout(() => {
      setIsCorrect(null);
    }, 1000);
  } else {
    setIsCorrect(false);
  }  
};

const handleQCMAnswer = (choice: string) => {
  if (isRestarting) return;

  const newAnswers = [...quizAnswers];
  newAnswers[quizStep] = choice;
  setQuizAnswers(newAnswers);

  if (choice === quizQuestions[quizStep].answer) {
    setIsCorrect(true);
    setQuizStep((prev) => prev + 1);
    updateProgress();
    setTimeout(() => setIsCorrect(null), 1000);
  } else {
    setIsCorrect(false);
  }
};



useEffect(() => {
  localStorage.setItem("darkMode", JSON.stringify(darkMode));

  const handleScroll = () => {
    setIsBottom(window.innerHeight + window.scrollY >= document.body.offsetHeight);
  };
  window.addEventListener("scroll", handleScroll);
  
  fetchProgress();

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [fetchProgress, darkMode]); // ✅ Garde fetchProgress mais maintenant il est stable

useEffect(() => {
  // 🔍 Calculer le bon quizStep en fonction du progrès
  const calculatedStep = Math.floor(progress * quizQuestions.length);
  
  // ✅ On ne met à jour quizStep que si la nouvelle valeur est supérieure
  setQuizStep((prev) => (calculatedStep > prev ? calculatedStep : prev));
}, [progress, quizQuestions.length]); 





// 🔥 Étapes d’exploitation d’une faiblesse cryptographique
const steps = [
  {
    title: "🔍 Étape 1 : Repérer des configurations exposées",
    description:
      "Un attaquant commence par analyser les ressources publiques du site à la recherche de fichiers de configuration ou de paramètres exposés.",
    example: "Exemple : détection d'un fichier contenant des URLs d'API ou des paramètres d'authentification",
    explanation:
      "Un fichier mal protégé peut révéler des informations sensibles comme des chemins internes ou des secrets applicatifs.",
  },
  {
    title: "🧩 Étape 2 : Analyser les méthodes d'authentification",
    description:
      "Il inspecte la manière dont l'authentification est gérée, notamment le type d'algorithme cryptographique utilisé pour signer ou protéger les sessions.",
    example: "Exemple : usage d'une clé statique faible pour signer des tokens JWT",
    explanation:
      "Des algorithmes obsolètes ou des clés prédictibles fragilisent la sécurité des échanges utilisateurs.",
  },
  {
    title: "✏️ Étape 3 : Tester la robustesse des secrets",
    description:
      "L'attaquant cherche à déterminer la solidité réelle des clés ou secrets utilisés en analysant leur longueur, leur entropie et leur gestion.",
    example: "Exemple : un secret d'API ou de token trop court et facilement devinable",
    explanation:
      "Des secrets faibles rendent possible la falsification ou la création de tokens valides sans autorisation.",
  },
  {
    title: "⚠️ Étape 4 : Identifier l'absence de mécanismes de protection supplémentaires",
    description:
      "Il vérifie si des mesures supplémentaires comme la validation des signatures ou la rotation régulière des secrets sont absentes.",
    example: "Exemple : tokens JWT acceptés même après expiration ou sans validation complète",
    explanation:
      "Un manque de vérifications strictes permettrait l'usage abusif de jetons ou la persistance de sessions compromises.",
  },
  {
    title: "🛠 Étape 5 : Exploiter les flux de données non sécurisés",
    description:
      "L'attaquant surveille si certaines communications client-serveur contiennent des données sensibles mal protégées ou mal chiffrées.",
    example: "Exemple : transmission d'informations personnelles via une requête API en clair",
    explanation:
      "Sans sécurisation adaptée, les données captées peuvent être lues, altérées ou détournées lors de leur transit.",
  },
  {
    title: "📉 Étape 6 : Bénéficier de l'absence de surveillance ou de réponses aux anomalies",
    description:
      "Enfin, l'absence de systèmes de détection ou d'alertes sur les anomalies cryptographiques rend les actions malveillantes durables et indétectables.",
    example: "Exemple : aucune alerte lorsqu'un token est utilisé au-delà de sa durée de validité",
    explanation:
      "Un environnement sans surveillance laisse la porte ouverte à des exploitations prolongées sans intervention rapide.",
  },
];




  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen flex flex-col items-center transition-all duration-500 
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {/* ✅ Logo & Titre positionnés comme sur Dashboard */}
      <div className="text-center mt-10">
        <img
          src={darkMode ? logoWhite : logoBlack}
          alt="Logo"
          className="mx-auto h-auto transition-all duration-500 w-64 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        />
        <h1 className={`text-4xl font-bold mt-4 transition-all duration-500 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Cryptographic Failures
        </h1>
      </div>
{/* ✅ Explication des types d'échecs cryptographiques (présentation moderne) */}
<motion.div
  className={`mt-16 w-3/4 p-6 rounded-lg shadow-lg 
  ${darkMode ? "bg-gray-800" : "bg-white"} transition-all duration-500`}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h2 className="text-2xl font-semibold">🛡️ Exemples de Cryptographic Failures</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
      <h3 className="font-semibold">🔓 Stockage de mots de passe en clair</h3>
      <p className="text-sm mt-2">
        Des mots de passe utilisateurs sont enregistrés sans chiffrement dans la base de données, exposant les comptes en cas de fuite.
      </p>
    </div>
    <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
      <h3 className="font-semibold">🔑 Utilisation d'algorithmes obsolètes</h3>
      <p className="text-sm mt-2">
        L'application utilise des algorithmes faibles comme MD5 ou SHA1 pour signer ou chiffrer des données sensibles.
      </p>
    </div>
    <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
      <h3 className="font-semibold">📤 Transmission non sécurisée</h3>
      <p className="text-sm mt-2">
        Les données sensibles, comme les identifiants, sont envoyées sans chiffrement (HTTP au lieu de HTTPS), facilitant les interceptions.
      </p>
    </div>
  </div>
  <p className="mt-6">
    Les échecs cryptographiques exposent des informations sensibles ou critiques en compromettant leur confidentialité, intégrité ou authenticité. Une implémentation rigoureuse des mécanismes de sécurité est indispensable pour protéger les utilisateurs.
  </p>
</motion.div>



      {/* ✅ Étapes avec navigation */}
      <div className="mt-10 w-3/4 space-y-6">
        <motion.div
          className={`p-6 rounded-lg shadow-md transition-all duration-500 
          ${darkMode ? "bg-gray-800" : "bg-white"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold">{steps[stepIndex].title}</h3>
          <p className="mt-2">{steps[stepIndex].description}</p>
          <pre className={`p-3 rounded mt-4 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
            {steps[stepIndex].example}
          </pre>
          <p className="mt-2">{steps[stepIndex].explanation}</p>
        </motion.div>

        {/* ✅ Navigation Suivant / Précédent (Alignement uniformisé) */}
        <div className="flex justify-between mt-4 w-full">
          {stepIndex > 0 && (
            <button
              onClick={() => setStepIndex(stepIndex - 1)}
              className="flex items-center px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Précédent
            </button>
          )}
          {stepIndex < steps.length - 1 && (
            <button
              onClick={() => setStepIndex(stepIndex + 1)}
              className="flex items-center px-6 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ml-auto"
            >
              Suivant
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      </div>

     <motion.div
  className={`mt-10 w-3/4 max-w-2xl rounded-lg shadow-md transition-all duration-500 mx-auto
  ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
>
  {/* 🔘 En-tête compact */}
  <div className="px-6 py-4 relative">
    <h2 className="text-lg font-semibold text-center">🧭 Informations sur l’environnement</h2>
    <button
      onClick={() => setIsInfoOpen(!isInfoOpen)}
      className={`absolute right-6 top-1/2 -translate-y-1/2 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center 
        transition-all duration-300 
        ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
    >
      {isInfoOpen ? "−" : "+"}
    </button>
  </div>

  {/* ✅ Contenu animé via AnimatePresence */}
  <AnimatePresence initial={false}>
    {isInfoOpen && (
      <motion.div
        key="details"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden border-t"
      >
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Iframe info */}
            <div className={`rounded-lg p-4 border-l-4 shadow 
              ${moduleContextInfo.iframeSupport 
                ? "border-green-500 bg-green-50 text-green-800" 
                : "border-red-500 bg-red-50 text-red-800"}`}>
              <h4 className="font-semibold text-sm mb-1">🧩 Réalisable dans l’iframe</h4>
              <p className="text-xs">
                {moduleContextInfo.iframeSupport 
                  ? "Toutes les étapes peuvent être effectuées dans l'encadré intégré."
                  : "Certaines actions nécessitent l'ouverture du site dans un onglet externe."}
              </p>
            </div>

            {/* Terminal info */}
            <div className={`rounded-lg p-4 border-l-4 shadow 
              ${moduleContextInfo.terminalUsage === "non"
                ? "border-green-500 bg-green-50 text-green-800"
                : moduleContextInfo.terminalUsage === "optionnel"
                ? "border-yellow-500 bg-yellow-50 text-yellow-800"
                : "border-red-500 bg-red-50 text-red-800"}`}>
              <h4 className="font-semibold text-sm mb-1">💻 Utilisation du terminal</h4>
              <p className="text-xs">
                {moduleContextInfo.terminalUsage === "non"
                  ? "Le terminal n'est pas requis pour ce module."
                  : moduleContextInfo.terminalUsage === "optionnel"
                  ? "Le terminal peut aider à aller plus vite, mais n’est pas nécessaire."
                  : "L'exécution de ce module nécessite des commandes via un terminal Linux."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>


{/* ✅ Iframe principal – positionné juste après le bloc */}
<div className="mt-6 relative w-3/4 h-[600px] border-2 border-gray-400 rounded-lg overflow-hidden mx-auto">
  <motion.div
    className="absolute top-2 right-6 bg-gray-800 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow-md"
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    🔗 URL : 
    <a 
      href="http://host.docker.internal:7988/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="ml-1 text-blue-400 hover:text-blue-300 underline"
    >
      http://host.docker.internal:7988/
    </a>
  </motion.div>

  {/* ✅ Iframe du site */}
  <iframe
    src="http://localhost:7988/"
    className="w-full h-full"
    title="Crypto site"
  ></iframe>
</div>

{/* ✅ Quizz */}

<motion.div 
  className={`mt-16 w-2/3 max-w-2xl p-6 rounded-lg shadow-lg transition-all duration-500 
  ${darkMode ? "bg-gray-800" : "bg-white"}`} 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.5 }}
>
  <h2 className="text-2xl font-semibold text-center">🧠 Quizz</h2>

  {/* ✅ Message de fin du quizz stylisé */}
  {quizStep < quizQuestions.length ? (
    <>
    <p className="mt-4 text-center">{quizQuestions[quizStep].question}</p>
    {/* ✅ Bouton Indice pour les questions 3 et 4 */}
    {quizQuestions[quizStep].hint && (
  <div className="flex justify-center flex-col items-center mt-4 space-y-2">
    {(Array.isArray(quizQuestions[quizStep].hint) ? quizQuestions[quizStep].hint : [quizQuestions[quizStep].hint]).map((url, i) => (
      <a 
        key={i}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300
        bg-purple-500 hover:bg-purple-600 text-white"
      >
        💡 Indice 
      </a>
    ))}
  </div>
)}

  </>
    
  ) : (
    <motion.div 
      className={`mt-6 p-4 rounded-lg text-center text-xl font-semibold shadow-md 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
    >
      🎉 <span className="text-3xl">Félicitations !</span> 🎉  
      <p className="text-lg mt-2">Vous avez terminé le quizz avec succès !</p>
    </motion.div>
  )}

  {/* ✅ Bouton "Rejouer le quizz" mieux centré et avec animation */}
  {progress >= 1 && quizStep >= quizQuestions.length && !isRestarting && (
    <motion.div 
      className="flex justify-center mt-6" 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => {
          setIsRestarting(true); // ✅ Cache le bouton après un clic
          setQuizStep(0); // 🔄 Réinitialiser le quiz
          setQuizAnswers(["", "", "", "", ""]); // 🔄 Reset des réponses
          setIsCorrect(null); // ✅ Réinitialise l'état de validation
          setTimeout(() => setIsRestarting(false), 500); // ✅ Permet d'éviter un blocage
        }}
        className={`px-6 py-3 rounded-lg shadow-lg transition-all duration-300 text-lg flex items-center gap-2 
        ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-black hover:bg-gray-300"}`}
      >
        🔄 Rejouer le quizz
      </button>
    </motion.div>
  )}

  {/* ✅ Barre de réponse stylisée */}
  {quizStep < quizQuestions.length && (
  <>
    {quizQuestions[quizStep].choices ? (
      <div className="mt-6 flex flex-col items-center space-y-3">
        {quizQuestions[quizStep].choices.map((choice, index) => (
          <button
            key={index}
            className={`px-6 py-3 w-2/3 rounded-lg text-lg shadow-md transition-all duration-300
            ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-black hover:bg-gray-300"}
            ${quizAnswers[quizStep] === choice ? (isCorrect ? "border-green-600 shadow-lg shadow-green-400" : "border-red-600 shadow-lg shadow-red-400") : "border-gray-400"}`}
            onClick={() => handleQCMAnswer(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
    ) : (
      <div className="flex justify-center mt-6">
        <input 
          type="text" 
          value={quizAnswers[quizStep]} 
          onChange={handleQuizAnswer} 
          className={`p-3 w-2/3 text-center rounded border-4 transition-all duration-300
          ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}
          ${isCorrect === null ? "border-gray-400" : isCorrect ? "border-green-600 shadow-lg shadow-green-400" : "border-red-600 shadow-lg shadow-red-400"}`}
        />
      </div>
    )}
  </>
)}

</motion.div>



{/* ✅ Comment s'en prémunir ? */}
<motion.div
  className={`mt-16 w-3/4 p-6 rounded-lg shadow-lg transition-all duration-500 
  ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h2 className="text-2xl font-semibold text-center">🛡️ Comment s'en prémunir ?</h2>

  <p className="mt-4 text-center">
    Les failles cryptographiques surviennent lorsque des mécanismes de protection sont mal implémentés ou insuffisants. Voici quelques <strong>bonnes pratiques</strong> pour renforcer la sécurité :
  </p>

  {/* ✅ Bonnes pratiques en carte */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    
    {/* Gestion sécurisée des secrets */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🔐 Protéger les secrets d'application</h3>
      <p className="text-sm mt-2">
        Stockez vos clés et secrets dans des environnements sécurisés et évitez de les exposer dans les fichiers publics.
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"// Exemple : Variables d'environnement"}
        {"\nprocess.env.JWT_SECRET"}
      </pre>
    </motion.div>

    {/* Algorithmes robustes */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🛡️ Utiliser des algorithmes fiables</h3>
      <p className="text-sm mt-2">
        Privilégiez des standards reconnus (ex: AES-256, SHA-256, RS256) pour la signature ou le chiffrement de vos données sensibles.
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"// Exemple : JWT avec RS256"}
        {"\njwt.sign(payload, privateKey, { algorithm: 'RS256' });"}
      </pre>
    </motion.div>

    {/* Validation stricte */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🔎 Vérifier systématiquement les signatures</h3>
      <p className="text-sm mt-2">
        Assurez-vous que toutes les signatures, tokens et certificats soient systématiquement validés avant traitement.
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"// Exemple : Vérification JWT"}
        {"\njwt.verify(token, publicKey, { algorithms: ['RS256'] });"}
      </pre>
    </motion.div>

    {/* Rotation régulière des clés */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🔄 Mettre en place une rotation des clés</h3>
      <p className="text-sm mt-2">
        Changez régulièrement vos clés et secrets pour limiter l'impact en cas de fuite ou de compromission.<p>‎ </p>
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"// Exemple : Rotation programmée"}
        {"\nrotateKeys({ interval: '30d' });"}
      </pre>
    </motion.div>

  </div>
</motion.div>



<div className="h-32"></div> {/* ✅ Ajout d'espace sous l'iframe pour le scroll */}



{/* ✅ Bouton de Scroll Progressif */}
<button
  onClick={() => {
    window.scrollTo({
      top: isBottom ? 0 : document.body.scrollHeight,
      behavior: "smooth",
    });
  }}
  className="fixed bottom-10 left-10 bg-blue-500 hover:bg-blue-600 p-4 rounded-full transition-all duration-300 shadow-lg hover:scale-110"
>
  {isBottom ? (
    <ArrowUpIcon className="h-6 w-6 text-white" />
  ) : (
    <ArrowDownIcon className="h-6 w-6 text-white" />
  )}
</button>


      {/* ✅ Bouton Dark Mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-10 right-10 bg-yellow-500 hover:bg-yellow-600 p-4 rounded-full transition-all duration-300 shadow-lg hover:scale-110"
      >
        <SunIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

export default CryptographicFailures;
