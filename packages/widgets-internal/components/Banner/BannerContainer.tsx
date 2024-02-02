import { FlexGap } from "@pancakeswap/uikit";
import styled from "styled-components";
import { PropsWithChildren } from "react";

import { WithBackground } from "./types";

type ContainerProps = PropsWithChildren<{
  background?: string;
}>;

const Container = styled(FlexGap).attrs({
  flexDirection: "row",
  gap: "0",
  justifyContent: "space-between",
})<WithBackground>`
  border-radius: 32px;
  max-width: 100%;
  height: 192px;

  ${(props) =>
    props.$background &&
    `
    background: ${props.$background};
  `}

  ${({ theme }) => theme.mediaQueries.xxl} {
    max-width: 1128px;
  }
`;

export function BannerContainer({ children, background }: ContainerProps) {
  return <Container $background={background}>{children}</Container>;
}
