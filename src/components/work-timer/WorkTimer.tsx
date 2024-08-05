import { useWorkTimer } from "./use-work-timer";

export const WorkTimer = () => {
  const workTimer = useWorkTimer();

  return (
    <div className="w-64 h-20 bg-red-200 px-4 py-2">
      <div>
        <h1>{workTimer.timeLeft}</h1>
        <div className="w-full flex justify-between">
          <button onClick={workTimer.start}>Start</button>
          <button onClick={workTimer.reset}>Reset</button>
        </div>
      </div>
    </div>
  );
};
