import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const navItems = [
    { label: 'Accueil', to: '/' },
    { label: 'À propos', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Équipe', to: '/team' },
    { label: 'InMail', to: '/inmail' },
  ]

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-16 flex items-center">
        {/* Logo aligné à gauche */}
        <div className="absolute left-0 text-xl font-bold text-gray-900">
          DocuCloud
        </div>

        {/* Liens centrés */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
          {navItems.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`font-medium ${
                location.pathname === to
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
