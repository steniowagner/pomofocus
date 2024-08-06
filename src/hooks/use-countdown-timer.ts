import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type StartParams = {
  duration: number;
  onFinish: () => void;
  startTime: number;
};

export const useCountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);

  const intervalId = useRef<ReturnType<typeof setInterval>>();

  const formattedTimeLeft = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }, [timeLeft]);

  const start = useCallback((params: StartParams) => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    const updateTimer = () => {
      const timeElapsed = Math.floor((Date.now() - params.startTime) / 1000);
      const timeLeft = params.duration - timeElapsed;
      const timer = timeLeft > 0 ? timeLeft : 0;
      setTimeLeft(timer);
      if (timer === 0) {
        clearInterval(intervalId.current);
        params.onFinish();
      }
    };
    updateTimer();
    intervalId.current = setInterval(updateTimer, 1000);
  }, []);

  const reset = useCallback((resetTo: number) => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    setTimeLeft(resetTo);
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalId.current);
  }, []);

  return {
    timeLeft: formattedTimeLeft,
    setTimeLeft,
    start,
    reset,
  };
};
