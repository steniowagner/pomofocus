/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";

import { useCountdownTimer, useStorage } from "../../../../hooks";
import { events, constants } from "../../../../utils";
import { Storage, TimerState } from "../../../../types";

type GetStorageResult = Record<
  keyof Pick<Storage, "workingStartTime" | "workingDuration">,
  number
> & { timerState: TimerState };

type OnChangeStorage = {
  timerState: TimerState;
  workingDuration: number;
};

export const useWorkTimer = () => {
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(false);
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState(false);

  const countdown = useCountdownTimer();

  const disableActions = useCallback((timerState: TimerState) => {
    if (timerState === "WORKING") {
      setIsStartButtonDisabled(true);
      setIsResetButtonDisabled(false);
      return;
    }
    if (timerState === "LONG_PAUSE" || timerState === "SHORT_PAUSE") {
      setIsStartButtonDisabled(true);
      setIsResetButtonDisabled(true);
      return;
    }
    setIsStartButtonDisabled(false);
    setIsResetButtonDisabled(false);
  }, []);

  const storage = useStorage({
    keysToWatch: ["timerState", "workingDuration"],
    onChange: async (values: Record<string, unknown>) => {
      const { workingDuration, timerState } = values as OnChangeStorage;
      disableActions(timerState);
      if (workingDuration) {
        countdown.setTimeLeft(workingDuration);
      }
      if (timerState === "IDLE" && !workingDuration) {
        const workingDuration = await storage.get<number>("workingDuration");
        countdown.setTimeLeft(workingDuration);
      }
    },
  });

  const start = useCallback(async () => {
    const workingStartTime = Date.now();
    const [workingDuration] = await Promise.all([
      storage.get<number>("workingDuration"),
      events.sendMessage("START_WORK_TIMER", { workingStartTime }),
    ]);
    countdown.start({
      onFinish: () => events.sendMessage("FINISH_WORK_TIMER"),
      duration: workingDuration,
      startTime: workingStartTime,
    });
  }, [countdown.start, storage.get]);

  const reset = useCallback(async () => {
    const [workingDuration] = await Promise.all([
      storage.get<number>("workingDuration"),
      events.sendMessage("RESET_WORK_TIMER"),
    ]);
    countdown.reset(workingDuration ?? constants.values.timer.workingDuration);
  }, [countdown.start, storage.get]);

  useEffect(() => {
    const handleSetInitialTimer = async () => {
      const timers = await storage.get<GetStorageResult>([
        "workingStartTime",
        "workingDuration",
        "timerState",
      ]);
      disableActions(timers.timerState);
      if (timers.timerState === "IDLE") {
        countdown.setTimeLeft(timers.workingDuration);
      }
      if (timers.timerState === "WORKING") {
        countdown.start({
          onFinish: () => events.sendMessage("FINISH_WORK_TIMER"),
          duration: timers.workingDuration,
          startTime: timers.workingStartTime,
        });
      }
    };
    handleSetInitialTimer();
  }, []);

  return {
    timeLeft: countdown.timeLeft,
    isStartButtonDisabled,
    isResetButtonDisabled,
    start,
    reset,
  };
};
