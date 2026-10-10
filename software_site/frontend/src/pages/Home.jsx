import React from 'react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="text-gray-900">
      {/* Hero Section */}
      <section className="text-center py-24 bg-gradient-to-r from-blue-50 to-blue-100">
        <motion.h1
          className="text-5xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Gagnez du temps avec <span className="text-blue-600">DocuCloud</span>
        </motion.h1>
        <motion.p
          className="text-xl text-gray-700 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Gérez, convertissez et partagez vos documents PDF avec une efficacité maximale.
        </motion.p>
        <motion.div
          className="mt-10 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
        </motion.div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Ce que nous offrons</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: "🧠", title: "Extraction intelligente", desc: "Détecte et structure les données de vos documents automatiquement." },
            { icon: "📩", title: "Envoi instantané", desc: "Générez un InMail depuis un PDF en un clic." },
            { icon: "🛡️", title: "Sécurité intégrée", desc: "Chiffrement, sandboxing, isolation des process." },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="bg-gray-50 py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Ils nous font confiance</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            {
              name: "Alice R.",
              quote: "DocuCloud a divisé par 5 notre temps de traitement documentaire. L’intégration a été fluide.",
              company: "Responsable juridique, Novatech"
            },
            {
              name: "Yacine L.",
              quote: "Une solution fiable et simple, qui a transformé notre process RH.",
              company: "CTO, HumanCorp"
            }
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-lg shadow"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
              <p className="font-bold">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.company}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="text-center py-20 bg-blue-600 text-white">
        <motion.h2
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Prêt à transformer vos fichiers ?
        </motion.h2>
        <motion.p
          className="text-lg mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Lancez-vous gratuitement dès maintenant avec DocuCloud.
        </motion.p>
        <a href="/inmail" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Commencer avec InMail
        </a>
      </section>
    </div>
  )
}
