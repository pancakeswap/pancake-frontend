import { AtomBox, AtomBoxProps } from "@pancakeswap/ui";

export const Row = ({
  width = "100%",
  alignItems = "center",
  justifyContent = "flex-start",
  padding = "0px",
  ...props
}: AtomBoxProps) => (
  <AtomBox
    display="flex"
    width={width}
    alignItems={alignItems}
    justifyContent={justifyContent}
    padding={padding}
    {...props}
  />
);

export const AutoRow = (props: AtomBoxProps) => <Row flexWrap="wrap" {...props} />;

export const RowFixed = (props: AtomBoxProps) => <Row width="fit-content" flexWrap="wrap" {...props} />;

export const RowBetween = (props: AtomBoxProps) => <Row flexWrap="wrap" justifyContent="space-between" {...props} />;
