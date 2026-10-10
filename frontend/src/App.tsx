import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/Home.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Injection from "./pages/Injection.tsx";
import VulnerableAndOutdatedContent from "./pages/Outdated.tsx";
import SSRF from "./pages/SSRF.tsx";
import BrokenAccessControl from "./pages/BAC.tsx";
import CryptographicFailures from "./pages/CryptographicFailures.tsx";
import SDIF from "./pages/SDIF.tsx";

import { TimeTrackerProvider } from "./context/TimeTrackerContext.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";

// 🔁 HOC pour encapsuler l'effet de vérif de session
function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) return;

    const checkUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/user/${userId}`);
        if (!res.ok) throw new Error("Utilisateur invalide");

        const data = await res.json();
        if (!data.username) {
          throw new Error("Utilisateur non trouvé");
        }
      } catch (err) {
        console.warn("⛔ Session invalide. Déconnexion forcée.");
        localStorage.clear();
        navigate("/");
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/injection" element={<PrivateRoute><Injection /></PrivateRoute>} />
      <Route path="/outdated" element={<PrivateRoute><VulnerableAndOutdatedContent /></PrivateRoute>} />
      <Route path="/ssrf" element={<PrivateRoute><SSRF /></PrivateRoute>} />
      <Route path="/brokenaccesscontrol" element={<PrivateRoute><BrokenAccessControl /></PrivateRoute>} />
      <Route path="/cryptographicfailures" element={<PrivateRoute><CryptographicFailures /></PrivateRoute>} />
      <Route path="/sdif" element={<PrivateRoute><SDIF /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <TimeTrackerProvider>
      <Router>
        <AppWrapper />
      </Router>
    </TimeTrackerProvider>
  );
}

export default App;
