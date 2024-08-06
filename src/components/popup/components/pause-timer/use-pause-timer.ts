/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";

import { useCountdownTimer, useStorage } from "../../../../hooks";
import { TimerState } from "../../../../types";
import { events } from "../../../../utils";

type OnChangeStorage = {
  timerState: TimerState;
};

type GetStorageResult = {
  pauseStartTime: number;
  timerState: string;
};

export const usePauseTimer = () => {
  const [isPauseFromStorage, setPauseFromStorage] = useState(false);
  const [isPauseFromEvent, setPauseFromEvent] = useState(false);
  const [pauseType, setPauseType] = useState<string>("");

  const countdown = useCountdownTimer();

  const storage = useStorage({
    onChange: async (values: Record<string, unknown>) => {
      const { timerState } = values as OnChangeStorage;
      if (timerState === "FINISHED") {
        await events.sendMessage("START_PAUSE_TIMER");
      }
      setPauseType(
        `Time for a ${timerState === "SHORT_PAUSE" ? "short" : "long"} pause`
      );
      const isPaused =
        timerState === "SHORT_PAUSE" || timerState === "LONG_PAUSE";
      setPauseFromEvent(isPaused);
    },
    keysToWatch: "timerState",
  });

  const handleFinishPause = useCallback(async () => {
    await events.sendMessage("FINISH_PAUSE_TIMER");
    setPauseFromEvent(false);
    setPauseFromStorage(false);
  }, []);

  const start = useCallback(
    async (startTime: number) => {
      const pauseDuration = await storage.get<number>("pauseDuration");
      countdown.start({
        duration: pauseDuration,
        onFinish: handleFinishPause,
        startTime,
      });
    },
    [handleFinishPause, storage.get, countdown.start]
  );

  useEffect(() => {
    const handleStartCountdown = async () => {
      const { pauseStartTime, timerState } =
        await storage.get<GetStorageResult>(["pauseStartTime", "timerState"]);
      if (pauseStartTime) {
        setPauseType(
          `Time for a ${timerState === "SHORT_PAUSE" ? "short" : "long"} pause`
        );
        setPauseFromStorage(true);
        start(pauseStartTime);
      }
    };
    handleStartCountdown();
  }, []);

  useEffect(() => {
    if (isPauseFromEvent) {
      start(Date.now());
    }
  }, [isPauseFromEvent]);

  return {
    isPaused: isPauseFromEvent || isPauseFromStorage,
    timeLeft: countdown.timeLeft,
    pauseType,
  };
};
