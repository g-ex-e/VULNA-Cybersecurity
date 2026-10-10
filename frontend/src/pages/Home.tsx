import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SunIcon } from "@heroicons/react/24/solid";
import logoWhite from "../assets/logo_white.png";
import logoBlack from "../assets/logo_black.png";
import { motion, AnimatePresence } from "framer-motion";

const Home: React.FC = () => {
  const navigate = useNavigate();

  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("✅ Déjà connecté, redirection vers le Dashboard...");
      navigate("/dashboard");
    }
  }, [navigate]);

  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("darkMode") === "false" ? false : true
  );
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (successMessage) {
      setShowMessage(true); // Affiche le message immédiatement
  
      const timer = setTimeout(() => {
        setShowMessage(false); // Déclenche l'animation de sortie
      }, 2000); // Affiche le message pendant 2 secondes
  
      const removeTimer = setTimeout(() => {
        setSuccessMessage(""); // Supprime complètement après l'animation
      }, 2500); // Supprime après 2.5s pour laisser le temps à l'animation
  
      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [successMessage]);
  
  

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "/login" : "/register";
    const body = JSON.stringify({ username, password });

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Une erreur est survenue");

      if (isLogin) {
        console.log("✅ Connexion réussie ! Token reçu :", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username); // 🔥 Sauvegarde du nom d'utilisateur
        localStorage.setItem("userId", data.user.id); // <=== Vérifie bien que `data.user.id` est défini
        console.log("UserID stocké dans localStorage :", localStorage.getItem("userId"));
        navigate("/dashboard");
      } else {
        setSuccessMessage("✅ Inscription réussie ! Connectez-vous.");
        setIsLogin(true);
      }
    } catch (error) {
      setError((error as Error).message);
      console.error("❌ Erreur lors de l'authentification :", error);
    }
  };

  return (
<AnimatePresence mode="wait">
  <motion.div
    key={darkMode ? "dark" : "light"} // important pour déclencher l'animation
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2}}
    className={`min-h-screen flex flex-col items-center justify-center
      ${darkMode ? "bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white" : "bg-gradient-to-r from-gray-100 via-gray-200 to-white text-gray-900"}`}
  >


<div className="text-center mb-8 mt-10">
  <img
    src={darkMode ? logoWhite : logoBlack}
    alt="Logo"
    className="w-64 h-auto mx-auto transition-all duration-700 ease-in-out"
  />
  <h1
    className={`text-4xl font-bold mt-4 transition-all duration-700 ease-in-out 
      ${darkMode ? "text-white" : "text-gray-900"}`}
  >
    Vulnerabilities Academy
  </h1>
</div>


{/* ✅ Pop-up avec correction du bug du carré vert */}
<motion.div
  className="absolute top-[235px] p-3 rounded-lg text-center font-medium shadow-md bg-green-500 text-white"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: showMessage ? 1 : 0, y: showMessage ? 0 : -10 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.5, ease: "easeInOut" }}
  style={{
    minHeight: "40px",
    visibility: showMessage ? "visible" : "hidden",
  }}
>
  {showMessage && successMessage}
</motion.div>


      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-all duration-500 
        ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
        style={{ transition: "margin 0.5s ease-in-out" }}

      >
        <h2 className="text-2xl font-semibold text-center mb-6">{isLogin ? "Connexion" : "Inscription"}</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all
              ${darkMode ? "bg-gray-700 text-white border-transparent" : "bg-gray-100 text-gray-900 border-gray-300"}`}
              placeholder="Entrez votre nom"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all
              ${darkMode ? "bg-gray-700 text-white border-transparent" : "bg-gray-100 text-gray-900 border-gray-300"}`}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <button className={`w-full py-2 rounded-lg font-medium transition duration-300
            ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"}`}
          >
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={`hover:underline transition-all duration-300 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
          >
            {isLogin ? "Pas encore de compte ? Inscrivez-vous" : "Déjà un compte ? Connectez-vous"}
          </button>
        </div>
      </motion.div>

      <div className="mt-8 flex justify-center">
  <button
    onClick={toggleDarkMode}
    className={`p-4 rounded-full transition-all duration-500 ease-in-out shadow-lg hover:scale-110
      ${darkMode ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-800 hover:bg-gray-900"}`}
    title="Changer le mode"
  >
    <SunIcon className="h-6 w-6 text-white" />
  </button>
</div>

      </motion.div>
</AnimatePresence>
  );
};

export default Home;
