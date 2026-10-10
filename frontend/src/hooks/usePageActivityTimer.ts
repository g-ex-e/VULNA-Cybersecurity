import { useEffect, useRef } from "react";

export default function usePageActivityTimer(shouldTrack: boolean, onTick: () => void) {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldTrack) {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      onTick();
    }, 1000);

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [shouldTrack, onTick]);
}
