import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

// 🔥 IMPORTS d'images locales
import img1 from "@/assets/1.jpg";
import img2 from "@/assets/2.jpg";
import img3 from "@/assets/3.jpg";
import img4 from "@/assets/logo.png";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-200">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-white shadow-md relative">
  <div className="flex items-center">
    <img src={img4} alt="Logo" className="h-10 w-auto" />
  </div>
  <div className="absolute left-1/2 transform -translate-x-1/2">
    <Button onClick={() => navigate("/login")}>Accès Staff</Button>
  </div>
</header>


      {/* Main Content */}
      <main className="flex flex-col items-center flex-grow p-8 space-y-12">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Créons ensemble des événements inoubliables
          </h1>
          <p className="text-gray-600 text-lg">
            Eventia est votre partenaire de confiance pour l'organisation de conférences, mariages et événements privés. Laissez-nous donner vie à vos plus belles idées.
          </p>
        </div>

        {/* Galerie d'images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <Card className="overflow-hidden">
            <img src={img1} alt="Conférence" className="object-cover w-full h-48" />
            <CardContent className="p-4">
              <p className="text-sm text-gray-700">Conférences professionnelles</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <img src={img2} alt="Mariage" className="object-cover w-full h-48" />
            <CardContent className="p-4">
              <p className="text-sm text-gray-700">Mariages de rêve</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <img src={img3} alt="Fête privée" className="object-cover w-full h-48" />
            <CardContent className="p-4">
              <p className="text-sm text-gray-700">Fêtes privées</p>
            </CardContent>
          </Card>
        </div>

        <Separator className="w-full max-w-2xl my-8" />

        {/* Formulaire de contact */}
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Prendre rendez-vous</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Nom complet" className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-400" />
            <input type="email" placeholder="Adresse email" className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-400" />
            <textarea placeholder="Parlez-nous de votre événement..." rows={4} className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-400" />
            <Button className="w-full text-lg" type="submit">Envoyer la demande</Button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center p-4 text-sm text-gray-500">
        © 2025 Eventia. Tous droits réservés.
      </footer>
    </div>
  );
}
