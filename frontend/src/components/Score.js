import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid'; // Icône pour le score

const Score = () => {
  const totalScore = 10;

  return (
    <div className="score bg-indigo-500 rounded-lg shadow-md p-6 text-center">
      <div className="flex justify-center items-center mb-2">
        <TrophyIcon className="h-10 w-10 text-yellow-300 mr-2" />
        <h2 className="text-2xl font-bold text-white">Score Total</h2>
      </div>
      <p className="text-4xl font-extrabold text-gray-100">{totalScore}</p>
    </div>
  );
};

export default Score;
