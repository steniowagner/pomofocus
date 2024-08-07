import { cn } from "../../utils";

type SwitchProps = {
  onToggle: () => void;
  checked: boolean;
  className?: string;
};

export const Switch = (props: SwitchProps) => (
  <label
    className={cn("inline-flex items-center cursor-pointer", props.className)}
  >
    <input
      type="checkbox"
      value=""
      checked={props.checked}
      className="sr-only peer"
      onChange={props.onToggle}
    />
    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer bg-inactive peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-switchActive"></div>
  </label>
);
