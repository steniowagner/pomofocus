// import { usePauseTimer } from "./use-pause-timer";

export const PauseTimer = () => {
  return (
    <div className="flex flex-col text-accent-foreground items-center bg-gray-200 py-2  text-gray-900">
      <p className="text-xl font-bold">00:00</p>
      <p className="text-sm text-">Rest pause</p>
    </div>
  );
  // const pauseTimer = usePauseTimer();

  // if (!pauseTimer.isPaused) {
  //   return null;
  // }

  // return <h1>{pauseTimer.timeLeft}</h1>;
};
