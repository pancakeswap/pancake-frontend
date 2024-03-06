import { AtomBox, AtomBoxProps, SwapCSS } from "@pancakeswap/uikit";

type SwapPageProps = AtomBoxProps & {
  removePadding?: boolean;
  noMinHeight?: boolean;
};

export const SwapPage = ({ removePadding, noMinHeight, children, ...props }: SwapPageProps) => (
  <AtomBox className={SwapCSS.pageVariants({ removePadding, noMinHeight })} {...props}>
    {children}
    <AtomBox display="flex" flexGrow={1} />
  </AtomBox>
);
