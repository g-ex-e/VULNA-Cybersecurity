import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

type TimeTrackerContextType = {
  timeSpent: number | null;
  rank: string;
};

const TimeTrackerContext = createContext<TimeTrackerContextType>({
  timeSpent: null,
  rank: "Chargement...",
});

export const TimeTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeSpent, setTimeSpent] = useState<number | null>(null);
  const [rank, setRank] = useState("Chargement...");
  const lastSyncedRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const isTabActive = document.visibilityState === "visible";

  const syncTimeToServer = useCallback(() => {
    const userId = localStorage.getItem("userId");
    if (!userId || timeSpent === null) return;

    const diff = timeSpent - lastSyncedRef.current;
    if (diff >= 1) {
      navigator.sendBeacon(
        `http://localhost:5000/user/${userId}/add-time`,
        new Blob([JSON.stringify({ seconds: diff })], { type: "application/json" })
      );
      lastSyncedRef.current = timeSpent;
    }
  }, [timeSpent]);

  useEffect(() => {
    const fetchTime = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await fetch(`http://localhost:5000/user/${userId}/metrics`);
        const data = await res.json();

        const progressMap: { [key: number]: number } = {};
        data.moduleProgress.forEach((mod: { module_id: number; progress: number }) => {
          progressMap[mod.module_id] = mod.progress;
        });

        const totalProgress = Object.values(progressMap).reduce((a, b) => a + b, 0);
        const progressRatio = totalProgress / (Object.keys(progressMap).length * 100);

        if (progressRatio >= 0.9) setRank("Expert");
        else if (progressRatio >= 0.5) setRank("Intermédiaire");
        else if (progressRatio > 0) setRank("Débutant");
        else setRank("Nouveau");

        setTimeSpent(data.totalTime);
        lastSyncedRef.current = data.totalTime;
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des metrics :", err);
      }
    };

    fetchTime();

    const interval = window.setInterval(fetchTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tick = () => {
      if (isTabActive) {
        setTimeSpent((prev) => (prev !== null ? prev + 1 : prev));
      }
    };

    intervalRef.current = window.setInterval(tick, 1000);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [isTabActive]);

  useEffect(() => {
    window.addEventListener("beforeunload", syncTimeToServer);
    return () => {
      window.removeEventListener("beforeunload", syncTimeToServer);
    };
  }, [syncTimeToServer]);

  return (
    <TimeTrackerContext.Provider value={{ timeSpent, rank }}>
      {children}
    </TimeTrackerContext.Provider>
  );
};

export const useTimeTracker = () => useContext(TimeTrackerContext);
