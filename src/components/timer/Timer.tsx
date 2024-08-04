import { useTimer } from "./use-timer";

export const Timer = () => {
  const timer = useTimer();

  return (
    <div className="w-64 h-20 bg-red-200 px-4 py-2">
      <div>
        <h1>{timer.timeLeft}</h1>
        <div className="w-full flex justify-between">
          <button onClick={timer.start}>Start</button>
          <button onClick={timer.reset}>Reset</button>
        </div>
      </div>
      {/* <div>
        <h1>{countdownTimer.timeLeft}</h1>
        <div className="w-full flex justify-between">
          <button
            onClick={() =>
              countdownTimer.statCountdown({
                startTime: Date.now(),
                durationInSeconds: 5,
                onFinish: () => console.log("FINISHED"),
              })
            }
          >
            Start
          </button>
        </div>
      </div> */}
    </div>
  );
};
