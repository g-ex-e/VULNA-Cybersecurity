import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SunIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import logoWhite from "../assets/logo_white.png";
import logoBlack from "../assets/logo_black.png";
import { useNavigate } from "react-router-dom";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { AnimatePresence } from "framer-motion";


const SSRF: React.FC = () => {
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
  terminalUsage: "requis" // "non" | "optionnel" | "requis"
};


// ✅ Liste des questions du quizz
const quizQuestions = [
  { 
    question: "📌 Quelle affirmation est correcte à propos de l’attaque SSRF ?", 
    choices: [
      "SSRF permet à un attaquant d'exécuter du code directement sur le serveur cible.",
      "SSRF est une attaque où un serveur effectue des requêtes HTTP à la place de l'attaquant.",
      "SSRF ne concerne que les sites avec authentification et ne peut pas être exploité autrement."
    ],
    answer: "SSRF est une attaque où un serveur effectue des requêtes HTTP à la place de l'attaquant."
  },
  { 
    question: "☁️ Quel service cloud est souvent ciblé avec une attaque SSRF via l’URL http://169.254.169.254/latest/meta-data/ ?", 
    answer: "AWS"
  },
  { 
    question: "🌍 À l’aide de ffuf, scanne les endpoints accessibles sur le serveur avec la wordlist common.txt située dans /wordlists.\nQuel est le troisième endpoint trouvé dans les résultats ?", 
    answer: "dashboard"
  },
  { 
    question: "🔓 Une fois ces endpoints trouvés, teste son accès directement dans le navigateur.\nQuel code HTTP le serveur retourne-t-il pour indiquer que l’endpoint est bien présent mais protégé ?", 
    answer: "403"
  },
  { 
    question: "🔑 Quel est le mot de passe de l’administrateur du site ?", 
    answer: "p@ssw0rd!Secure"
  }
];




const fetchProgress = useCallback(async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    console.log("🔄 Récupération de la progression...");
    const response = await fetch(`http://localhost:5000/progress/${userId}`);
    const data = await response.json();
    const moduleProgress = data.find((p) => p.module_id === 2);

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
    const moduleProgress = data.find((p) => p.module_id === 2);

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
        moduleId: 2,
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
  if (progress >= 1) return; // 🛡️ Protection si le quiz est déjà terminé
  const calculatedStep = Math.floor(progress * quizQuestions.length);
  setQuizStep((prev) => (calculatedStep > prev ? calculatedStep : prev));
}, [progress, quizQuestions.length]);



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



  // 🔥 Liste des étapes d'injection SQL
  const steps = [
    {
      title: "🔍 Étape 1 : Découverte des endpoints internes",
      description:
        "L'attaquant commence par chercher des endpoints internes qui pourraient être accessibles via des requêtes serveur.",
      example:
        "Utilisation d'outils comme dirb, gobuster, ffuf pour scanner l'application et identifier des endpoints cachés.",
      explanation:
        "Les applications web contiennent souvent des pages ou APIs non documentées qui permettent d'interagir avec d'autres services internes."
    },
    {
      title: "🕵️ Étape 2 : Identifier les entrées vulnérables",
      description:
        "L'attaquant analyse les fonctionnalités de l'application qui acceptent des URLs en entrée et les utilisent pour faire des requêtes côté serveur.",
      example:
        "Rechercher des pages comme `image proxy`, `URL fetcher`, `PDF generator` ou des champs de formulaire qui prennent une URL en paramètre.",
      explanation:
        "Si l'application ne valide pas correctement ces URLs, elle pourrait permettre de faire des requêtes non autorisées vers des services internes."
    },
    {
      title: "🛠 Étape 3 : Tester l'exploitation SSRF",
      description:
        "L'attaquant tente d'envoyer des requêtes vers différentes adresses pour voir si elles sont exécutées par le serveur.",
      example:
        "Tester avec des URLs comme http://localhost:8000/admin, http://169.254.169.254/latest/meta-data` (AWS), ou encore http://internal-db.local/query.",
      explanation:
        "Si l'application traite ces requêtes et renvoie du contenu, l'attaquant peut accéder à des ressources internes normalement inaccessibles."
    },
    {
      title: "🎯 Étape 4 : Escalade et exfiltration",
      description:
        "Une fois l'exploitation confirmée, l'attaquant peut utiliser SSRF pour obtenir des informations sensibles ou interagir avec des services internes.",
      example:
        "Récupération de clés API, tokens d’authentification, données internes, ou même ouverture d’une session SSH via un accès détourné.",
      explanation:
        "SSRF peut permettre d'accéder à des serveurs de bases de données, des services d’administration REST, ou des services cloud exposés."
    },
    {
      title: "🚨 Étape 5 : Actions post-exploitation",
      description:
        "L'attaquant utilise l'accès SSRF pour aller plus loin dans l'intrusion et compromettre d'autres systèmes.",
      example:
        "Utilisation de l’accès SSRF pour scanner le réseau interne (nmap` via SSRF), extraire des fichiers de configuration sensibles, ou injecter des commandes.",
      explanation:
        "Une SSRF avancée peut conduire à une exploitation de services internes, du mouvement latéral, ou encore une prise de contrôle totale."
    }
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
        Server-Side Request Forgery (SSRF)
        </h1>
      </div>
{/* ✅ Explication de la vulnérabilité SSRF (présentation moderne) */}
<motion.div
  className={`mt-16 w-3/4 p-6 rounded-lg shadow-lg 
  ${darkMode ? "bg-gray-800" : "bg-white"} transition-all duration-500`}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h2 className="text-2xl font-semibold">🔍 Server-Side Request Forgery (SSRF)</h2>
  <p className="mt-2 text-sm">
    L'attaque SSRF permet à un attaquant d'utiliser un serveur vulnérable pour effectuer des requêtes internes et accéder à des ressources protégées.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
      <h3 className="font-semibold">🌐 Exploration des endpoints</h3>
      <p className="text-sm mt-2">
        L'attaquant utilise des outils comme <strong>dirb</strong>, <strong>gobuster</strong> ou <strong>ffuf</strong> pour découvrir des URLs internes accessibles.
      </p>
    </div>
    <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
      <h3 className="font-semibold">🚪 Accès aux services internes</h3>
      <p className="text-sm mt-2">
        En exploitant une entrée vulnérable, l'attaquant peut interroger des services internes non exposés.
      </p>
    </div>
    <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
      <h3 className="font-semibold">🔑 Extraction de données sensibles</h3>
      <p className="text-sm mt-2">
        SSRF peut être utilisé pour récupérer des <strong>clés API</strong>, <strong>tokens d'authentification</strong> ou <strong>informations confidentielles</strong>.
      </p>
    </div>
  </div>

  <p className="mt-6">
    Les applications mal protégées permettent aux attaquants d'accéder à des ressources internes via SSRF.
    Il est crucial de restreindre les requêtes sortantes et de valider correctement les URLs fournies par l'utilisateur.
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
      href="http://host.docker.internal:5050/visualizer" 
      target="_blank" 
      rel="noopener noreferrer"
      className="ml-1 text-blue-400 hover:text-blue-300 underline"
    >
      http://host.docker.internal:5050/visualizer/
    </a>
  </motion.div>


  {/* ✅ Iframe du site */}
  <iframe
    src="http://localhost:5050/visualizer"
    className="w-full h-full"
    title="Site vulnérable Injection SQL"
  ></iframe>
</div>


            {/* ✅ Ajout de l'iframe et espace en dessous pour le scroll */}
            <div className="mt-16 w-3/4 h-[600px] border-2 border-gray-400 rounded-lg overflow-hidden">
        <iframe
          src="http://localhost:2223/"
          className="w-full h-full"
          title="Site vulnérable Injection SQL"
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
{/* ✅ Vérifier que quizStep ne dépasse pas la longueur du quizz */}
{quizStep < quizQuestions.length ? (
  <>
    <p className="mt-4 text-center">{quizQuestions[quizStep].question}</p>

    {/* ✅ Bouton Indice pour les questions 3 et 4 */}

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



{/* ✅ Affichage conditionnel pour masquer l'input et le QCM à la fin du quiz */}
{quizStep < quizQuestions.length && (
  <>
    {/* ✅ Vérifie si la question a des choix (QCM) */}
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


{/* ✅ Comment se protéger contre SSRF ? */}
<motion.div
  className={`mt-16 w-3/4 p-6 rounded-lg shadow-lg transition-all duration-500 
  ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h2 className="text-2xl font-semibold text-center">🛡️ Comment se protéger contre le SSRF ?</h2>

  <p className="mt-4 text-center">
    Les attaques SSRF exploitent la capacité d'un serveur à effectuer des requêtes HTTP vers des adresses arbitraires. 
    Voici quelques **bonnes pratiques** pour vous en prémunir :
  </p>

  {/* ✅ Bonnes pratiques en carte */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    {/* ✅ Restreindre les requêtes sortantes */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🔒 Restreindre les requêtes sortantes</h3>
      <p className="text-sm mt-2">
        Limitez les adresses IP et domaines vers lesquels le serveur peut envoyer des requêtes HTTP.
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"iptables -A OUTPUT -p tcp --dport 80 -d 169.254.169.254 -j DROP"}
      </pre>
    </motion.div>

    {/* ✅ Valider et filtrer les entrées utilisateurs */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">✅ Valider les entrées utilisateur</h3>
      <p className="text-sm mt-2">
        Vérifiez que les URLs soumises respectent un schéma spécifique et n’accèdent pas à des ressources internes.
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"if url.startswith('http://internal') or 'localhost' in url: reject"}
      </pre>
    </motion.div>

    {/* ✅ Utiliser une liste blanche de domaines autorisés */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">📜 Mettre en place une liste blanche</h3>
      <p className="text-sm mt-2">
        Autorisez uniquement des domaines spécifiques pour les requêtes HTTP sortantes.
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"ALLOWED_DOMAINS = ['example.com', 'api.trusted.com']"}
      </pre>
    </motion.div>

    {/* ✅ Désactiver la résolution des adresses locales */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🚫 Bloquer les IP locales</h3>
      <p className="text-sm mt-2">
        Empêchez l'accès aux plages IP locales (`127.0.0.1`, `192.168.x.x`, `10.x.x.x`).
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"if ip_address.startswith(('127.', '10.', '192.168.')): reject"}
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

export default SSRF;
