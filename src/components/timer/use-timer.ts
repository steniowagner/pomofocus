import { useCallback, useEffect } from "react";

import { storage, events, constants } from "../../utils";
import { Storage } from "../../utils/constants";
import { useCountdownTimer } from "../../hooks";

type Timers = Record<
  keyof Pick<Storage, "startTime" | "timerDuration">,
  number
>;

export const useTimer = () => {
  const countdown = useCountdownTimer();

  const start = useCallback(async () => {
    const startTime = Date.now();
    const [timerDuration] = await Promise.all([
      storage.get<number>("timerDuration"),
      events.sendMessage("START_TIMER", { startTime }),
    ]);
    countdown.start({
      onFinish: () => console.log("start-FINISHED"),
      duration: timerDuration,
      startTime,
    });
  }, [countdown]);

  const reset = useCallback(async () => {
    const [initialTimer] = await Promise.all([
      storage.get<number>("timerDuration"),
      events.sendMessage("RESET_TIMER"),
    ]);
    countdown.reset(initialTimer ?? constants.values.timer.defaultTimer);
  }, [countdown]);

  useEffect(() => {
    const handleStartCountdown = async () => {
      const items = await storage.get<Timers>(["startTime", "timerDuration"]);
      countdown.start({
        onFinish: () => console.log("handleStartCountdown-FINISHED"),
        duration: items.timerDuration,
        startTime: items.startTime,
      });
    };
    handleStartCountdown();
  }, []);

  useEffect(() => {
    events.onOpenPoup();
  }, []);

  return {
    timeLeft: countdown.timeLeft,
    start,
    reset,
  };
};
