import { useEffect, useState } from "react";

import { useStorage } from "../../../../hooks";

type WorkingSessionsValues = {
  currentWorkingSession: number;
  numberWorkingSessions: number;
};

export const usePomodorosCompleted = () => {
  const [currentWorkingSession, setCurrentWorkingSession] = useState(1);
  const [numberWorkingSessions, setNumberWorkingSessions] = useState(1);

  const storage = useStorage({
    keysToWatch: ["currentWorkingSession", "numberWorkingSessions"],
    onChange: (value) => {
      if (value.currentWorkingSession) {
        setCurrentWorkingSession(value.currentWorkingSession as number);
      }
      if (value.numberWorkingSessions) {
        setNumberWorkingSessions(value.numberWorkingSessions as number);
      }
    },
  });

  useEffect(() => {
    const handleSetInitialWorkingSessionValues = async () => {
      const values = await storage.get<WorkingSessionsValues>([
        "currentWorkingSession",
        "numberWorkingSessions",
      ]);
      setCurrentWorkingSession(
        values.currentWorkingSession === 0 ? 1 : values.currentWorkingSession
      );
      setNumberWorkingSessions(values.numberWorkingSessions);
    };
    handleSetInitialWorkingSessionValues();
  }, []);

  return {
    total: numberWorkingSessions,
    current: currentWorkingSession,
  };
};
