import { AtomBox, AtomBoxProps } from "@pancakeswap/ui";
import { ReactNode } from "react";
import { SwapFooter } from "./Footer";
import { pageVariants } from "./SwapWidget.css";

type SwapPageProps = AtomBoxProps & {
  removePadding?: boolean;
  hideFooterOnDesktop?: boolean;
  noMinHeight?: boolean;
  helpUrl?: string;
  isBSC?: boolean;
  helpImage?: ReactNode;
};

export const SwapPage = ({
  removePadding,
  noMinHeight,
  children,
  hideFooterOnDesktop,
  helpUrl,
  isBSC,
  helpImage,
  ...props
}: SwapPageProps) => (
  <AtomBox className={pageVariants({ removePadding, noMinHeight })} {...props}>
    {children}
    <AtomBox display="flex" flexGrow={1} />
    <AtomBox display={["block", null, null, hideFooterOnDesktop ? "none" : "block"]} width="100%">
      <SwapFooter isBSC={isBSC} helpUrl={helpUrl} helpImage={helpImage} />
    </AtomBox>
  </AtomBox>
);
