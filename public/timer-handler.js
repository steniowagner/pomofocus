/* eslint-disable no-undef */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    timerState: "IDLE",
    workingDuration: 2,
    pauseDuration: 5,
  });
});

const startWorkTimer = ({ workingStartTime }) => {
  chrome.storage.local.set({ workingStartTime, timerState: "WORKING" });
  chrome.storage.local.get(["workingDuration"], (result) => {
    chrome.alarms.clear("POMODORO_FINISHED_ALARM");
    chrome.alarms.create("POMODORO_FINISHED_ALARM", {
      delayInMinutes: result.workingDuration / 60,
    });
  });
};

const resetWorkTimer = () => {
  chrome.storage.local.set({ workingStartTime: 0, timerState: "RESET" });
  chrome.alarms.clear("POMODORO_FINISHED_ALARM");
};

const finishWorkTimer = () => {
  chrome.storage.local.set({ workingStartTime: 0, timerState: "FINISHED" });
};

const startPauseTimer = () => {
  chrome.storage.local.set({
    pauseStartTime: Date.now(),
    timerState: "SHORT_PAUSE",
  });
  chrome.storage.local.get(["pauseDuration"], (result) => {
    chrome.alarms.clear("POMODORO_FINISHED_ALARM");
    chrome.alarms.create("POMODORO_FINISHED_ALARM", {
      delayInMinutes: result.pauseDuration / 60,
    });
  });
};

const finishPauseTimer = () => {
  chrome.storage.local.set({ pauseStartTime: undefined, timerState: "IDLE" });
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

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "POMODORO_FINISHED_ALARM") {
    chrome.storage.local.get("isPopupOpen", (result) => {
      if (!result.isPopupOpen) {
        chrome.tabs.query({ active: true }, (tabs) => {
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
