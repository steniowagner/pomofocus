/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";

import { useCountdownTimer, useStorage } from "../../hooks";
import { TimerState } from "../../types";
import { events } from "../../utils";

type OnChangeStorage = {
  timerState: TimerState;
};

export const useRestTimer = () => {
  const [isStartedRestFromStorage, setStartedRestFromStorage] = useState(false);
  const [isStartedRestFromEvent, setStartedRestFromEvent] = useState(false);

  const countdown = useCountdownTimer();

  const storage = useStorage({
    onChange: async (values: Record<string, unknown>) => {
      const { timerState } = values as OnChangeStorage;
      if (timerState === "FINISHED") {
        await events.sendMessage("START_REST_TIMER");
      }
      if (timerState === "RESTING") {
        setStartedRestFromEvent(true);
      }
    },
    keysToWatch: "timerState",
  });

  const handleFinishRest = useCallback(async () => {
    await events.sendMessage("FINISH_REST_TIMER");
    setStartedRestFromEvent(false);
    setStartedRestFromStorage(false);
  }, []);

  const start = useCallback(
    async (startTime: number) => {
      const restDuration = await storage.get<number>("restDuration");
      countdown.start({
        duration: restDuration,
        onFinish: handleFinishRest,
        startTime,
      });
    },
    [handleFinishRest, storage.get, countdown.start]
  );

  useEffect(() => {
    const handleStartCountdown = async () => {
      const restStartTime = await storage.get<number>("restStartTime");
      if (restStartTime) {
        setStartedRestFromStorage(true);
        start(restStartTime);
      }
    };
    handleStartCountdown();
  }, []);

  useEffect(() => {
    if (isStartedRestFromEvent) {
      start(Date.now());
    }
  }, [isStartedRestFromEvent]);

  return {
    isResting: isStartedRestFromEvent || isStartedRestFromStorage,
    timeLeft: countdown.timeLeft,
  };
};
