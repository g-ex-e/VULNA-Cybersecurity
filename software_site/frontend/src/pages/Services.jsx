import React from 'react'
export default function Services() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">Nos services</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Conversion PDF intelligente",
            desc: "Extraction automatique du texte et des métadonnées depuis vos fichiers PDF avec une précision optimale.",
          },
          {
            title: "Envoi par email (InMail)",
            desc: "Générez et envoyez des emails internes à partir du contenu de vos documents, sans effort.",
          },
          {
            title: "Audit de conformité",
            desc: "Analyse des contenus pour détecter la présence de données sensibles ou non conformes.",
          },
          {
            title: "Stockage sécurisé",
            desc: "Sauvegarde de vos fichiers dans une infrastructure cloud chiffrée, redondante et souveraine.",
          },
          {
            title: "Intégration API",
            desc: "Connectez notre moteur à vos outils internes via une API REST simple et rapide.",
          },
          {
            title: "Suivi et rapports",
            desc: "Tableaux de bord pour visualiser l'utilisation, les envois, les documents traités, etc.",
          }
        ].map((s, idx) => (
          <div key={idx} className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">{s.title}</h3>
            <p className="text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
