import React from 'react'
export default function Team() {
  const members = [
    {
      name: 'Jean Dupont',
      role: 'CTO & Co-fondateur',
      img: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Claire Martin',
      role: 'Responsable Produit',
      img: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Rachid B.',
      role: 'DevOps Engineer',
      img: 'https://randomuser.me/api/portraits/men/76.jpg',
    },
    {
      name: 'Julie R.',
      role: 'UX Designer',
      img: 'https://randomuser.me/api/portraits/women/65.jpg',
    }
  ]

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-10 text-center">Notre Équipe</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {members.map((member, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow text-center">
            <img
              src={member.img}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
