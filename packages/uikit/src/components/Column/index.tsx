import { AtomBox, AtomBoxProps } from "@pancakeswap/ui";

export const Column = (props: AtomBoxProps) => (
  <AtomBox display="flex" flexDirection="column" justifyContent="flex-start" {...props} />
);
export const AutoColumn = ({ gap, justify, ...props }: AtomBoxProps & { justify?: any }) => (
  <AtomBox display="grid" gridAutoRows="auto" justifyItems={justify} rowGap={gap} {...props} />
);

export const ColumnCenter = (props: AtomBoxProps) => <Column width="100%" alignItems="center" {...props} />;
