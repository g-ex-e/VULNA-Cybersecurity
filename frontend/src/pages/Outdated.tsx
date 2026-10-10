import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SunIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import logoWhite from "../assets/logo_white.png";
import logoBlack from "../assets/logo_black.png";
import { useNavigate } from "react-router-dom";
import Joyride from "react-joyride";

const VulnerableAndOutdatedContent: React.FC = () => {
  const navigate = useNavigate();
  const [isBottom, setIsBottom] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("darkMode") === "false" ? false : true
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState(["", "", "", "", ""]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // <-- à ajouter en haut avec les autres useState
  const TOTAL_STEPS = 10;
  const GLOBAL_OFFSET = 4;

  const moduleContextInfo = {
    iframeSupport: true,
    terminalUsage: "requis"
  };

  const quizQuestions = [
    { question: "📌 Quelle est la version de WordPress utilisée sur le site Les desserts de Sandra ?", answer: "4.7" },
    { question: "🔗 Quel protocole est utilisé par la vulnérabilité permettant de modifier un article sans authentification sur cette version de WordPress ?", answer: "REST API" },
    { 
      question: "🌍 Quel est l'URL de l'endpoint de l'API REST qui permet de récupérer les articles de ce site WordPress (http://host.docker.internal:8082/[...]) ?", 
      answer: "http://host.docker.internal:8082/wp-json/wp/v2/posts", 
      hint: "https://capitainewp.io/formations/developper-theme-wordpress/api-rest/"
    },
    { 
      question: "🔑 Donner un paramètre qui permet de contourner la validation de l’ID d’un post dans l’API REST de WordPress 4.7 pour modifier un article sans authentification ?", 
      answer: "?id=1abc",
      hint: "https://blog.sucuri.net/2017/02/content-injection-vulnerability-wordpress-rest-api.html"
    },
    {
      question: "🎯 Quelle commande cURL permet d'exploiter la vulnérabilité de l'API REST de WordPress 4.7 pour modifier un post sans authentification ?", 
      answer: "curl -X POST -H \"Content-Type: application/json\" \\ \n     -d '{\"content\":\"HACKED VULNA\"}' \\ \n     \"http://host.docker.internal:8082/wp-json/wp/v2/posts/1?id=1abc\"",
      choices: [
        "curl -X PUT -H \"Content-Type: application/json\" \\ \n     -d '{\"content\":\"HACKED VULNA\"}' \\ \n     \"http://host.docker.internal:8082/wp-json/wp/v2/posts/1\"",
        "curl -X POST -H \"Content-Type: application/json\" \\ \n     -d '{\"content\":\"HACKED VULNA\"}' \\ \n     \"http://host.docker.internal:8082/wp-json/wp/v2/posts/1?id=1abc\"",
        "curl -X GET -H \"Content-Type: application/json\" \\ \n     \"http://host.docker.internal:8082/wp-json/wp/v2/posts/1?id=1abc\""
      ]
    }
  ];

  const steps = [
    {
      title: "🔍 Étape 1 : Identifier les composants obsolètes",
      description:
        "L'attaquant commence par scanner l'application pour identifier les bibliothèques, frameworks ou plugins obsolètes.",
      example: "Utilisation d'outils comme nmap, wpscan, nikto, whatweb...",
      explanation:
        "Les composants obsolètes peuvent contenir des vulnérabilités connues qui n'ont pas été corrigées.",
    },
    {
      title: "🛠 Étape 2 : Rechercher les vulnérabilités connues",
      description:
        "Une fois les composants obsolètes identifiés, l'attaquant vérifie s'ils sont associés à des vulnérabilités connues.",
      example:
        "Consulter des bases de données publiques comme CVE ou NVD.",
      explanation:
        "Les vulnérabilités connues sont souvent documentées avec des infos d’exploitation.",
    },
    {
      title: "⚠️ Étape 3 : Vérifier la faisabilité de l'exploitation",
      description:
        "L'attaquant analyse si les vulnérabilités détectées sont exploitables dans le contexte spécifique.",
      example:
        "Tester avec des scripts ou Metasploit.",
      explanation:
        "Pas toutes les failles sont exploitables selon la config ou les protections en place.",
    },
    {
      title: "🎯 Étape 4 : Tentative d'exploitation",
      description:
        "Si une vulnérabilité exploitable est identifiée, l'attaquant tente d’en tirer parti.",
      example:
        "Contournement d'authentification, injection, contrôle serveur...",
      explanation:
        "But : obtenir un accès non autorisé ou exfiltrer des données sensibles.",
    },
    {
      title: "📂 Étape 5 : Actions post-exploitation",
      description:
        "Une fois le système compromis, l'attaquant maximise l’impact.",
      example:
        "Backdoor, ransomware, extraction de données...",
      explanation:
        "L’idée est d'assurer un accès persistant et d'exploiter la brèche au maximum.",
    },
  ];  

  const joyrideSteps = [
    {
      target: "#explanation-section",
      content: "Voici une introduction à la vulnérabilité que vous allez étudier.",
      disableBeacon: true,
    },
    {
      target: "#steps-section",
      content: "Découvrez étape par étape comment l’attaque peut être réalisée.",
    },
    {
      target: "#env-info", // <-- c’est bien celui que tu as dans le code
      content: "Voici quelques informations techniques utiles sur l’environnement du module.",
    },
    {
      target: "#iframe-section", // <-- c’est bien celui que tu utilises
      content: "Vous pouvez tester la vulnérabilité dans cet environnement sécurisé.",
    },
    {
      target: "#quiz-section",
      content: "Un petit quizz pour valider vos connaissances !",
    },
    {
      target: "#prevention-section", // <-- attention tu avais écrit 'mitigation-section'
      content: "Et enfin, apprenez comment se protéger contre ce type de faille.",
    },
  ];
  

  const fetchProgress = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/progress/${userId}`);
      const data = await response.json();
      const moduleProgress = data.find((p) => p.module_id === 1);

      if (moduleProgress) {
        const progressValue = parseFloat(moduleProgress.progress);
        setProgress(progressValue);
        if (progressValue >= 1) {
          setQuizStep(quizQuestions.length);
        } else {
          setQuizStep(Math.floor(progressValue * quizQuestions.length));
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de la progression :", error);
    }
  }, [quizQuestions.length]);

  const updateProgress = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/progress/${userId}`);
      const data = await response.json();
      const moduleProgress = data.find((p) => p.module_id === 1);

      let currentProgress = moduleProgress ? parseFloat(moduleProgress.progress) : 0;
      if (currentProgress >= 1) return;

      const newProgress = Math.min(1, currentProgress + 0.2);
      setProgress(newProgress);

      await fetch("http://localhost:5000/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId),
          moduleId: 1,
          increment: 0.2,
        }),
      });

      fetchProgress();
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de la progression :", error);
    }
  };

  const handleQuizAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newAnswers = [...quizAnswers];
    newAnswers[quizStep] = value;
    setQuizAnswers(newAnswers);

    if (isRestarting) return;

    if (value.toLowerCase().trim() === quizQuestions[quizStep].answer.toLowerCase()) {
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
  }, [fetchProgress, darkMode]);

  useEffect(() => {
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

  const [runTutorial, setRunTutorial] = useState(false);
  
  useEffect(() => {
    const savedStep = localStorage.getItem("joyrideStep");
    if (savedStep !== null) {
      setRunTutorial(true);
      setCurrentStep(0); // toujours démarrer au début local
      localStorage.removeItem("joyrideStep");
    }
  }, []);
  
  

  return (
    <div
      className={`min-h-screen flex flex-col items-center transition-all duration-500 
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {/* 🧭 Tutoriel interactif */}

      <Joyride
  steps={joyrideSteps}
  run={runTutorial}
  continuous
  showSkipButton
  scrollToFirstStep
  stepIndex={currentStep}
  callback={(data) => {
    const { index, type, action, status } = data;

    if (type === "step:after") {
      if (action === "next") setCurrentStep(index + 1);
      if (action === "prev") setCurrentStep(index - 1);
    }

    if (status === "finished" || status === "skipped") {
      setRunTutorial(false);
      setCurrentStep(0);
    }
  }}
  locale={{
    back: "Précédent",
    close: "Fermer",
    next:
      currentStep + GLOBAL_OFFSET + 1 === TOTAL_STEPS
        ? "Terminer"
        : `Suivant (${currentStep + GLOBAL_OFFSET + 2}/${TOTAL_STEPS})`,
    last: "Terminer",
    skip: "Passer",
  }}
  
  
  
  styles={{ options: { zIndex: 10000 } }}
/>




      {/* ✅ Logo & Titre */}
      <div className="text-center mt-10">
        <img
          src={darkMode ? logoWhite : logoBlack}
          alt="Logo"
          className="mx-auto h-auto transition-all duration-500 w-64 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        />
        <h1
          className={`text-4xl font-bold mt-4 transition-all duration-500 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Vulnerable And Outdated Content
        </h1>
      </div>

      {/* 🔎 Introduction à la vulnérabilité */}
      <motion.div
        id="explanation-section"
        className={`mt-16 w-3/4 p-6 rounded-lg shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        } transition-all duration-500`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold">🕵️ Composants obsolètes et vulnérabilités</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div
            className={`p-4 rounded-lg shadow-md transition-all duration-500 ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
            }`}
          >
            <h3 className="font-semibold">📌 CMS et Frameworks obsolètes</h3>
            <p className="text-sm mt-2">
              Les sites utilisant des CMS ou frameworks dépassés peuvent être exposés à des failles critiques connues.
            </p>
          </div>
          <div
            className={`p-4 rounded-lg shadow-md transition-all duration-500 ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
            }`}
          >
            <h3 className="font-semibold">📦 Bibliothèques et dépendances vulnérables</h3>
            <p className="text-sm mt-2">
              L'utilisation de dépendances non mises à jour peut permettre des attaques via des failles connues.
            </p>
          </div>
          <div
            className={`p-4 rounded-lg shadow-md transition-all duration-500 ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
            }`}
          >
            <h3 className="font-semibold">🔓 Plugins et extensions non sécurisés</h3>
            <p className="text-sm mt-2">
              Les extensions non maintenues ou mal sécurisées peuvent ouvrir des portes aux attaquants.
            </p>
          </div>
        </div>
        <p className="mt-6">
          Les composants obsolètes sont une des principales causes de failles de sécurité sur les applications web modernes.
          Identifier et mettre à jour ces éléments est essentiel pour réduire les risques d'exploitation.
        </p>
      </motion.div>
      {/* 🧭 Étapes d’exploitation de la vulnérabilité */}
      <div id="steps-section" className="mt-10 w-3/4 space-y-6">
        <motion.div
          className={`p-6 rounded-lg shadow-md transition-all duration-500 
          ${darkMode ? "bg-gray-800" : "bg-white"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold">{steps[stepIndex].title}</h3>
          <p className="mt-2">{steps[stepIndex].description}</p>
          <pre
            className={`p-3 rounded mt-4 ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
            }`}
          >
            {steps[stepIndex].example}
          </pre>
          <p className="mt-2">{steps[stepIndex].explanation}</p>
        </motion.div>

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

      {/* 🧭 Informations sur l’environnement */}
      <motion.div
        id="env-info"
        className={`mt-10 w-3/4 max-w-2xl rounded-lg shadow-md transition-all duration-500 mx-auto
        ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="px-6 py-4 relative">
          <h2 className="text-lg font-semibold text-center">
            🧭 Informations sur l’environnement
          </h2>
          <button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className={`absolute right-6 top-1/2 -translate-y-1/2 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center 
            transition-all duration-300 
            ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            {isInfoOpen ? "−" : "+"}
          </button>
        </div>

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
                  <div
                    className={`rounded-lg p-4 border-l-4 shadow 
                    ${
                      moduleContextInfo.iframeSupport
                        ? "border-green-500 bg-green-50 text-green-800"
                        : "border-red-500 bg-red-50 text-red-800"
                    }`}
                  >
                    <h4 className="font-semibold text-sm mb-1">
                      🧩 Réalisable dans l’iframe
                    </h4>
                    <p className="text-xs">
                      {moduleContextInfo.iframeSupport
                        ? "Toutes les étapes peuvent être effectuées dans l'encadré intégré."
                        : "Certaines actions nécessitent l'ouverture du site dans un onglet externe."}
                    </p>
                  </div>

                  <div
                    className={`rounded-lg p-4 border-l-4 shadow 
                    ${
                      moduleContextInfo.terminalUsage === "non"
                        ? "border-green-500 bg-green-50 text-green-800"
                        : moduleContextInfo.terminalUsage === "optionnel"
                        ? "border-yellow-500 bg-yellow-50 text-yellow-800"
                        : "border-red-500 bg-red-50 text-red-800"
                    }`}
                  >
                    <h4 className="font-semibold text-sm mb-1">
                      💻 Utilisation du terminal
                    </h4>
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

      {/* 🧭 Bloc iFrame – environnement de test */}
      <div id="iframe-section" className="mt-6 w-3/4">
        <div className="relative h-[600px] border-2 border-gray-400 rounded-lg overflow-hidden mx-auto">
          <motion.div
            className="absolute top-2 right-6 bg-gray-800 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow-md"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            🔗 URL :
            <a
              href="http://host.docker.internal:8082/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-400 hover:text-blue-300 underline"
            >
              http://host.docker.internal:8082/
            </a>
          </motion.div>

          <iframe
            src="http://localhost:8082/"
            className="w-full h-full"
            title="Site vulnérable WordPress"
          ></iframe>
        </div>
      </div>
      {/* 🧭 Iframe du terminal (exploitation pratique) */}
      <div className="mt-16 w-3/4 h-[600px] border-2 border-gray-400 rounded-lg overflow-hidden">
        <iframe
          src="http://localhost:2222/"
          className="w-full h-full"
          title="Terminal Vulnérable"
        ></iframe>
      </div>

      {/* 🧠 Quizz */}
      <motion.div
        id="quiz-section"
        className={`mt-16 w-2/3 max-w-2xl p-6 rounded-lg shadow-lg transition-all duration-500 
        ${darkMode ? "bg-gray-800" : "bg-white"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-center">🧠 Quizz</h2>

        {/* Question en cours */}
        {quizStep < quizQuestions.length ? (
          <>
            <p className="mt-4 text-center">{quizQuestions[quizStep].question}</p>

            {/* Lien indice (si dispo) */}
            {quizQuestions[quizStep].hint && (
              <div className="flex justify-center mt-4">
                <a
                  href={quizQuestions[quizStep].hint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300
                  bg-purple-500 hover:bg-purple-600 text-white"
                >
                  💡 Indice
                </a>
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

        {/* Rejouer le quizz */}
        {progress >= 1 && quizStep >= quizQuestions.length && !isRestarting && (
          <motion.div
            className="flex justify-center mt-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => {
                setIsRestarting(true);
                setQuizStep(0);
                setQuizAnswers(["", "", "", "", ""]);
                setIsCorrect(null);
                setTimeout(() => setIsRestarting(false), 500);
              }}
              className={`px-6 py-3 rounded-lg shadow-lg transition-all duration-300 text-lg flex items-center gap-2 
              ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-black hover:bg-gray-300"}`}
            >
              🔄 Rejouer le quizz
            </button>
          </motion.div>
        )}

        {/* Réponse à saisir ou QCM */}
        {quizStep < quizQuestions.length && (
          <>
            {quizStep === 4 && quizQuestions[quizStep].choices ? (
              <div className="mt-6 flex flex-col items-center space-y-3">
                {quizQuestions[quizStep].choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleQCMAnswer(choice)}
                    className={`px-6 py-3 w-2/3 rounded-lg text-lg shadow-md transition-all duration-300
                    ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-black hover:bg-gray-300"}
                    ${
                      quizAnswers[quizStep] === choice
                        ? isCorrect
                          ? "border-green-600 shadow-lg shadow-green-400"
                          : "border-red-600 shadow-lg shadow-red-400"
                        : "border-gray-400"
                    }`}
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
                  ${
                    isCorrect === null
                      ? "border-gray-400"
                      : isCorrect
                      ? "border-green-600 shadow-lg shadow-green-400"
                      : "border-red-600 shadow-lg shadow-red-400"
                  }`}
                />
              </div>
            )}
          </>
        )}
      </motion.div>
      {/* 🛡️ Comment s'en prémunir ? */}
      <motion.div
        id="prevention-section"
        className={`mt-16 w-3/4 p-6 rounded-lg shadow-lg transition-all duration-500 
        ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-center">🛡️ Comment s'en prémunir ?</h2>
        <p className="mt-4 text-center">
          L'utilisation de composants obsolètes expose les applications à des vulnérabilités connues. Voici quelques <strong>bonnes pratiques</strong> pour éviter ces risques :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Pratique 1 */}
          <motion.div
            className={`p-5 rounded-lg shadow-md transition-all duration-500 
            ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="font-semibold">🔄 Mettre à jour régulièrement</h3>
            <p className="text-sm mt-2">Gardez votre CMS, frameworks et bibliothèques à jour pour bénéficier des derniers correctifs de sécurité.</p>
            <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>npm update && npm audit fix</pre>
          </motion.div>

          {/* Pratique 2 */}
          <motion.div
            className={`p-5 rounded-lg shadow-md transition-all duration-500 
            ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="font-semibold">📊 Surveiller les vulnérabilités</h3>
            <p className="text-sm mt-2">Vérifiez régulièrement si vos composants sont affectés par des failles de sécurité connues.</p><p>‎ </p>
            <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>nmap -sV --script vuln target.com</pre>
          </motion.div>

          {/* Pratique 3 */}
          <motion.div
            className={`p-5 rounded-lg shadow-md transition-all duration-500 
            ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="font-semibold">🗑️ Supprimer les plugins inutiles</h3>
            <p className="text-sm mt-2">Désinstallez les plugins, bibliothèques et thèmes obsolètes ou inutilisés pour limiter la surface d’attaque.</p>
            <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>wp plugin uninstall plugin_vuln</pre>
          </motion.div>

          {/* Pratique 4 */}
          <motion.div
            className={`p-5 rounded-lg shadow-md transition-all duration-500 
            ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="font-semibold">🔍 Activer un monitoring de sécurité</h3>
            <p className="text-sm mt-2">Mettez en place un monitoring pour détecter les attaques et comportements suspects en temps réel.</p><p>‎ </p>
            <pre className={`p-3 mt-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>fail2ban-client status</pre>
          </motion.div>
        </div>
      </motion.div>

      {/* 📏 Espace bas de page */}
      <div className="h-32" />

      {/* 🔽 / 🔼 Scroll vers le bas ou le haut */}
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

      {/* ☀️ Bouton Dark Mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-10 right-10 bg-yellow-500 hover:bg-yellow-600 p-4 rounded-full transition-all duration-300 shadow-lg hover:scale-110"
      >
        <SunIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

export default VulnerableAndOutdatedContent;