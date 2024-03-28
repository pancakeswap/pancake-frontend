import { BreakpointChecks, FlexGap, useMatchBreakpoints } from "@pancakeswap/uikit";
import { ReactNode } from "react";
import styled from "styled-components";

import { WithBreakPoints } from "./types";

type Props = {
  badges?: ReactNode;
  title?: ReactNode;
  desc?: ReactNode;
  actions?: ReactNode;
  containerStyle?: React.CSSProperties;
};

function getContainerPadding({ isXs, isMobile }: BreakpointChecks) {
  if (isMobile) {
    return "22px 0 22px 22px";
  }
  if (isXs) {
    return "16px";
  }
  return "16px 0 16px 24px";
}

const Container = styled(FlexGap).attrs({
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "6px",
})<WithBreakPoints>`
  z-index: 2;
  width: 50%;
  position: relative;
  padding: ${(props) => getContainerPadding(props.$breakPoints)};
`;

const Content = styled(FlexGap).attrs({
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: "12px",
})`
  width: 100%;
`;

const WordingSection = styled(FlexGap).attrs({
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: "6px",
})`
  width: 100%;
`;

const BadgeContainer = styled(FlexGap).attrs({
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: "8px",
  alignItems: "center",
})`
  width: 100%;
`;

function getActionGap({ isMobile }: BreakpointChecks) {
  if (isMobile) {
    return "8px";
  }
  return "12px";
}

const ActionContainer = styled(FlexGap).attrs({
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
})<WithBreakPoints>`
  width: 100%;
  flex-gap: ${(props) => getActionGap(props.$breakPoints)};
`;

export function BannerMain({ badges, title, desc, actions, containerStyle }: Props) {
  const breakPoints = useMatchBreakpoints();
  return (
    <Container $breakPoints={breakPoints} style={containerStyle}>
      <Content>
        {badges ? <BadgeContainer>{badges}</BadgeContainer> : null}
        {title || desc ? (
          <WordingSection>
            {title}
            {desc}
          </WordingSection>
        ) : null}
      </Content>
      {actions ? <ActionContainer $breakPoints={breakPoints}>{actions}</ActionContainer> : null}
    </Container>
  );
}
