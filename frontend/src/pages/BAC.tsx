import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SunIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import logoWhite from "../assets/logo_white.png";
import logoBlack from "../assets/logo_black.png";
import { useNavigate } from "react-router-dom";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { AnimatePresence } from "framer-motion";




const BAC: React.FC = () => {
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
  terminalUsage: "optionnel" // "non" | "optionnel" | "requis"
};


// ✅ Liste des questions du quizz
const quizQuestions = [
  {
    question: "🔐 Quel énoncé décrit le mieux le Broken Access Control ?",
    choices: [
      "Permet de contourner l’authentification via mot de passe",
      "Permet d’accéder à des ressources sans les autorisations adéquates",
      "Permet d’injecter du code malicieux dans une base de données"
    ],
    answer: "Permet d’accéder à des ressources sans les autorisations adéquates"
  },
  {
    question: "🧑‍💼 Sur CorpHub, quel rôle a le droit de consulter les documents ?",
    answer: "manager"
  },
  {
    question: "🔎 Quel est l'ID du profil associé au compte administrateur ?",
    answer: "50"
  },
  {
    question: "📂 Quel est le chemin du serveur pour accéder aux documents /... ?",
    answer: "/d0cs842k"
  },
  {
    question: "📆 Quel est le numéro du ticket lié à un affichage incorrect du calendrier RH ?",
    answer: "1022"
  }
];


const fetchProgress = useCallback(async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    console.log("🔄 Récupération de la progression...");
    const response = await fetch(`http://localhost:5000/progress/${userId}`);
    const data = await response.json();
    const moduleProgress = data.find((p) => p.module_id === 4);

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
    const moduleProgress = data.find((p) => p.module_id === 4);

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
        moduleId: 4,
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



const steps = [
  {
    title: "🔍 Étape 1 : Découverte de surfaces d’attaque",
    description:
      "L’attaquant commence par observer l’application à la recherche de fonctionnalités accessibles ou exposées de manière excessive.",
    example:
      "Exploration de l’interface utilisateur, inspection des URL, des formulaires ou des composants dynamiques affichés selon les rôles.",
    explanation:
      "Un manque de cloisonnement fonctionnel peut révéler des fonctionnalités accessibles au-delà des droits accordés."
  },
  {
    title: "🕵️ Étape 2 : Tests de contrôle d’accès",
    description:
      "Des modifications simples sont effectuées sur des paramètres ou chemins pour tester si des restrictions sont appliquées côté serveur.",
    example:
      "Changer des valeurs dynamiques ou utiliser des liens indirects pour accéder à d'autres ressources ou vues réservées.",
    explanation:
      "Une absence de vérification du rôle ou de l’identité permet de contourner les limitations prévues par l’interface."
  },
  {
    title: "🔓 Étape 3 : Accès à des ressources protégées",
    description:
      "L’attaquant valide qu’il peut accéder à des contenus ou des actions qui devraient être restreints.",
    example:
      "Affichage d’informations sensibles ou accès à des interfaces réservées à un autre niveau d’utilisateur.",
    explanation:
      "Le serveur ne filtre pas suffisamment les autorisations, permettant un comportement non prévu par la logique métier."
  },
  {
    title: "📁 Étape 4 : Escalade implicite de privilèges",
    description:
      "Une fois l’accès non autorisé confirmé, l’attaquant explore les possibilités offertes par ce nouveau périmètre.",
    example:
      "Navigation transversale dans des contenus liés à d’autres comptes ou tentatives d’interaction avec des zones avancées.",
    explanation:
      "Ces abus d’autorisations permettent d’en apprendre davantage sur l’organisation ou d’enchaîner sur d’autres vecteurs d’attaque."
  },
  {
    title: "🚨 Étape 5 : Exploitation ou pivot",
    description:
      "L’attaquant exploite l’accès acquis pour extraire des données, manipuler l’interface ou contourner d’autres sécurités.",
    example:
      "Utilisation d’un rôle détourné pour obtenir des identifiants, contourner un flux métier, ou débloquer une fonctionnalité réservée.",
    explanation:
      "Une faille de contrôle d’accès mal corrigée peut suffire à compromettre l’ensemble du système ou à rebondir sur d’autres faiblesses."
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
        Broken Access Control
        </h1>
      </div>
{/* ✅ Explication de la vulnérabilité Broken Access Control (présentation moderne) */}
<motion.div
  className={`mt-16 w-3/4 p-6 rounded-lg shadow-lg 
  ${darkMode ? "bg-gray-800" : "bg-white"} transition-all duration-500`}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h2 className="text-2xl font-semibold">🔓 Broken Access Control (BAC)</h2>
  <p className="mt-2 text-sm">
    La faille Broken Access Control se produit lorsque les restrictions d’accès ne sont pas correctement mises en œuvre côté serveur, 
    permettant à des utilisateurs non autorisés d'accéder à des ressources protégées.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
      <h3 className="font-semibold">🕵️ Contournement des rôles</h3>
      <p className="text-sm mt-2">
        Un attaquant peut accéder à des pages ou fichiers sensibles en modifiant simplement un paramètre (ex : <code>?id=5</code>) ou l’URL.
      </p>
    </div>
    <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
      <h3 className="font-semibold">🔗 Faille IDOR (Insecure Direct Object Reference)</h3>
      <p className="text-sm mt-2">
      L'accès à des ressources via des identifiants exposés, sans contrôle, permet de consulter/modifier des données d'autres utilisateurs.
      </p>
    </div>
    <div className={`p-4 rounded-lg shadow-md transition-all duration-500 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
      <h3 className="font-semibold">🛑 Manque de vérifications serveur</h3>
      <p className="text-sm mt-2">
        Une validation insuffisante côté serveur permet aux attaquants de contourner les restrictions d’accès prévues côté client (UI).
      </p>
    </div>
  </div>

  <p className="mt-6">
    Les contrôles d’accès doivent toujours être effectués côté serveur. 
    Une mauvaise implémentation peut exposer des données sensibles, des fonctions critiques ou compromettre l’intégrité du système.
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
      href="http://host.docker.internal:1041/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="ml-1 text-blue-400 hover:text-blue-300 underline"
    >
      http://host.docker.internal:1041/
    </a>
  </motion.div>

  <iframe
    src="http://localhost:1041/"
    className="w-full h-full"
    title="Site BAC"
  ></iframe>
</div>



            {/* ✅ Ajout de l'iframe et espace en dessous pour le scroll */}
            <div className="mt-16 w-3/4 h-[600px] border-2 border-gray-400 rounded-lg overflow-hidden">
        <iframe
          src="http://localhost:1045/"
          className="w-full h-full"
          title="Kali BAC"
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

{/* ✅ Comment se protéger contre Broken Access Control ? */}
<motion.div
  className={`mt-16 w-3/4 p-6 rounded-lg shadow-lg transition-all duration-500 
  ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h2 className="text-2xl font-semibold text-center">🛡️ Comment se protéger contre le Broken Access Control ?</h2>

  <p className="mt-4 text-center">
    Le Broken Access Control survient lorsque les permissions ne sont pas correctement vérifiées côté serveur. 
    Voici quelques **bonnes pratiques** à appliquer pour sécuriser vos accès :
  </p>

  {/* ✅ Bonnes pratiques en carte */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

    {/* ✅ Vérification systématique des droits côté serveur */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🔐 Vérifier les droits côté serveur</h3>
      <p className="text-sm mt-2">
        Ne vous fiez jamais uniquement au frontend : contrôlez les permissions d’accès pour chaque ressource côté serveur.
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"if user.id !== resource.owner_id: denyAccess()"}
      </pre>
    </motion.div>

    {/* ✅ Filtrer l'accès en fonction du rôle */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">✅ Contrôler les rôles</h3>
      <p className="text-sm mt-2">
        Limitez l’accès aux fonctions sensibles selon les rôles attribués à chaque utilisateur.<p>‎ </p>
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"if user.role !== 'manager': return 403"}
      </pre>
    </motion.div>

    {/* ✅ Ne pas exposer d’identifiants prédictibles */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🕵️‍♂️ Masquer les identifiants sensibles</h3>
      <p className="text-sm mt-2">
        Évitez d’utiliser des identifiants numériques séquentiels visibles dans les URL qui facilitent les attaques IDOR.
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"GET /user?id=UUIDv4"}
      </pre>
    </motion.div>

    {/* ✅ Empêcher la navigation non autorisée */}
    <motion.div
      className={`p-5 rounded-lg shadow-md transition-all duration-500 
      ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="font-semibold">🚫 Bloquer les accès directs non autorisés</h3>
      <p className="text-sm mt-2">
        Assurez-vous que les utilisateurs ne peuvent pas accéder à des pages ou documents ne leur étant pas destinés.
      </p>
      <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
        {"if not user.canAccess(resource): return 403"}
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

export default BAC;
