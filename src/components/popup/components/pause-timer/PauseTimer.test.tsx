import userEvent, { UserEvent } from "@testing-library/user-event";
import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, expect, it, Mock, vi } from "vitest";

import { constants } from "../../../../utils";
import { PauseTimer } from "./PauseTimer";

class Sut {
  user: UserEvent;

  constructor() {
    render(<PauseTimer />);
    this.user = userEvent.setup();
  }

  get components() {
    return {
      container: screen.queryByTestId("pause-timer-container"),
      timeLeft: screen.queryByTestId("pause-timer-time-left"),
      pauseType: screen.queryByTestId("pause-timer-pause-type"),
    };
  }
}

describe("PauseTimer commponent", () => {
  describe("When the Timer is not Paused", () => {
    describe("Recovering the pause-state from the storage", () => {
      it("should not render when the Timer-state is not a PAUSE state", () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              timerState: "OTHER_THAN_PAUSE",
            })
          );
        const sut = new Sut();
        expect(sut.components.container).not.toBeInTheDocument();
      });

      it("should not render when the the 'pauseStartTime' is not defined", () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              timerState: "SHORT_PAUSE",
            })
          );
        const sut = new Sut();
        expect(sut.components.container).not.toBeInTheDocument();
      });
    });

    describe("Recovering the pause-state from a storage-change event", () => {
      it("should not render when the Timer-state is not a PAUSE state", () => {
        let listener = vi.fn();
        global.chrome.storage.onChanged.addListener = (eventListener) => {
          listener = eventListener as Mock;
        };
        const sut = new Sut();
        act(() => {
          listener({
            timerState: {
              newValue: "OTHER_THAN_PAUSE",
            },
          });
        });
        expect(sut.components.container).not.toBeInTheDocument();
      });
    });
  });

  describe("When the Timer is Paused", () => {
    describe("Recovering the pause-state from the storage", () => {
      it("should render correctly when the Timer-state is SHORT_PAUSE", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              pauseStartTime: Date.now(),
              timerState: "SHORT_PAUSE",
            })
          );
        const sut = new Sut();
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              pauseDuration: 2,
            })
          );
        await waitFor(() => {
          expect(sut.components.container).toBeInTheDocument();
          expect(sut.components.pauseType).toHaveTextContent(
            "Time for a short pause"
          );
          expect(sut.components.timeLeft).toHaveTextContent("00:02");
        });
      });

      it("should render correctly when the Timer-state is LONG_PAUSE", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              pauseStartTime: Date.now(),
              timerState: "LONG_PAUSE",
            })
          );
        const sut = new Sut();
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              pauseDuration: 2,
            })
          );
        await waitFor(() => {
          expect(sut.components.container).toBeInTheDocument();
          expect(sut.components.pauseType).toHaveTextContent(
            "Time for a long pause"
          );
          expect(sut.components.timeLeft).toHaveTextContent("00:02");
        });
      });
    });

    describe("Recovering the pause-state from a storage-change event", () => {
      it("should render correctly when the Timer-state is SHORT_PAUSE", async () => {
        let listener = vi.fn();
        global.chrome.storage.onChanged.addListener = (eventListener) => {
          listener = eventListener as Mock;
        };
        const sut = new Sut();
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              pauseDuration: 2,
            })
          );
        act(() => {
          listener({
            timerState: {
              newValue: "SHORT_PAUSE",
            },
          });
        });
        await waitFor(() => {
          expect(sut.components.container).toBeInTheDocument();
          expect(sut.components.pauseType).toHaveTextContent(
            "Time for a short pause"
          );
          expect(sut.components.timeLeft).toHaveTextContent("00:02");
        });
      });

      it("should render correctly when the Timer-state is LONG_PAUSE", async () => {
        let listener = vi.fn();
        global.chrome.storage.onChanged.addListener = (eventListener) => {
          listener = eventListener as Mock;
        };
        const sut = new Sut();
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              pauseDuration: 2,
            })
          );
        act(() => {
          listener({
            timerState: {
              newValue: "LONG_PAUSE",
            },
          });
        });
        await waitFor(() => {
          expect(sut.components.container).toBeInTheDocument();
          expect(sut.components.pauseType).toHaveTextContent(
            "Time for a long pause"
          );
          expect(sut.components.timeLeft).toHaveTextContent("00:02");
        });
      });
    });
  });

  describe("Firing events", () => {
    it("should send the 'START_PAUSE_TIMER' when the 'timerState' changes to 'FINISHED'", () => {
      let listener = vi.fn();
      global.chrome.storage.onChanged.addListener = (eventListener) => {
        listener = eventListener as Mock;
      };
      new Sut();
      act(() => {
        listener({
          timerState: {
            newValue: "FINISHED",
          },
        });
      });
      expect(chrome.runtime.sendMessage).toHaveBeenCalledOnce();
      const { mock } = chrome.runtime.sendMessage as Mock;
      expect(mock.lastCall![0]).toEqual({
        params: undefined,
        type: constants.messages.START_PAUSE_TIMER,
      });
    });

    describe("Firing the FINISH_PAUSE_TIMER event", () => {
      beforeEach(() => {
        vi.clearAllMocks();
        vi.clearAllTimers();
      });

      beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
      });

      afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
      });

      describe("When the pause started from a value in the storage and the pause is finished", () => {
        it("should fire the 'FINISH_PAUSE_TIMER'", async () => {
          userEvent.setup({
            advanceTimers: (ms) => vi.advanceTimersByTime(ms),
          });
          global.chrome.storage.local.get = vi
            .fn()
            .mockImplementationOnce((_keys, callback) =>
              callback({
                pauseStartTime: Date.now(),
                timerState: "SHORT_PAUSE",
              })
            );
          const sut = new Sut();
          global.chrome.storage.local.get = vi
            .fn()
            .mockImplementationOnce((_keys, callback) =>
              callback({
                pauseDuration: 3,
              })
            );
          await waitFor(() => {
            expect(sut.components.container).toBeInTheDocument();
          });
          await act(() => vi.runAllTimers());
          expect(chrome.runtime.sendMessage).toHaveBeenCalledOnce();
          const { mock } = chrome.runtime.sendMessage as Mock;
          expect(mock.lastCall![0]).toEqual({
            params: undefined,
            type: constants.messages.FINISH_PAUSE_TIMER,
          });
        });
      });

      describe("When the pause started from a storage-change and the pause is finished", () => {
        it("should fire the 'FINISH_PAUSE_TIMER'", async () => {
          userEvent.setup({
            advanceTimers: (ms) => vi.advanceTimersByTime(ms),
          });
          let listener = vi.fn();
          global.chrome.storage.onChanged.addListener = (eventListener) => {
            listener = eventListener as Mock;
          };
          const sut = new Sut();
          global.chrome.storage.local.get = vi
            .fn()
            .mockImplementationOnce((_keys, callback) =>
              callback({
                pauseDuration: 2,
              })
            );
          act(() => {
            listener({
              timerState: {
                newValue: "SHORT_PAUSE",
              },
            });
          });
          await waitFor(() => {
            expect(sut.components.container).toBeInTheDocument();
          });
          await act(() => vi.runAllTimers());
          expect(chrome.runtime.sendMessage).toHaveBeenCalledOnce();
          const { mock } = chrome.runtime.sendMessage as Mock;
          expect(mock.lastCall![0]).toEqual({
            params: undefined,
            type: constants.messages.FINISH_PAUSE_TIMER,
          });
        });
      });
    });
  });

  describe("Unmounting after the pause", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.clearAllTimers();
    });

    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    });

    it("should unmount the component when the pause is started by storage and finished", async () => {
      userEvent.setup({
        advanceTimers: (ms) => vi.advanceTimersByTime(ms),
      });
      global.chrome.storage.local.get = vi
        .fn()
        .mockImplementationOnce((_keys, callback) =>
          callback({
            pauseStartTime: Date.now(),
            timerState: "SHORT_PAUSE",
          })
        );
      const sut = new Sut();
      global.chrome.storage.local.get = vi
        .fn()
        .mockImplementationOnce((_keys, callback) =>
          callback({
            pauseDuration: 3,
          })
        );
      await waitFor(() => {
        expect(sut.components.container).toBeInTheDocument();
      });
      await act(() => vi.runAllTimers());
      expect(sut.components.container).not.toBeInTheDocument();
    });

    it("should unmount the component when the pause is started by storage-change event and finished", async () => {
      let listener = vi.fn();
      global.chrome.storage.onChanged.addListener = (eventListener) => {
        listener = eventListener as Mock;
      };
      const sut = new Sut();
      global.chrome.storage.local.get = vi
        .fn()
        .mockImplementationOnce((_keys, callback) =>
          callback({
            pauseDuration: 2,
          })
        );
      act(() => {
        listener({
          timerState: {
            newValue: "LONG_PAUSE",
          },
        });
      });
      await waitFor(() => {
        expect(sut.components.container).toBeInTheDocument();
      });
      await act(() => vi.runAllTimers());
      expect(sut.components.container).not.toBeInTheDocument();
    });
  });
});
