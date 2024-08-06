import { useMemo } from "react";

// import { cn } from "../../utils";

type Variant = "primary" | "secondary" | "ghost";

type Size = "default" | "sm" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary:
    "border border-input bg-background hover:bg-accent text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground text-accent-foreground",
};

const sizes: Record<Size, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-8 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-8 w-8",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: Variant;
  size?: Size;
};

export const Button = (props: ButtonProps) => {
  const className = useMemo(() => {
    return `${props.className ?? ""} ${sizes[props.size ?? "default"]} ${
      variants[props.variant ?? "primary"]
    } inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`;
  }, [props]);

  return (
    <button className={className} {...props}>
      {props.children}
    </button>
  );
};
