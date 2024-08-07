import userEvent, { UserEvent } from "@testing-library/user-event";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ThemeContextProvider } from "../../contexts";
import { Popup } from "./Popup";

class Sut {
  user: UserEvent;

  constructor() {
    render(
      <ThemeContextProvider>
        <Popup />
      </ThemeContextProvider>
    );
    this.user = userEvent.setup();
  }

  get components() {
    return {
      themeProvider: screen.getByTestId("theme-provider"),
      popup: screen.getByTestId("popup"),
      worktTimer: screen.getByTestId("work-timer"),
      pomodorsCompleted: screen.getByTestId("pomodoros-completed"),
      pauseTimerContainer: screen.queryByTestId("pause-timer-container"),
      settings: screen.queryByTestId("settings"),
      settingsButon: screen.getByTestId("settings-button"),
      settingsCancelButton: screen.queryByTestId("settings-cancel-button"),
      settingsSaveButton: screen.queryByTestId("settings-save-button"),
      settingsThemeSwitch: screen.queryByTestId("settings-theme-switch"),
    };
  }
}

describe("Popup component", () => {
  describe("Calling 'events.openPoup'", () => {
    it("should set the popup as 'open'", async () => {
      const set = vi.fn();
      global.chrome.storage.local.set = set;
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.popup).toBeInTheDocument();
      });
      expect(chrome.runtime.connect).toHaveBeenCalledOnce();
      expect(set).toHaveBeenCalled();
      expect(set).toHaveBeenCalledWith({ isPopupOpen: true });
    });
  });

  describe("UI", () => {
    it("should render the default UI correctly", async () => {
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.popup).toBeInTheDocument();
      });
      expect(sut.components.worktTimer).toBeInTheDocument();
      expect(sut.components.pomodorsCompleted).toBeInTheDocument();
      expect(sut.components.pauseTimerContainer).not.toBeInTheDocument();
      expect(sut.components.settings).not.toBeInTheDocument();
    });

    it("should show the 'Settings component' when the user clicks the 'settings-button'", async () => {
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.popup).toBeInTheDocument();
      });
      expect(sut.components.settings).not.toBeInTheDocument();
      fireEvent.click(sut.components.settingsButon);
      await waitFor(() => {
        expect(sut.components.settings).toBeInTheDocument();
      });
    });

    it("should hide the 'Settings component' when the user clicks the 'settings-cancel' button ", async () => {
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.popup).toBeInTheDocument();
      });
      expect(sut.components.settings).not.toBeInTheDocument();
      fireEvent.click(sut.components.settingsButon);
      await waitFor(() => {
        expect(sut.components.settings).toBeInTheDocument();
      });
      fireEvent.click(sut.components.settingsCancelButton!);
      await waitFor(() => {
        expect(sut.components.settings).not.toBeInTheDocument();
      });
    });

    it("should hide the 'Settings component' when the user clicks the 'settings-save' button ", async () => {
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.popup).toBeInTheDocument();
      });
      expect(sut.components.settings).not.toBeInTheDocument();
      fireEvent.click(sut.components.settingsButon);
      await waitFor(() => {
        expect(sut.components.settings).toBeInTheDocument();
      });
      fireEvent.click(sut.components.settingsSaveButton!);
      await waitFor(() => {
        expect(sut.components.settings).not.toBeInTheDocument();
      });
    });
  });

  describe("Theme", () => {
    describe("Switch initial state", () => {
      it("should mark the theme-switch as on when the current theme is 'dark'", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              theme: "dark",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.popup).toBeInTheDocument();
        });
        fireEvent.click(sut.components.settingsButon);
        await waitFor(() => {
          expect(sut.components.settings).toBeInTheDocument();
        });
        expect(sut.components.settingsThemeSwitch).toHaveProperty(
          "checked",
          true
        );
      });

      it("should mark the theme-switch as on when the current theme is 'dark'", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              theme: "light",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.popup).toBeInTheDocument();
        });
        fireEvent.click(sut.components.settingsButon);
        await waitFor(() => {
          expect(sut.components.settings).toBeInTheDocument();
        });
        expect(sut.components.settingsThemeSwitch).toHaveProperty(
          "checked",
          false
        );
      });
    });
  });

  describe("Toggling theme", () => {
    describe("From DARK to LIGHT", () => {
      it("should toggle the theme from DARK to LIGHT", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              theme: "dark",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.popup).toBeInTheDocument();
        });
        expect(sut.components.themeProvider).toHaveClass("dark");
        fireEvent.click(sut.components.settingsButon);
        await waitFor(() => {
          expect(sut.components.settings).toBeInTheDocument();
        });
        expect(sut.components.settingsThemeSwitch).toHaveProperty(
          "checked",
          true
        );
        fireEvent.click(sut.components.settingsThemeSwitch!);
        expect(sut.components.settingsThemeSwitch).toHaveProperty(
          "checked",
          false
        );
        expect(sut.components.themeProvider).toHaveClass("light");
      });

      it("should save the selected theme into the storage", async () => {
        const set = vi.fn();
        global.chrome.storage.local.set = set;
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              theme: "dark",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.popup).toBeInTheDocument();
        });
        fireEvent.click(sut.components.settingsButon);
        await waitFor(() => {
          expect(sut.components.settings).toBeInTheDocument();
        });
        expect(set).not.toHaveBeenCalledOnce();
        fireEvent.click(sut.components.settingsThemeSwitch!);
        expect(set.mock.lastCall![0]).toEqual({
          theme: "light",
        });
      });
    });

    describe("From LIGHT to DARK", () => {
      it("should toggle the theme from DARK to LIGHT", async () => {
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              theme: "light",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.popup).toBeInTheDocument();
        });
        expect(sut.components.themeProvider).toHaveClass("light");
        fireEvent.click(sut.components.settingsButon);
        await waitFor(() => {
          expect(sut.components.settings).toBeInTheDocument();
        });
        expect(sut.components.settingsThemeSwitch).toHaveProperty(
          "checked",
          false
        );
        fireEvent.click(sut.components.settingsThemeSwitch!);
        expect(sut.components.settingsThemeSwitch).toHaveProperty(
          "checked",
          true
        );
        expect(sut.components.themeProvider).toHaveClass("dark");
      });

      it("should save the selected theme into the storage", async () => {
        const set = vi.fn();
        global.chrome.storage.local.set = set;
        global.chrome.storage.local.get = vi
          .fn()
          .mockImplementationOnce((_keys, callback) =>
            callback({
              theme: "light",
            })
          );
        const sut = new Sut();
        await waitFor(() => {
          expect(sut.components.popup).toBeInTheDocument();
        });
        fireEvent.click(sut.components.settingsButon);
        await waitFor(() => {
          expect(sut.components.settings).toBeInTheDocument();
        });
        expect(set).not.toHaveBeenCalledOnce();
        fireEvent.click(sut.components.settingsThemeSwitch!);
        expect(set.mock.lastCall![0]).toEqual({
          theme: "dark",
        });
      });
    });
  });
});
