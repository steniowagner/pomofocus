type InputLabelProps = {
  children: string;
};

export const InputLabel = (props: InputLabelProps) => (
  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-accent-foreground">
    {props.children}
  </label>
);
