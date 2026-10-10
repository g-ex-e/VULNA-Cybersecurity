import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom'; // ✅ Import de useNavigate pour la redirection

const Module = ({ module, darkMode, progress }) => {
  const navigate = useNavigate(); // ✅ Initialisation de la navigation

  const difficultyColors = {
    Facile: 'text-green-500',
    Intermédiaire: 'text-yellow-500',
    Avancée: 'text-red-500',
  };

  // ✅ Fonction pour gérer la redirection lorsqu'on clique sur un module
  const handleClick = () => {
    if (module.id ===1) {
      navigate("/outdated");
    }
    if (module.id ===2) {
      navigate("/SSRF");
    }
    if (module.id === 3) { // ✅ Si c'est le module "Injection"
      navigate("/injection");
    }
    if (module.id ===4) {
      navigate("/brokenaccesscontrol");
    }
    if (module.id ===5) {
      navigate("/cryptographicfailures");
    }
    if (module.id ===6) {
      navigate("/sdif");
    }
  };

  return (
    <div
      onClick={handleClick} // ✅ Ajout du onClick pour rediriger vers Injection
      className={`module ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-md p-4 
        hover:shadow-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer`}
      style={{ willChange: 'transform' }}
    >
      <div className="flex items-center mb-4">
        <ShieldCheckIcon className={`h-8 w-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{module.name}</h2>
      </div>

      {/* Difficulté */}
      <p
        className={`text-base mb-1 ${difficultyColors[module.difficulty]}`}
        style={{ transition: 'none' }}
      >
        Difficulté: {module.difficulty}
      </p>

      {/* Barre de progression */}
      <div className="w-full bg-gray-300 rounded-full h-2.5">
        <div
          className="bg-indigo-500 h-2.5 rounded-full"
          style={{ width: `${progress || 0}%` }}
        ></div>
      </div>

      {/* Progression */}
      <p className="text-base text-gray-400 mt-2" style={{ transition: 'none' }}>
        Progression: {progress || 0}%
      </p>
    </div>
  );
};

export default Module;