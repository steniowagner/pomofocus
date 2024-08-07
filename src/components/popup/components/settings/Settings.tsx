import { Button, Input, InputLabel, Switch } from "../../..";
import { constants } from "../../../../utils";
import { useSettings } from "./use-settings";
import { useThemeProvider } from "../../../../contexts";

type SettingsProps = {
  onSaveSettings: () => void;
};

export const Settings = (props: SettingsProps) => {
  const settings = useSettings({ onSaveSettings: props.onSaveSettings });
  const theme = useThemeProvider();

  return (
    <div className="w-full bg-background text-accent-foreground p-4 border border-0 border-t-2 border-gray-300">
      <div className="flex flex-col pb-4">
        <span className="text-lg font-semibold">Settings</span>
        <div className="flex flex-col gap-y-4 text-sm">
          <div className="flex justify-between items-center pt-2">
            <InputLabel>Dark theme</InputLabel>
            <Switch checked={theme.isDarkTheme} onToggle={theme.toggleTheme} />
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
            label="Work duration (minutes)"
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
            label="Short pause (minutes)"
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
            label="Long pause (minutes)"
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
      <div className="flex justify-end gap-x-2">
        <Button
          onClick={settings.onClickSaveSettings}
          size="sm"
          variant="primary"
        >
          Save
        </Button>
        <Button onClick={props.onSaveSettings} size="sm" variant="secondary">
          Cancel
        </Button>
      </div>
    </div>
  );
};
