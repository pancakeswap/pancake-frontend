import { FlexGap, useMatchBreakpoints, BreakpointChecks } from "@pancakeswap/uikit";
import styled from "styled-components";
import { PropsWithChildren } from "react";

import { WithBackground, WithBreakPoints } from "./types";

type ContainerProps = PropsWithChildren<{
  background?: string;
}>;

function getSize(breakPoints: BreakpointChecks) {
  if (breakPoints.isDesktop) {
    return "1128px";
  }
  return "100%";
}

function getHeight(breakPoints: BreakpointChecks) {
  if (breakPoints.isXs) {
    return "148px";
  }
  return "192px";
}

const Container = styled(FlexGap).attrs({
  flexDirection: "row",
  gap: "0",
  justifyContent: "space-between",
})<WithBreakPoints & WithBackground>`
  border-radius: 32px;
  width: ${(props) => getSize(props.$breakPoints)};
  height: ${(props) => getHeight(props.$breakPoints)};

  ${(props) =>
    props.$background &&
    `
    background: ${props.$background};
  `}
`;

export function BannerContainer({ children, background }: ContainerProps) {
  const breakPoints = useMatchBreakpoints();
  return (
    <Container $breakPoints={breakPoints} $background={background}>
      {children}
    </Container>
  );
}
