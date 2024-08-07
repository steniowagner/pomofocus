import userEvent, { UserEvent } from "@testing-library/user-event";
import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PomodorosCompleted } from "./PomodorosCompleted";

class Sut {
  user: UserEvent;

  constructor() {
    render(<PomodorosCompleted />);
    this.user = userEvent.setup();
  }

  get components() {
    return {
      pomodorosCompleted: screen.queryByTestId("pomodoros-completed"),
    };
  }
}

describe("PauseTimer commponent", () => {
  it("should show the default text when the values were not updated yet", async () => {
    const sut = new Sut();
    await waitFor(() => {
      expect(sut.components.pomodorosCompleted).toHaveTextContent(
        "Pomodoros completed: 1/1"
      );
    });
  });

  it("should show the text correctly when the 'working-session-value's were retrieved from the storage", async () => {
    const currentWorkingSession = 1;
    const numberWorkingSessions = 3;
    global.chrome.storage.local.get = vi
      .fn()
      .mockImplementationOnce((_keys, callback) =>
        callback({
          currentWorkingSession,
          numberWorkingSessions,
        })
      );
    const sut = new Sut();
    await waitFor(() => {
      expect(sut.components.pomodorosCompleted).toHaveTextContent(
        `Pomodoros completed: ${currentWorkingSession}/${numberWorkingSessions}`
      );
    });
  });

  it("should show the text correctly when the 'working-session-value's were retrieved from a storage-change-event", async () => {
    const currentWorkingSession = 1;
    const numberWorkingSessions = 3;
    let listener = vi.fn();
    global.chrome.storage.onChanged.addListener = (eventListener) => {
      listener = eventListener;
    };
    const sut = new Sut();
    act(() => {
      listener({
        currentWorkingSession: {
          newValue: currentWorkingSession,
        },
        numberWorkingSessions: {
          newValue: numberWorkingSessions,
        },
      });
    });
    await waitFor(() => {
      expect(sut.components.pomodorosCompleted).toHaveTextContent(
        `Pomodoros completed: ${currentWorkingSession}/${numberWorkingSessions}`
      );
    });
  });
});
