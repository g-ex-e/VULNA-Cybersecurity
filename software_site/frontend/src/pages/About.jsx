import React from 'react'
export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Notre mission</h1>
      <p className="text-gray-700 text-lg">
        Chez DocuCloud, nous croyons en une gestion documentaire plus intelligente, plus rapide et plus humaine.
        Notre objectif : rendre la conversion de fichiers PDF accessible, sécurisée et automatisée pour toutes les équipes.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8">Nos valeurs</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>💡 Innovation continue</li>
        <li>🔐 Sécurité par conception</li>
        <li>🤝 Transparence & collaboration</li>
        <li>🌱 Évolutivité pour l'avenir</li>
      </ul>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center">
        <div>
          <p className="text-3xl font-bold text-blue-600">1M+</p>
          <p className="text-sm text-gray-600">Documents traités</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">99.98%</p>
          <p className="text-sm text-gray-600">Taux de disponibilité</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">30+</p>
          <p className="text-sm text-gray-600">Entreprises partenaires</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">2024</p>
          <p className="text-sm text-gray-600">Lancement de DocuCloud</p>
        </div>
      </div>
    </div>
  )
}
