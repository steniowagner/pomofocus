/* eslint-disable no-undef */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    timerState: "IDLE",
    timerDuration: 2,
    restDuration: 5,
  });
});

const startWorkTimer = ({ startTime }) => {
  chrome.storage.local.set({ startTime, timerState: "RUNNING" });
  chrome.storage.local.get(["timerDuration"], (result) => {
    chrome.alarms.clear("POMODORO_FINISHED_ALARM");
    chrome.alarms.create("POMODORO_FINISHED_ALARM", {
      delayInMinutes: result.timerDuration / 60,
    });
  });
};

const resetWorkTimer = () => {
  chrome.storage.local.set({ startTime: 0, timerState: "RESET" });
  chrome.alarms.clear("POMODORO_FINISHED_ALARM");
};

const finishTimer = () => {
  chrome.storage.local.set({ startTime: 0, timerState: "FINISHED" });
};

const startRestTimer = () => {
  chrome.storage.local.set({
    restStartTime: Date.now(),
    timerState: "RESTING",
  });
  chrome.storage.local.get(["restDuration"], (result) => {
    chrome.alarms.clear("POMODORO_FINISHED_ALARM");
    chrome.alarms.create("POMODORO_FINISHED_ALARM", {
      delayInMinutes: result.restDuration / 60,
    });
  });
};

const finishRestTimer = () => {
  chrome.storage.local.set({ restStartTime: undefined, timerState: "IDLE" });
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "START_WORK_TIMER") {
    startWorkTimer(message.params);
  }
  if (message.type === "FINISH_WORK_TIMER") {
    finishTimer();
  }
  if (message.type === "RESET_WORK_TIMER") {
    resetWorkTimer();
  }
  if (message.type === "START_REST_TIMER") {
    startRestTimer();
  }
  if (message.type === "FINISH_REST_TIMER") {
    finishRestTimer();
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
