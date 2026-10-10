import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";

// Types
interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
}

interface TokenPayload {
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:7989/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        try {
          const decoded = jwtDecode<TokenPayload>(token);
          setRole(decoded.role);
          console.log("🔓 Your token payload:", decoded);
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      })
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex flex-col gap-8 items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">

        {/* Profil utilisateur */}
        <Card className="rounded-xl shadow-lg transition hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-blue-600">
              {role === "admin" ? "👑 Tableau de bord Administrateur" : "Mon Profil 👤"}
            </CardTitle>
            <CardDescription>
              {role === "admin" ? "Gestion des accès privilégiés" : "Résumé de votre compte"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700">
            <div><span className="font-semibold">Nom complet :</span> {user.fullName}</div>
            <div><span className="font-semibold">Email :</span> {user.email}</div>
            <div><span className="font-semibold">Rôle :</span> {role}</div>
          </CardContent>
        </Card>

        {/* Mes événements */}
        <Card className="rounded-xl shadow-lg transition hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-purple-600">🎉 Mes Evénements</CardTitle>
            <CardDescription>Historique de vos participations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700">
            <div>✨ Séminaire Leadership - Janvier 2025</div>
            <Separator />
            <div>💍 Mariage Privé - Mars 2025</div>
            <Separator />
            <div>🕺 Soirée d'Entreprise - Juin 2025</div>
          </CardContent>
        </Card>

{/* News internes */}
<Card className="rounded-xl shadow-lg transition hover:shadow-2xl col-span-1 md:col-span-2">
  <CardHeader>
    <CardTitle className="text-green-600">📢 News Interne Eventia</CardTitle>
    <CardDescription>Communiqués récents</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4 text-sm text-gray-700">
    <div>🔔 <strong>Lancement de Eventia Premium :</strong> Une nouvelle offre VIP dédiée aux événements de prestige.</div>
    <Separator />
    <div>📸 <strong>Prix "Best Event Agency 2025" :</strong> Eventia élue meilleure agence événementielle nationale.</div>
    <Separator />
    <div>🌍 <strong>Expansion internationale :</strong> Ouverture officielle de notre nouveau bureau à Barcelone !</div>

    {role === "admin" && (
      <>
        <Separator />
        <div className="text-red-500 font-semibold">
          ⚠️ Accès Restreint : Télécharger le Contrat Confidentiel
        </div>
        <Button
          onClick={() => window.open("http://localhost:7989/admin/contract.enc", "_blank")}
          className="mt-4 bg-red-500 hover:bg-red-600 w-full"
        >
          Télécharger le fichier sécurisé AES/ECB
        </Button>
      </>
    )}
  </CardContent>
</Card>
      </div>
    </div>
  );
}
