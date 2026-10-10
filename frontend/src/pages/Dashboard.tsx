import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Module from "../components/Module";
import { motion } from "framer-motion";
import { UserCircleIcon, SunIcon } from "@heroicons/react/24/solid";
import { HiOutlineSortDescending } from "react-icons/hi";
import logoWhite from "../assets/logo_white.png";
import logoBlack from "../assets/logo_black.png";
import Joyride from "react-joyride"; // 🧭 Ajout Joyride
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";



const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [rank, setRank] = useState("Chargement...");
  const [runTutorial, setRunTutorial] = useState(false); // 🧭 Contrôle du tutoriel
  

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
  
    const checkIntroStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/user/${userId}`);
        const data = await res.json();
  
        if (!data.has_seen_intro) {
          console.log("👀 Tutoriel non vu, on le lance !");
          setRunTutorial(true);
  
          // 🔥 On le marque comme vu en base
          await fetch(`http://localhost:5000/user/${userId}/seen-intro`, {
            method: "POST",
          });
        } else {
          console.log("✅ Tutoriel déjà vu, on ne fait rien.");
        }
      } catch (err) {
        console.error("❌ Erreur lors du check tutoriel :", err);
      }
    };
  
    checkIntroStatus();
  }, []);
  

  const steps = [
    {
      target: "#user-info",
      content:
        "Voici votre profil utilisateur. Vous y trouverez votre rang (défini selon votre progression globale) ainsi que le temps passé sur la plateforme.",
      disableBeacon: true,
    },
    {
      target: "#dashboard-controls",
      content:
        "Ces boutons vous permettent de trier les modules ou changer entre le mode clair et sombre.",
    },
    {
      target: "#modules-grid",
      content: "Ici vous trouverez tous les modules de sécurité à explorer.",
    },
    {
      target: "#module-1",
      content: "Cliquez ici pour commencer votre premier module !",
      showSkipButton: true, // 👈 C’EST CETTE LIGNE À AJOUTER
    },
  ];



  const initialModules = useMemo(() => [
    { id: 1, name: "A06 : Vulnerable and Outdated Components", difficulty: "Facile", progress: 0, owaspRank: 6 },
    { id: 2, name: "A10 : Server-Side Request Forgery (SSRF)", difficulty: "Facile", progress: 0, owaspRank: 10 },
    { id: 3, name: "A03 : Injection", difficulty: "Intermédiaire", progress: 0, owaspRank: 3 },
    { id: 4, name: "A01 : Broken Access Control", difficulty: "Intermédiaire", progress: 0, owaspRank: 1 },
    { id: 5, name: "A02 : Cryptographic Failures", difficulty: "Avancée", progress: 0, owaspRank: 2 },
    { id: 6, name: "A08 : Software and Data Integrity Failures", difficulty: "Avancée", progress: 0, owaspRank: 8 },
  ], []);

  const [modules, setModules] = useState(initialModules);
  const [isSortedByDifficulty, setIsSortedByDifficulty] = useState(false);
  const [isSortedByImpact, setIsSortedByImpact] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const TOTAL_STEPS = 10;
  const [createdAt, setCreatedAt] = useState<string | null>(null);


  
  
  const getEmojiForRank = (rank: string) => {
    switch (rank) {
      case "Nouveau":
        return "🚪";
      case "Débutant":
        return "🔰";
      case "Intermédiaire":
        return "🧠";
      case "Expert":
        return "🚀";
      case "Maître":
        return "👑";
      default:
        return "";
    }
  };
  


  // 🔥 Récupération de la progression depuis l'API
  const fetchProgress = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("⚠️ Aucun userId trouvé dans localStorage !");
      return;
    }

    try {
      console.log(`🔄 Récupération de la progression pour userId: ${userId}`);
      const response = await fetch(`http://localhost:5000/progress/${userId}`);
      const data = await response.json();
      console.log("📊 Progression récupérée depuis l'API :", data);

      const updatedModules = initialModules.map((module) => {
        const progressData = data.find((p) => p.module_id === module.id);
        return {
          ...module,
          progress: progressData ? progressData.progress * 100 : 0,
        };
      });

      console.log("📊 Modules après mise à jour :", updatedModules);
      setModules(updatedModules);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de la progression :", error);
    }
  }, [initialModules]);

  const fetchUsername = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("⚠️ Aucun userId trouvé dans localStorage !");
      return;
    }
  
    try {
      console.log(`🔄 Récupération des infos utilisateur pour userId: ${userId}`);
      const response = await fetch(`http://localhost:5000/user/${userId}`);
      const data = await response.json();
  
      if (data.username) {
        setUsername(data.username);
        console.log("✅ Username récupéré :", data.username);
      } else {
        console.error("❌ Aucun username trouvé pour cet userId !");
      }
  
      if (data.created_at) {
        setCreatedAt(data.created_at);
        console.log("📅 Date d'inscription récupérée :", data.created_at);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des infos utilisateur :", error);
    }
  }, []);
  

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("darkMode");
    return stored === "false" ? false : true;
  });
  
  // Dès que darkMode change, on le sauvegarde dans localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
  

  const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);
  
  useEffect(() => {
    fetchUsername();
  }, [fetchUsername]);

  useEffect(() => {
    const fetchRank = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
  
      try {
        const res = await fetch(`http://localhost:5000/user/${userId}/metrics`);
        const data = await res.json();
  
        const TOTAL_MODULES = initialModules.length;
  
        const progressMap: { [key: number]: number } = {};
        data.moduleProgress.forEach((mod: { module_id: number; progress: number }) => {
          progressMap[mod.module_id] = mod.progress;
        });
  
        const allProgress = initialModules.map((mod) => (progressMap[mod.id] || 0) / 100); // 👈 NORMALISATION ICI
        const totalProgress = allProgress.reduce((acc, val) => acc + val, 0);
        const globalCompletionRate = totalProgress / TOTAL_MODULES;        
  
        const hasAnyProgress = allProgress.some((p) => p > 0);
  
        if (!hasAnyProgress) {
          setRank("Nouveau");
        } else if (allProgress.every((p) => p >= 0.999)) {
          setRank("Maître");
        } else if (globalCompletionRate >= 0.9) {
          setRank("Expert");
        } else if (globalCompletionRate >= 0.5) {
          setRank("Intermédiaire");
        } else {
          setRank("Débutant");
        }        
      } catch (err) {
        console.error("❌ Erreur lors du calcul du rang :", err);
      }
    };
  
    fetchRank();
  }, [initialModules]);
  
  
  
  // ✅ Fonction de tri des modules
  const sortModules = (criteria: string) => {
    let sortedModules = [...modules];

    const updatedInitialModules = initialModules.map((module) => ({
      ...module,
      progress: modules.find((m) => m.id === module.id)?.progress || 0,
    }));

    if (criteria === "difficulty") {
      if (isSortedByDifficulty) {
        setModules(updatedInitialModules);
      } else {
        const difficultyOrder: { [key: string]: number } = {
          Avancée: 1,
          Intermédiaire: 2,
          Facile: 3,
        };
        sortedModules.sort(
          (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        );
        setModules(sortedModules);
      }
      setIsSortedByDifficulty(!isSortedByDifficulty);
      setIsSortedByImpact(false);
    }

    if (criteria === "impact") {
      if (isSortedByImpact) {
        sortedModules.reverse();
      } else {
        sortedModules.sort((a, b) => a.owaspRank - b.owaspRank);
      }
      setModules(sortedModules);
      setIsSortedByImpact(!isSortedByImpact);
      setIsSortedByDifficulty(false);
    }

    setSortMenuVisible(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSortMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  

  const handleJoyrideCallback = (data: any) => {
    const { index, status, type, action } = data;
  
    // 🎯 Étape suivante
    if (type === "step:after" && action === "next") {
      setCurrentStep(index + 1);
    }
  
    // ⬅️ Étape précédente
    if (type === "step:after" && action === "prev") {
      setCurrentStep(index - 1);
    }
  
    // 🧼 Reset quand terminé ou skip
    if (status === "finished" || status === "skipped") {
      setRunTutorial(false);
      setCurrentStep(0);
    }
  
    // 🧭 Redirection après la dernière étape
    if (index === 3 && action === "next" && type === "step:after") {
      localStorage.setItem("joyrideStep", "4");
      navigate("/outdated");
    }
    
  };
  
  
  
  return (
<div
  className={`h-screen overflow-hidden p-4 sm:p-6 md:p-8 lg:p-10 transition-all duration-500 ease-in-out 
    ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
>


      {/* ✅ Joyride – Tutoriel interactif */}

<Joyride
  steps={steps}
  run={runTutorial}
  callback={handleJoyrideCallback}
  continuous
  showSkipButton
  scrollToFirstStep
  stepIndex={currentStep}
  styles={{ options: { zIndex: 10000 } }}
  locale={{
    back: "Précédent",
    close: "Fermer",
    next: `Suivant (${currentStep + 2}/${TOTAL_STEPS})`,
    last: `Suivant (${currentStep + 2}/${TOTAL_STEPS})`, // car "last" est utilisé dans certains cas par Joyride
    skip: "Passer",
  }}  
/>





      {/* ✅ Coin utilisateur */}
      <div id="user-info" style={{ position: "absolute", top: "1.25rem", left: "1.25rem" }}>
      <motion.div
  id="user-info"
  className={`rounded-lg shadow-lg p-6 w-72 ${
    darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
  }`}
  initial={{ opacity: 0, x: -30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8, ease: "easeInOut" }}
>

<div className="flex items-center mb-4">
  <UserCircleIcon
    className={`h-12 w-12 ${
      darkMode ? "text-indigo-400" : "text-indigo-600"
    }`}
  />
  <h2 className="text-2xl font-bold ml-4 flex items-center space-x-2">
    <span>{username ? username : "Utilisateur"}</span>
    <span>{getEmojiForRank(rank)}</span>
  </h2>
</div>

<p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
  Rang :{" "}
  <span className={`text-indigo-400 ${rank === "Maître" ? "text-yellow-400 font-bold" : ""}`}>
    {rank}
  </span>
</p>


{createdAt && (
  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
    Inscrit depuis :{" "}
    <span className="text-indigo-400">
      {new Date(createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </span>
  </p>
)}



        <button
          onClick={handleLogout}
          className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300"
        >
          Se déconnecter
        </button>
      </motion.div>
      </div>

      {/* ✅ Logo et Titre */}
      <div className="text-center mb-8">
        <img
          src={darkMode ? logoWhite : logoBlack}
          alt="Logo"
          className="mx-auto h-auto transition-all duration-500 w-64"
        />
        <h1
          className={`text-4xl font-bold mt-4 transition-all duration-500 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Vulnerabilities Academy
        </h1>
      </div>

{/* ✅ Boutons Trier et Dark Mode */}
<div className="flex justify-end mt-6 relative">
  <div id="dashboard-controls" className="flex space-x-4">
    <div ref={menuRef}>
      <button
        onClick={() => setSortMenuVisible(!sortMenuVisible)}
        className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full transition-all duration-300 shadow-lg hover:scale-110"
      >
        <HiOutlineSortDescending className="h-6 w-6" />
      </button>
      {sortMenuVisible && (
        <div
          className={`absolute right-0 mt-2 w-40 ${
            darkMode ? "bg-gray-700" : "bg-gray-300"
          } shadow-lg rounded-lg z-50`}
        >
          <button
            onClick={() => sortModules("difficulty")}
            className="block w-full px-4 py-2 text-left hover:bg-indigo-500 hover:text-white"
          >
            Par difficulté
          </button>
          <button
            onClick={() => sortModules("impact")}
            className="block w-full px-4 py-2 text-left hover:bg-indigo-500 hover:text-white"
          >
            Par impact
          </button>
        </div>
      )}
    </div>

    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`p-4 rounded-full transition-all duration-500 ease-in-out shadow-lg hover:scale-110
        ${darkMode ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-800 hover:bg-gray-900"}
      `}      
    >
      <SunIcon className="h-6 w-6 text-white" />
    </button>
  </div>
</div>

      {/* ✅ Modules */}
      <div
        id="modules-grid"
        className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
{modules.map((module) => (
  <motion.div
    key={module.id}
    id={`module-${module.id}`}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: module.id * 0.1 }}
  >
    <Module
      module={module}
      darkMode={darkMode}
      progress={module.progress}
    />
  </motion.div>
))}


      </div>

      {/* 🧭 Bouton pour relancer le tutoriel */}
<button
  onClick={() => {
    setCurrentStep(0);
    setRunTutorial(true);
  }}
  className="fixed top-6 right-6 bg-sky-500 hover:bg-sky-600 p-2 rounded-full shadow-lg transition-all duration-300 z-50"
  title="Relancer l'introduction"
>
  <QuestionMarkCircleIcon className="h-5 w-5 text-white" />
</button>

    </div>

    
  );
};

export default Dashboard;
