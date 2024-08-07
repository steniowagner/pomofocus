import userEvent, { UserEvent } from "@testing-library/user-event";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ThemeContextProvider } from "../../../../contexts";
import { defaultStorage } from "../../../../test/setup";
import { Settings, SettingsProps } from "./Settings";
import { constants } from "../../../../utils";

class Sut {
  user: UserEvent;

  constructor(props?: SettingsProps) {
    const onSaveSettings = props?.onSaveSettings ?? vi.fn();
    render(
      <ThemeContextProvider>
        <Settings onSaveSettings={onSaveSettings} />
      </ThemeContextProvider>
    );
    this.user = userEvent.setup();
  }

  get components() {
    return {
      switch: screen.getByTestId("settings-theme-switch"),
      workingSessionsInput: screen.getByTestId(
        "settings-working-sessions-input"
      ),
      workingDurationInput: screen.getByTestId(
        "settings-working-duration-input"
      ),
      shortPauseInput: screen.getByTestId("settings-short-pause-input"),
      longPauseInput: screen.getByTestId("settings-long-pause-input"),
      saveButton: screen.getByTestId("settings-save-button"),
      cancelButton: screen.getByTestId("settings-cancel-button"),
    };
  }
}

describe("Settings component", () => {
  describe("UI", () => {
    it("should have all elements defined", async () => {
      const sut = new Sut();
      await waitFor(() => {
        expect(screen.getByText("Dark theme")).not.toBeNull();
        expect(screen.getByText("Settings")).not.toBeNull();
        expect(sut.components.workingSessionsInput).toBeInTheDocument();
        expect(sut.components.workingDurationInput).toBeInTheDocument();
        expect(sut.components.shortPauseInput).toBeInTheDocument();
        expect(sut.components.longPauseInput).toBeInTheDocument();
        expect(sut.components.saveButton).toBeInTheDocument();
        expect(sut.components.cancelButton).toBeInTheDocument();
      });
    });
  });

  describe("Toggling theme", () => {
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
        expect(sut.components.switch).toBeInTheDocument();
      });
      expect(sut.components.switch).toHaveProperty("checked", true);
      fireEvent.click(sut.components.switch);
      expect(sut.components.switch).toHaveProperty("checked", false);
    });

    it("should toggle the theme from LIGHT to DARK", async () => {
      global.chrome.storage.local.get = vi
        .fn()
        .mockImplementationOnce((_keys, callback) =>
          callback({
            theme: "light",
          })
        );
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.switch).toBeInTheDocument();
      });
      expect(sut.components.switch).toHaveProperty("checked", false);
      fireEvent.click(sut.components.switch);
      expect(sut.components.switch).toHaveProperty("checked", true);
    });
  });

  describe("Input values", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should render by default the inputs with the default", async () => {
      global.chrome.storage.local.get = vi
        .fn()
        .mockImplementationOnce((_keys, callback) =>
          callback({
            theme: "dark",
          })
        );
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.workingSessionsInput).toHaveProperty(
          "value",
          `${constants.values.timer.numberWorkingSessions}`
        );
        expect(sut.components.workingDurationInput).toHaveProperty(
          "value",
          `${constants.values.timer.workingDuration}`
        );
        expect(sut.components.shortPauseInput).toHaveProperty(
          "value",
          `${constants.values.timer.shortPauseDuration}`
        );
        expect(sut.components.longPauseInput).toHaveProperty(
          "value",
          `${constants.values.timer.longPauseDuration}`
        );
      });
    });

    it("should show the values from the storage correctly", async () => {
      global.chrome.storage.local.get = vi
        .fn()
        .mockImplementation((_keys, callback) => callback(defaultStorage));
      const sut = new Sut();
      await waitFor(() => {
        expect(sut.components.workingSessionsInput).toHaveProperty(
          "value",
          `${defaultStorage.numberWorkingSessions}`
        );
        expect(sut.components.workingDurationInput).toHaveProperty(
          "value",
          `${defaultStorage.workingDuration}`
        );
        expect(sut.components.shortPauseInput).toHaveProperty(
          "value",
          `${defaultStorage.shortPauseDuration}`
        );
        expect(sut.components.longPauseInput).toHaveProperty(
          "value",
          `${defaultStorage.longPauseDuration}`
        );
      });
    });

    it("should call 'storage.set' correctly when the user change the input values", async () => {
      const set = vi.fn();
      global.chrome.storage.local.set = set;
      global.chrome.storage.local.get = vi
        .fn()
        .mockImplementation((_keys, callback) => callback(defaultStorage));
      const sut = new Sut();
      const numberWorkingSessions = Math.floor(Math.random() * 10) + 1;
      const workingDuration = Math.floor(Math.random() * 10) + 1;
      const shortPauseDuration = Math.floor(Math.random() * 10) + 1;
      const longPauseDuration = Math.floor(Math.random() * 10) + 1;
      await waitFor(() => {
        fireEvent.change(sut.components.workingSessionsInput, {
          target: { value: numberWorkingSessions },
        });
        fireEvent.change(sut.components.workingDurationInput, {
          target: { value: workingDuration },
        });
        fireEvent.change(sut.components.shortPauseInput, {
          target: { value: shortPauseDuration },
        });
        fireEvent.change(sut.components.longPauseInput, {
          target: { value: longPauseDuration },
        });
        fireEvent.click(sut.components.saveButton);
      });
      expect(set).toHaveBeenCalledWith({ numberWorkingSessions });
      expect(set).toHaveBeenCalledWith({
        workingDuration: workingDuration * 60,
      });
      expect(set).toHaveBeenCalledWith({
        shortPauseDuration: shortPauseDuration * 60,
      });
      expect(set).toHaveBeenCalledWith({
        longPauseDuration: longPauseDuration * 60,
      });
    });
  });

  describe("Action buttons", () => {
    it("should call 'onSaveSettings' when pressing the 'save' button", async () => {
      const onSaveSettings = vi.fn();
      const sut = new Sut({ onSaveSettings });
      await waitFor(() => {
        fireEvent.click(sut.components.saveButton);
        expect(onSaveSettings).toHaveBeenCalledOnce();
      });
    });

    it("should call 'onSaveSettings' when pressing the 'cancel' button", async () => {
      const onSaveSettings = vi.fn();
      const sut = new Sut({ onSaveSettings });
      await waitFor(() => {
        fireEvent.click(sut.components.cancelButton);
        expect(onSaveSettings).toHaveBeenCalledOnce();
      });
    });
  });
});
