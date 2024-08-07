import userEvent, { UserEvent } from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { describe, expect, it, Mock, vi } from "vitest";

import { defaultStorage } from "../../../../test/setup";
import { WorkTimer } from "./WorkTimer";
import { constants } from "../../../../utils";

class Sut {
  user: UserEvent;

  constructor() {
    render(
      <div className="dark">
        <WorkTimer />
      </div>
    );
    this.user = userEvent.setup();
  }

  get components() {
    return {
      timeLeft: screen.getByTestId("work-timer-time-left"),
      startButton: screen.getByTestId("work-timer-start-button"),
      resetButton: screen.getByTestId("work-timer-reset-button"),
    };
  }
}

describe("WorkTimer component", () => {
  describe("UI", () => {
    it("should show all elements correctly", async () => {
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.timeLeft).toBeInTheDocument();
        expect(sut.components.startButton).toBeInTheDocument();
        expect(sut.components.resetButton).toBeInTheDocument();
      });
    });
  });

  describe("Timer", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.clearAllTimers();
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    });

    describe("Initializing the timer from the storage values", () => {
      it("should set the initial timer correctly when the 'timerState' is 'IDLE'", async () => {
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.timeLeft).toHaveTextContent("25:00");
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'WORKING'", async () => {
        userEvent.setup({
          advanceTimers: (ms) => vi.advanceTimersByTime(ms),
        });
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              ...defaultStorage,
              workingStartTime: Date.now(),
              timerState: "WORKING",
            })
          );
        const sut = new Sut();
        await act(() => vi.runAllTimers());
        expect(sut.components.timeLeft).toHaveTextContent("25:00");
      });

      it("should set the initial timer correctly when the 'timerState' is 'RESET'", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementation((_keys, callback) =>
            callback({
              ...defaultStorage,
              timerState: "RESET",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.timeLeft).toHaveTextContent("25:00");
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'FINISHED'", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementation((_keys, callback) =>
            callback({
              ...defaultStorage,
              timerState: "FINISHED",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.timeLeft).toHaveTextContent("00:00");
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'SHORT_PAUSE'", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementation((_keys, callback) =>
            callback({
              ...defaultStorage,
              timerState: "SHORT_PAUSE",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.timeLeft).toHaveTextContent("00:00");
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'LONG_PAUSE'", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementation((_keys, callback) =>
            callback({
              ...defaultStorage,
              timerState: "SHORT_PAUSE",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.timeLeft).toHaveTextContent("00:00");
        });
      });
    });

    describe("Runnign the timer", () => {
      it("should run the timer correctly when the timer was initiated by a storage-value", async () => {
        userEvent.setup({
          advanceTimers: (ms) => vi.advanceTimersByTime(ms),
        });
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              ...defaultStorage,
              workingStartTime: Date.now(),
              timerState: "WORKING",
            })
          );
        const sut = new Sut();
        await act(() => vi.runAllTimers());
        expect(sut.components.timeLeft).toHaveTextContent("25:00");
        await act(() => vi.runAllTimers());
        expect(sut.components.timeLeft).toHaveTextContent("00:00");
      });

      describe("When a storage-change happens", () => {
        it("should run the timer correctly when the 'workingDuration' changed", async () => {
          userEvent.setup({
            advanceTimers: (ms) => vi.advanceTimersByTime(ms),
          });
          let listener = vi.fn();
          global.chrome.storage.onChanged.addListener = (eventListener) => {
            listener = eventListener as Mock;
          };
          const sut = new Sut();
          await waitFor(() => {});
          act(() => {
            listener({
              workingDuration: {
                newValue: 1 * 60,
              },
            });
          });
          await waitFor(() => {
            expect(sut.components.timeLeft).toHaveTextContent("01:00");
          });
        });

        it("should run the timer correctly when the 'timerState' changed to 'IDLE'", async () => {
          userEvent.setup({
            advanceTimers: (ms) => vi.advanceTimersByTime(ms),
          });
          let listener = vi.fn();
          global.chrome.storage.onChanged.addListener = (eventListener) => {
            listener = eventListener as Mock;
          };
          const sut = new Sut();
          await waitFor(() => {});
          global.chrome.storage.local.get = vi
            .fn()
            .mockImplementationOnce((_keys, callback) =>
              callback({
                workingDuration: 1 * 60,
              })
            );
          act(() => {
            listener({
              timerState: {
                newValue: "IDLE",
              },
            });
          });
          await waitFor(() => {
            expect(sut.components.timeLeft).toHaveTextContent("01:00");
          });
        });
      });
    });
  });

  describe("Disabling actions", () => {
    describe("From the timerState/storage", () => {
      beforeEach(() => {
        vi.clearAllMocks();
      });

      it("should not disable actions when the 'timerState' is 'IDLE'", async () => {
        const sut = new Sut();
        expect(sut.components.startButton).toHaveProperty("disabled", false);
        expect(sut.components.resetButton).toHaveProperty("disabled", false);
      });

      it("should disable the 'start-button' when the 'timerState' is 'WORKING'", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              ...defaultStorage,
              timerState: "WORKING",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.startButton).toHaveProperty("disabled", true);
          expect(sut.components.resetButton).toHaveProperty("disabled", false);
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'RESET'", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementation((_keys, callback) =>
            callback({
              ...defaultStorage,
              timerState: "RESET",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.startButton).toHaveProperty("disabled", false);
          expect(sut.components.resetButton).toHaveProperty("disabled", false);
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'FINISHED'", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementation((_keys, callback) =>
            callback({
              ...defaultStorage,
              timerState: "FINISHED",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.startButton).toHaveProperty("disabled", false);
          expect(sut.components.resetButton).toHaveProperty("disabled", false);
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'SHORT_PAUSE'", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementation((_keys, callback) =>
            callback({
              ...defaultStorage,
              timerState: "SHORT_PAUSE",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.startButton).toHaveProperty("disabled", true);
          expect(sut.components.resetButton).toHaveProperty("disabled", true);
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'LONG_PAUSE'", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementation((_keys, callback) =>
            callback({
              ...defaultStorage,
              timerState: "LONG_PAUSE",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.startButton).toHaveProperty("disabled", true);
          expect(sut.components.resetButton).toHaveProperty("disabled", true);
        });
      });
    });

    describe("From the timerState/storage-change", () => {
      beforeEach(() => {
        vi.clearAllMocks();
      });

      it("should not disable actions when the 'timerState' is 'IDLE'", async () => {
        let listener = vi.fn();
        global.chrome.storage.onChanged.addListener = (eventListener) => {
          listener = eventListener as Mock;
        };
        const sut = new Sut();
        await waitFor(() => {});
        act(() => {
          listener({
            timerState: {
              newValue: "IDLE",
            },
          });
        });
        await waitFor(() => {
          expect(sut.components.startButton).toHaveProperty("disabled", false);
          expect(sut.components.resetButton).toHaveProperty("disabled", false);
        });
      });

      it("should disable the 'start-button' when the 'timerState' is 'WORKING'", async () => {
        let listener = vi.fn();
        global.chrome.storage.onChanged.addListener = (eventListener) => {
          listener = eventListener as Mock;
        };
        const sut = new Sut();
        await waitFor(() => {});
        act(() => {
          listener({
            timerState: {
              newValue: "WORKING",
            },
          });
        });
        await waitFor(() => {
          expect(sut.components.startButton).toHaveProperty("disabled", true);
          expect(sut.components.resetButton).toHaveProperty("disabled", false);
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'RESET'", async () => {
        let listener = vi.fn();
        global.chrome.storage.onChanged.addListener = (eventListener) => {
          listener = eventListener as Mock;
        };
        const sut = new Sut();
        await waitFor(() => {});
        act(() => {
          listener({
            timerState: {
              newValue: "RESET",
            },
          });
        });
        await waitFor(() => {
          expect(sut.components.startButton).toHaveProperty("disabled", false);
          expect(sut.components.resetButton).toHaveProperty("disabled", false);
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'FINISHED'", async () => {
        let listener = vi.fn();
        global.chrome.storage.onChanged.addListener = (eventListener) => {
          listener = eventListener as Mock;
        };
        const sut = new Sut();
        await waitFor(() => {});
        act(() => {
          listener({
            timerState: {
              newValue: "FINISHED",
            },
          });
        });
        await waitFor(() => {
          expect(sut.components.startButton).toHaveProperty("disabled", false);
          expect(sut.components.resetButton).toHaveProperty("disabled", false);
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'SHORT_PAUSE'", async () => {
        let listener = vi.fn();
        global.chrome.storage.onChanged.addListener = (eventListener) => {
          listener = eventListener as Mock;
        };
        const sut = new Sut();
        await waitFor(() => {});
        act(() => {
          listener({
            timerState: {
              newValue: "SHORT_PAUSE",
            },
          });
        });
        await waitFor(() => {
          expect(sut.components.startButton).toHaveProperty("disabled", true);
          expect(sut.components.resetButton).toHaveProperty("disabled", true);
        });
      });

      it("should set the initial timer correctly when the 'timerState' is 'LONG_PAUSE'", async () => {
        let listener = vi.fn();
        global.chrome.storage.onChanged.addListener = (eventListener) => {
          listener = eventListener as Mock;
        };
        const sut = new Sut();
        await waitFor(() => {});
        act(() => {
          listener({
            timerState: {
              newValue: "LONG_PAUSE",
            },
          });
        });
        await waitFor(() => {
          expect(sut.components.startButton).toHaveProperty("disabled", true);
          expect(sut.components.resetButton).toHaveProperty("disabled", true);
        });
      });
    });
  });

  describe("Actions", () => {
    describe("Start", () => {
      beforeEach(() => {
        vi.clearAllMocks();
        vi.clearAllTimers();
        vi.useFakeTimers({ shouldAdvanceTime: true });
      });

      afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
      });

      describe("Firing events", () => {
        it("should fire 'events.sendMessage' correctly when starting", async () => {
          const sut = new Sut();
          await waitFor(() => {
            fireEvent.click(sut.components.startButton);
          });
          expect(chrome.runtime.sendMessage).toHaveBeenCalledOnce();
          const { mock } = chrome.runtime.sendMessage as Mock;
          expect(mock.lastCall![0].type).toEqual(
            constants.messages.START_WORK_TIMER
          );
          expect(new Date(mock.lastCall![0].workingStartTime)).toBeTruthy();
        });

        it("should fire 'events.sendMessage' correctly when finished", async () => {
          const sut = new Sut();
          await waitFor(() => {
            fireEvent.click(sut.components.startButton);
          });
          await act(() => vi.runAllTimers());
          expect(chrome.runtime.sendMessage).toHaveBeenCalled();
          const { mock } = chrome.runtime.sendMessage as Mock;
          expect(mock.lastCall![0]).toEqual({
            type: constants.messages.FINISH_WORK_TIMER,
            params: undefined,
          });
        });

        it("should show the timer correctly", async () => {
          const sut = new Sut();
          global.chrome.storage.local.get = vi
            .fn()
            .mockImplementationOnce((_keys, callback) =>
              callback({
                ...defaultStorage,
                workingDuration: 1 * 60,
              })
            );
          await waitFor(() => {
            fireEvent.click(sut.components.startButton);
          });
          await waitFor(() => {
            expect(sut.components.timeLeft).toHaveTextContent("01:00");
          });
        });
      });
    });

    describe("Reset", () => {
      it("should fire the 'events.sendMessage' correctly", async () => {
        const sut = new Sut();
        expect(sut.components.timeLeft).toHaveTextContent("00:00");
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              ...defaultStorage,
              workingDuration: undefined,
            })
          );
        await waitFor(() => {
          fireEvent.click(sut.components.resetButton);
        });
        expect(chrome.runtime.sendMessage).toHaveBeenCalled();
        const { mock } = chrome.runtime.sendMessage as Mock;
        expect(mock.lastCall![0]).toEqual({
          type: constants.messages.RESET_WORK_TIMER,
          params: undefined,
        });
      });

      it("should reset the timer to the correct value when 'storage.workingDuration' is defined", async () => {
        const sut = new Sut();
        expect(sut.components.timeLeft).toHaveTextContent("00:00");
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              ...defaultStorage,
              workingDuration: 1 * 60,
            })
          );
        await waitFor(() => {
          fireEvent.click(sut.components.resetButton);
        });
        await waitFor(() => {
          expect(sut.components.timeLeft).toHaveTextContent("01:00");
        });
      });

      it("should reset the timer to the correct value when 'storage.workingDuration' is not defined", async () => {
        const sut = new Sut();
        expect(sut.components.timeLeft).toHaveTextContent("00:00");
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              ...defaultStorage,
              workingDuration: undefined,
            })
          );
        await waitFor(() => {
          fireEvent.click(sut.components.resetButton);
        });
        await waitFor(() => {
          expect(sut.components.timeLeft).toHaveTextContent("25:00");
        });
      });
    });
  });
});
