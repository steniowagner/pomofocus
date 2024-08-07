import { usePauseTimer } from "./use-pause-timer";

export const PauseTimer = () => {
  const pauseTimer = usePauseTimer();

  if (!pauseTimer.isPaused) {
    return null;
  }

  return (
    <div
      data-testid="pause-timer-container"
      className="flex flex-col text-accent-foreground items-center bg-gray-200 py-2  text-gray-900"
    >
      <p data-testid="pause-timer-time-left" className="text-xl font-bold">
        {pauseTimer.timeLeft}
      </p>
      <p data-testid="pause-timer-pause-type" className="text-sm text-">
        {pauseTimer.pauseType}
      </p>
    </div>
  );
};
