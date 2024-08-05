import { usePauseTimer } from "./use-pause-timer";

export const PauseTimer = () => {
  const pauseTimer = usePauseTimer();

  if (!pauseTimer.isPaused) {
    return null;
  }

  return <h1>{pauseTimer.timeLeft}</h1>;
};
