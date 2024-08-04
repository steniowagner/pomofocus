import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { constants, storage, events } from "../../utils";

export const useTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);

  const intervalId = useRef<ReturnType<typeof setInterval>>();

  const formattedTimeLeft = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }, [timeLeft]);

  const countdown = useCallback(async () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    const updateTimer = async () => {
      const timeLeft = await events.sendMessage<number>("GET_TIMER");
      console.log("timeLeft: ", timeLeft);
      setTimeLeft(timeLeft);
      if (timeLeft === 0) {
        clearInterval(intervalId.current);
      }
    };
    await updateTimer();
    intervalId.current = setInterval(updateTimer, 1000);
  }, []);

  const start = useCallback(async () => {
    await events.sendMessage("START_TIMER", { startTimer: Date.now() });
    countdown();
  }, [countdown]);

  const reset = useCallback(async () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    const [initialTimer] = await Promise.all([
      storage.get<number>("TIMER_MINUTES", constants.values.timer.defaultTimer),
      events.sendMessage("RESET_TIMER"),
    ]);
    setTimeLeft(initialTimer);
  }, []);

  useEffect(() => {
    const handleStartCountdown = async () => {
      const timeLeft = await events.sendMessage<number>("GET_TIMER");
      if (timeLeft > 0) {
        return countdown();
      }
      const initialTimer = await storage.get<number>(
        "TIMER_MINUTES",
        constants.values.timer.defaultTimer
      );
      setTimeLeft(initialTimer);
    };
    handleStartCountdown();
  }, []);

  useEffect(() => {
    events.onOpenPoup();
    return () => clearInterval(intervalId.current);
  }, []);

  return {
    timeLeft: formattedTimeLeft,
    start,
    reset,
  };
};
