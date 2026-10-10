import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react"; // ⬅️ pour une animation de chargement sympa

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showFirstAccess, setShowFirstAccess] = useState(false);
  const [loadingFirstAccess, setLoadingFirstAccess] = useState(false);
  const navigate = useNavigate();

  const apiUrl = (window as any)?.AppConfig?.apiUrl || "http://localhost:7989";

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError("Identifiants invalides, veuillez réessayer.");
      }
    } catch {
      setError("Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.");
    }
  }

  function handleFirstAccess() {
    setLoadingFirstAccess(true);
    setTimeout(() => {
      setLoadingFirstAccess(false);
      setShowFirstAccess(true);
    }, 2000); // ⏳ Petite attente simulée de 2 secondes
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-800">
            Bienvenue chez Eventia !
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">Connectez-vous à votre espace personnel</p>
        </CardHeader>

        <Separator className="my-4" />

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full text-lg">
              Se connecter
            </Button>

            <div className="text-center mt-4 space-y-2">
              <p className="text-xs text-gray-500">
                Mot de passe oublié ?{" "}
                <a href="#" className="text-blue-600 hover:underline">Réinitialiser ici</a>
              </p>

              <Button
                variant="outline"
                className="w-full text-sm mt-2"
                onClick={handleFirstAccess}
                disabled={loadingFirstAccess}
              >
                {loadingFirstAccess ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" /> Vérification...
                  </span>
                ) : (
                  "Première connexion ? Demander l'accès"
                )}
              </Button>
            </div>

            {showFirstAccess && (
              <div className="mt-6 bg-gray-100 rounded-lg p-4 text-sm text-gray-700 space-y-2 shadow-inner">
                <p>🎉 Bienvenue chez Eventia !</p>
                <p>Si vous êtes un nouvel employé, merci de modifier vos identifiants après votre première connexion.</p>
                <Separator className="my-2" />
                <p><strong>Accès temporaire :</strong></p>
                <div className="pl-4">
                  <p><strong>Email :</strong> compte32@eventia.com</p>
                  <p><strong>Mot de passe :</strong> compte32</p>
                </div>
                <Separator className="my-2" />
                <p>Besoin d'aide ? Contactez l'équipe IT à support@eventia.com.</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
