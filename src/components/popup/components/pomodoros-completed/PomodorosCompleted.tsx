import { usePomodorosCompleted } from "./use-pomodoros-completed";

export const PomodorosCompleted = () => {
  const pomodorsCompleted = usePomodorosCompleted();

  return (
    <p
      data-testid="pomodoros-completed"
      className="mt-4 text-sm font-medium text-accent-foreground"
    >
      {`Pomodoros completed: ${pomodorsCompleted.current}/${pomodorsCompleted.total}`}
    </p>
  );
};
