import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SunIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import logoWhite from "../assets/logo_white.png";
import logoBlack from "../assets/logo_black.png";
import { useNavigate } from "react-router-dom";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { AnimatePresence } from "framer-motion";


const Injection: React.FC = () => {
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
  iframeSupport: true, // false = nécessite un nouvel onglet
  terminalUsage: "non" // "non" | "optionnel" | "requis"
};

// ✅ Liste des questions du quizz
const quizQuestions = [
  { question: "🔑 Comment s'appelle la base de données de NeoMarket ?", answer: "neomarketdb" },
  { question: "📊 Combien de tables possède la base de données de NeoMarket ?", answer: "6" },
  { question: "⚙️ Quel est le nom de la 2ème colonne de la table config ?", answer: "setting_name" },
  { question: "👔 Comment s'appelle le CEO de NeoMarket ?", answer: "Richard Martin" },
  { question: "🔬 Quelle est la startup que NeoMarket prévoit de racheter ?", answer: "Biotech" },
];

const fetchProgress = useCallback(async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    console.log("🔄 Récupération de la progression...");
    const response = await fetch(`http://localhost:5000/progress/${userId}`);
    const data = await response.json();
    const moduleProgress = data.find((p) => p.module_id === 3);

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
    const moduleProgress = data.find((p) => p.module_id === 3);

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
        moduleId: 3,
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
  // 🔍 Calculer le bon quizStep en fonction du progrès
  const calculatedStep = Math.floor(progress * quizQuestions.length);
  
  // ✅ On ne met à jour quizStep que si la nouvelle valeur est supérieure
  setQuizStep((prev) => (calculatedStep > prev ? calculatedStep : prev));
}, [progress, quizQuestions.length]); 





  // 🔥 Liste des étapes d'injection SQL
  const steps = [
    {
      title: "🔍 Étape 1 : Détecter une faille SQL",
      description:
        "Un attaquant commence toujours par tester si un champ d’entrée est vulnérable. Pour cela, il entre simplement une apostrophe ' pour voir si une erreur SQL s’affiche.",
      example: "'",
      explanation:
        "Si une erreur SQL apparaît, cela signifie que l’application ne protège pas correctement les entrées utilisateur.",
    },
    {
      title: "🛠 Étape 2 : Comprendre le rôle de ' et --",
      description:
        "L'apostrophe ' ferme prématurément la chaîne de caractères et le double tiret -- transforme le reste de la requête en commentaire.",
      example: "' OR '1'='1 --",
      explanation:
        "Cela force la requête à toujours retourner vrai et contourne l’authentification.",
    },
    {
      title: "🔢 Étape 3 : Trouver le nombre de colonnes",
      description:
        "L’attaquant doit deviner combien de colonnes la requête SQL attend. Pour cela, il teste différentes valeurs NULL jusqu’à ce qu’aucune erreur ne s’affiche.",
      example: "' UNION SELECT NULL --",
      explanation:
        "Si il y a une erreur, essayer en rajoutant plusieurs fois NULL afin de déduire le nombre de colonnes attendues.",
    },
    {
      title: "📂 Étape 4 : Découvrir les bases de données",
      description:
        "Une fois le nombre de colonnes trouvé, l'attaquant cherche à récupérer la liste des bases de données accessibles.",
      example: "' UNION SELECT datname, NULL, NULL FROM pg_database --",
      explanation:
        "pg_database est une table système qui stocke toutes les bases de données du serveur. La colonne datname contient leur nom, ce qui permet d’identifier où chercher les informations sensibles.",
    },
    {
      title: "📄 Étape 5 : Lister les tables de la base de données",
      description:
        "Maintenant que l'attaquant connaît la base de données cible, il doit lister les tables qu'elle contient.",
      example:
        "' UNION SELECT table_name, NULL, NULL FROM information_schema.tables WHERE table_schema = 'public' --",
      explanation:
        "information_schema.tables stocke les noms des tables accessibles. Le schéma public contient généralement les tables des utilisateurs et des applications.",
    },
    {
      title: "🗄 Étape 6 : Lister les colonnes d’une table",
      description:
        "L'attaquant a trouvé une table intéressante, mais il doit maintenant savoir quelles colonnes elle contient.",
      example:
        "' UNION SELECT column_name, NULL, NULL FROM information_schema.columns WHERE table_name = 'exemple' --",
      explanation:
        "information_schema.columns répertorie toutes les colonnes disponibles dans les tables. Il est ainsi possible d’identifier les colonnes de notre table exemple.",
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
          Injection
        </h1>
      </div>
      {/* ✅ Explication des types d'injections (présentation moderne) */}
      <motion.div
        className={`mt-16 w-3/4 p-6 rounded-lg shadow-lg 
        ${darkMode ? "bg-gray-800" : "bg-white"} transition-all duration-500`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold">🕵️ Types d'injections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>

            <h3 className="font-semibold">🛠️ Injection SQL</h3>
            <p className="text-sm mt-2">Permet de manipuler les requêtes SQL d’une application pour accéder à des données non autorisées.</p>
          </div>
          <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>

            <h3 className="font-semibold">💻 Command Injection</h3>
            <p className="text-sm mt-2">Exploitant une mauvaise gestion des entrées, elle permet l'exécution de commandes système sur un serveur.</p>
          </div>
          <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
            <h3 className="font-semibold">🌐 XSS (Cross-Site Scripting)</h3>
            <p className="text-sm mt-2">Permet d’injecter du JavaScript malveillant pour voler des sessions ou modifier une page Web.</p>
          </div>
        </div>
        <p className="mt-6">
          L'injection SQL est la plus courante et concerne directement les bases de données relationnelles. C'est pourquoi nous allons l'étudier plus en détail.
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
      href="http://host.docker.internal:8081/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="ml-1 text-blue-400 hover:text-blue-300 underline"
    >
      http://host.docker.internal:8081/
    </a>
  </motion.div>

  {/* ✅ Iframe du site */}
  <iframe
    src="http://localhost:8081/"
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
  {quizStep < quizQuestions.length ? (
    <p className="mt-4 text-center">{quizQuestions[quizStep].question}</p>
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
    Les injections SQL sont l'une des vulnérabilités les plus dangereuses. Voici quelques **bonnes pratiques** pour s'en protéger :
  </p>

  {/* ✅ Bonnes pratiques en carte */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    {/* ✅ Utiliser des requêtes préparées */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🔐 Utiliser des requêtes préparées</h3>
      <p className="text-sm mt-2">Évitez de concaténer directement les entrées utilisateur dans vos requêtes SQL.</p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"const query = 'SELECT * FROM users WHERE username = ?';"}
      </pre>
    </motion.div>

    {/* ✅ Valider et échapper les entrées utilisateur */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🛑 Valider et échapper les entrées utilisateur</h3>
      <p className="text-sm mt-2">N'acceptez que les caractères attendus dans vos champs.</p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"if (!/^[a-zA-Z0-9]+$/.test(username)) return;"}
      </pre>
    </motion.div>

    {/* ✅ Utiliser les ORM sécurisés */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🚀 Utiliser un ORM sécurisé</h3>
      <p className="text-sm mt-2">Les ORM (Sequelize, Prisma) permettent d'éviter les injections SQL automatiquement.</p>
    </motion.div>

    {/* ✅ Désactiver l'affichage des erreurs SQL */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">⚠️ Désactiver l'affichage des erreurs SQL</h3>
      <p className="text-sm mt-2">Ne laissez jamais les messages d'erreur SQL s'afficher aux utilisateurs.</p>
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

export default Injection;
