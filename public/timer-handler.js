/* eslint-disable no-undef */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    timerState: "IDLE",
    workingDuration: 60 * 2,
    pauseDuration: 60 * 5,
    shortPauseDuration: 60 * 5,
    longPauseDuration: 60 * 10,
    currentWorkingSession: 1,
    numberWorkingSessions: 3,
    theme: "light",
  });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "OPEN_POPUP_ALARM") {
    chrome.storage.local.get("isPopupOpen", (result) => {
      if (!result.isPopupOpen) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const [activeTab] = tabs;
          chrome.action.openPopup({ windowId: activeTab.windowId });
        });
      }
    });
  }
});

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    chrome.storage.local.set({ isPopupOpen: false });
  });
});

const startWorkTimer = ({ workingStartTime }) => {
  chrome.storage.local.get(["workingDuration"], (result) => {
    chrome.storage.local.set({
      timerState: "WORKING",
      workingStartTime,
    });
    chrome.alarms.clear("OPEN_POPUP_ALARM");
    chrome.alarms.create("OPEN_POPUP_ALARM", {
      delayInMinutes: result.workingDuration / 60,
    });
  });
};

const resetWorkTimer = () => {
  chrome.alarms.clear("OPEN_POPUP_ALARM");
  chrome.storage.local.set({
    workingStartTime: 0,
    timerState: "RESET",
  });
};

const finishWorkTimer = () => {
  chrome.storage.local.set({ workingStartTime: 0, timerState: "FINISHED" });
};

const startPauseTimer = () => {
  chrome.storage.local.get(
    [
      "shortPauseDuration",
      "longPauseDuration",
      "currentWorkingSession",
      "numberWorkingSessions",
    ],
    (result) => {
      const isLastWorkingSession =
        result.currentWorkingSession === result.numberWorkingSessions;
      const pauseDuration = isLastWorkingSession
        ? result.longPauseDuration
        : result.shortPauseDuration;
      chrome.storage.local.set({
        pauseStartTime: Date.now(),
        timerState: isLastWorkingSession ? "LONG_PAUSE" : "SHORT_PAUSE",
        pauseDuration,
      });
      chrome.alarms.clear("OPEN_POPUP_ALARM");
      chrome.alarms.create("OPEN_POPUP_ALARM", {
        delayInMinutes: pauseDuration / 60,
      });
    }
  );
};

const finishPauseTimer = () => {
  chrome.storage.local.get(
    ["timerState", "currentWorkingSession", "numberWorkingSessions"],
    (result) => {
      const isPaused =
        result.timerState !== "LONG_PAUSE" &&
        result.timerState !== "SHORT_PAUSE";
      if (isPaused) {
        return;
      }
      const currentWorkingSession =
        result.timerState === "LONG_PAUSE"
          ? 1
          : result.currentWorkingSession + 1;
      chrome.storage.local.set({
        pauseStartTime: undefined,
        currentWorkingSession,
        timerState: "IDLE",
      });
    }
  );
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "START_WORK_TIMER") {
    startWorkTimer(message.params);
  }
  if (message.type === "FINISH_WORK_TIMER") {
    finishWorkTimer();
  }
  if (message.type === "RESET_WORK_TIMER") {
    resetWorkTimer();
  }
  if (message.type === "START_PAUSE_TIMER") {
    startPauseTimer();
  }
  if (message.type === "FINISH_PAUSE_TIMER") {
    finishPauseTimer();
  }
  sendResponse();
  return true;
});
