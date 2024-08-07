// import { useEffect, useState } from "react";

import { useState } from "react";
import { Button, Input, Switch } from "./components";
import { CompassIcon } from "lucide-react";

// import { PauseTimer, WorkTimer, Button } from "./components";
// import { useStorage } from "./hooks";
// import { TimerState } from "./types";
// import { events } from "./utils";

export const App = () => {
  const [value, setValue] = useState("");
  const [b, setB] = useState(false);
  const [l, setL] = useState(false);

  return (
    <div className="dark">
      <div className="w-screen h-screen bg-background">
        <Button variant="primary" className="ml-24 mt-24">
          qwe
        </Button>

        <Input
          className="mt-44"
          label="Short pause (minutes)"
          placeholder="Short pause in minutes"
          onChange={(e) => {}}
        />
        <Switch className="ml-44" checked onToggle={() => {}} />
      </div>
    </div>
  );
  // const [timerState, setTimerState] = useState<TimerState>();
  // const [currentWorkingSession, setCurrentWorkingSession] = useState<number>();
  // const [numberWorkingSessions, setNumberWorkingSessions] = useState<number>();

  // const storage = useStorage({
  //   keysToWatch: ["timerState", "currentWorkingSession"],
  //   onChange: (value) => {
  //     console.log(value);
  //     setTimerState(value.timerState as TimerState);
  //     if (value.currentWorkingSession) {
  //       setCurrentWorkingSession(value.currentWorkingSession as number);
  //     }
  //   },
  // });

  // useEffect(() => {
  //   const asd = async () => {
  //     const nws = await storage.get<number>("numberWorkingSessions");
  //     setNumberWorkingSessions(nws);
  //   };
  //   asd();
  // }, []);

  // useEffect(() => {
  //   events.onOpenPoup();
  // }, []);

  return (
    <div className="flex w-screen h-screen bg-red-200">
      <div className="dark">
        <div className="p-8 bg-background">
          <Button variant="primary" size="sm" onClick={() => {}}>
            Default
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <CompassIcon className="w-6 h-6" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => {}}>
            Secondary
          </Button>
          <Input
            placeholder="placeholder"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="number"
            label="Label"
            max={3}
            min={1}
          />
          <Switch checked={b} onToggle={() => setB((b) => !b)} />
        </div>
      </div>
      <div className="light">
        <div className="p-8 bg-background">
          <Button variant="primary" size="sm" onClick={() => {}}>
            Default
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <CompassIcon className="w-6 h-6" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => {}}>
            Secondary
          </Button>
          <Input
            placeholder="placeholder"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="number"
            label="Label"
          />
          <Switch checked={l} onToggle={() => setL((l) => !l)} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full py-8 px-8 bg-red-200">
      <h1>DARK</h1>
      <div className="flex flex-end dark mb-16 flex-column bg-primary">
        <Button variant="primary" onClick={() => {}}>
          Default
        </Button>
        <Button variant="ghost" size="icon" onClick={() => {}}>
          <CompassIcon className="w-6 h-6" />
        </Button>
        <Button variant="secondary" onClick={() => {}}>
          Secondary
        </Button>

        {/* <div className="display-hidden">
        <WorkTimer />
        <PauseTimer />
        <h1>State: {timerState}</h1>
        <h1>Current-working-session: {currentWorkingSession}</h1>
        <h1>Number-working-sessions: {numberWorkingSessions}</h1>
      </div> */}
      </div>
      <h1>LIGTH</h1>
      <div className="flex flex-end light flex-column bg-primary">
        <Button variant="primary" onClick={() => {}}>
          Default
        </Button>
        <Button variant="ghost" size="icon" onClick={() => {}}>
          <CompassIcon className="w-6 h-6" />
        </Button>
        <Button variant="secondary" onClick={() => {}}>
          Secondary
        </Button>

        {/* <div className="display-hidden">
        <WorkTimer />
        <PauseTimer />
        <h1>State: {timerState}</h1>
        <h1>Current-working-session: {currentWorkingSession}</h1>
        <h1>Number-working-sessions: {numberWorkingSessions}</h1>
      </div> */}
      </div>
    </div>
  );
};
