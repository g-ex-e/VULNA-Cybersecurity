import React, { useState } from 'react'
import axios from 'axios'

export default function InMail() {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [pdf, setPdf] = useState(null)
  const [generatedMail, setGeneratedMail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('subject', subject)
    formData.append('pdf', pdf)

    try {
      const res = await axios.post('http://localhost:3947/api/inmail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const message = res.data.message
      setGeneratedMail(message)

      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
      window.location.href = mailtoLink

    } catch (err) {
      setError('Erreur lors de l’envoi. Vérifie le PDF ou le serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Envoyer un InMail avec document PDF</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Adresse email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Sujet"
          className="w-full p-2 border rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <input
          type="file"
          accept=".pdf"
          className="w-full"
          onChange={(e) => setPdf(e.target.files[0])}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Envoi...' : 'Envoyer InMail'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {generatedMail && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Aperçu du mail :</h2>
          <pre className="bg-gray-100 p-4 whitespace-pre-wrap rounded text-sm">{generatedMail}</pre>
        </div>
      )}
    </div>
  )
}
