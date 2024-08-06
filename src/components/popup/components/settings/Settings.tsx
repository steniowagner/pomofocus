import { Button, Input, InputLabel, Switch } from "../../..";
import { constants } from "../../../../utils";
import { useSettings } from "./use-settings";

export const Settings = () => {
  const settings = useSettings();

  return (
    <div className="w-full bg-background text-accent-foreground p-4">
      <div className="flex flex-col pb-4">
        <span className="text-md font-semibold">Settings</span>
        <div className="flex flex-col gap-y-4 text-sm">
          <div className="flex justify-between items-center pt-2">
            <InputLabel>Dark theme</InputLabel>
            <Switch checked onToggle={() => {}} />
          </div>
          <Input
            label="Working sessions"
            placeholder="How many working sessions?"
            value={settings.numberWorkingSessions}
            onChange={(e) =>
              settings.onChangeSettings("numberWorkingSessions", e.target.value)
            }
            type="number"
            min={1}
          />
          <Input
            label="Work duration"
            placeholder="Work duration in minutes"
            value={settings.workingDuration}
            onChange={(e) =>
              settings.onChangeSettings("workingDuration", e.target.value)
            }
            type="number"
            min={1}
            max={constants.values.timer.maxValue}
          />
          <Input
            label="Short pause"
            placeholder="Short pause in minutes"
            value={settings.shortPauseDuration}
            onChange={(e) =>
              settings.onChangeSettings("shortPauseDuration", e.target.value)
            }
            type="number"
            min={1}
            max={constants.values.timer.maxValue}
          />
          <Input
            label="Long pause"
            placeholder="Long pause in minutes"
            value={settings.longPauseDuration}
            onChange={(e) =>
              settings.onChangeSettings("longPauseDuration", e.target.value)
            }
            type="number"
            min={1}
            max={constants.values.timer.maxValue}
          />
        </div>
      </div>
      <Button onClick={settings.onClickSaveSettings} size="sm">
        Save
      </Button>
    </div>
  );
};
