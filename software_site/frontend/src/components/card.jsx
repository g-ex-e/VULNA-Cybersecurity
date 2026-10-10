import React from 'react'

// Exemple de composant Card simple
export function Card({ children, className = "" }) {
    return (
      <div className={`bg-white p-4 rounded-xl shadow ${className}`}>
        {children}
      </div>
    );
  }
  