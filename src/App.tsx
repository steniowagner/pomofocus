import { useEffect, useState } from "react";
import { PauseTimer, WorkTimer } from "./components";
import { useStorage } from "./hooks";
import { TimerState } from "./types";

export const App = () => {
  const [timerState, setTimerState] = useState<TimerState>();
  const [currentWorkingSession, setCurrentWorkingSession] = useState<number>();
  const [numberWorkingSessions, setNumberWorkingSessions] = useState<number>();

  const storage = useStorage({
    keysToWatch: ["timerState", "currentWorkingSession"],
    onChange: (value) => {
      console.log(value);
      setTimerState(value.timerState as TimerState);
      if (value.currentWorkingSession) {
        setCurrentWorkingSession(value.currentWorkingSession as number);
      }
    },
  });

  useEffect(() => {
    const asd = async () => {
      const nws = await storage.get<number>("numberWorkingSessions");
      setNumberWorkingSessions(nws);
    };
    asd();
  }, []);

  return (
    <div>
      <WorkTimer />
      <PauseTimer />
      <h1>State: {timerState}</h1>
      <h1>Current-working-session: {currentWorkingSession}</h1>
      <h1>Number-working-sessions: {numberWorkingSessions}</h1>
    </div>
  );
};
