import { FlexGap } from "@pancakeswap/uikit";
import { PropsWithChildren } from "react";

export const BannerActionContainer = ({ children }: PropsWithChildren) => {
  return <FlexGap gap="8px">{children}</FlexGap>;
};
