import { useRestTimer } from "./use-rest-timer";

export const RestTimer = () => {
  const restTimer = useRestTimer();

  if (!restTimer.isResting) {
    return null;
  }

  return <h1>{restTimer.timeLeft}</h1>;
};
