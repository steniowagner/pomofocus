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
      const timeLeft = await events.sendMessage<number>(
        constants.messages.GET_TIMER
      );
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
    await storage.set(constants.values.storage.TIMER_START, Date.now());
    countdown();
  }, [countdown]);

  const reset = useCallback(async () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    const [initialTimer] = await Promise.all([
      storage.get<number>(
        constants.values.storage.TIMER_MINUTES,
        constants.values.timer.defaultTimer
      ),
      storage.set(constants.values.storage.TIMER_START, 0),
    ]);
    setTimeLeft(initialTimer);
  }, []);

  useEffect(() => {
    const handleStartCountdown = async () => {
      const timeLeft = await events.sendMessage<number>(
        constants.messages.GET_TIMER
      );
      if (timeLeft > 0) {
        return countdown();
      }
      const initialTimer = await storage.get<number>(
        constants.values.storage.TIMER_MINUTES,
        constants.values.timer.defaultTimer
      );
      setTimeLeft(initialTimer);
    };
    handleStartCountdown();
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalId.current);
  }, []);

  return {
    timeLeft: formattedTimeLeft,
    start,
    reset,
  };
};
