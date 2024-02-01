import { Box, Flex, useMatchBreakpoints, BreakpointChecks } from "@pancakeswap/uikit";
import { PropsWithChildren, useMemo } from "react";
import styled from "styled-components";
import Image from "next/legacy/image";

import { flyingAnim } from "./animations";

const Container = styled(Flex)`
  position: relative;
  flex: 1;
`;

const GraphicsPaintBoard = styled(Box)`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  height: 122%;
  overflow: hidden;
`;

type GraphicItemProps = {
  className?: string;
  width: number;
  height: number;
  src: string;
  alt?: string;
};

const GraphicItemContainer = styled(Box)`
  position: absolute;
`;

function getItemSize({ isTablet, isMobile }: BreakpointChecks, width: number, height: number) {
  let multiplier = 1;
  if (isTablet) {
    multiplier = 0.9375;
  } else if (isMobile) {
    multiplier = 0.75;
  }
  return {
    width: width * multiplier,
    height: height * multiplier,
  };
}

export function BannerGraphicItem({ src, height: maxHeight, width: maxWidth, alt, className }: GraphicItemProps) {
  const breakPoints = useMatchBreakpoints();
  const { width, height } = useMemo(
    () => getItemSize(breakPoints, maxWidth, maxHeight),
    [breakPoints, maxWidth, maxHeight]
  );
  return (
    <GraphicItemContainer className={className}>
      <Image src={src} alt={alt} width={width} height={height} unoptimized layout="fixed" />
    </GraphicItemContainer>
  );
}

export const PrimaryGraphicItem = styled(BannerGraphicItem)<{
  $breakPoints: BreakpointChecks;
}>`
  left: ${(props) => `calc(${props.$breakPoints.isMobile ? 0.1 : 1} * 50%)`};
  bottom: 0;

  ${(props) => !props.$breakPoints.isMobile && "transform: translateX(-50%);"}
`;

export function PrimaryGraphic(props: GraphicItemProps) {
  const breakPoints = useMatchBreakpoints();
  return <PrimaryGraphicItem $breakPoints={breakPoints} {...props} />;
}

const SecondaryGraphicItem = styled(BannerGraphicItem)<{
  $breakPoints: BreakpointChecks;
}>`
  left: ${(props) => (props.$breakPoints.isDesktop ? "15%" : "2%")};
  bottom: -2%;
`;

export function SecondaryGraphic(props: GraphicItemProps) {
  const breakPoints = useMatchBreakpoints();
  const { isMobile } = breakPoints;
  if (isMobile) {
    return null;
  }
  return <SecondaryGraphicItem $breakPoints={breakPoints} {...props} />;
}

function getTertiaryPosition({ isMobile, isTablet }: BreakpointChecks) {
  if (isTablet) {
    return "386px";
  }
  if (isMobile) {
    return "180px";
  }
  return "434px";
}

const TertiaryGraphicItem = styled(BannerGraphicItem)<{
  $breakPoints: BreakpointChecks;
}>`
  left: ${(props) => getTertiaryPosition(props.$breakPoints)};
  bottom: -5%;
  transform: translateX(-50%);
`;

export function TertiaryGraphic(props: GraphicItemProps) {
  const breakPoints = useMatchBreakpoints();
  return <TertiaryGraphicItem $breakPoints={breakPoints} {...props} />;
}

const FloatingGraphicItem = styled(BannerGraphicItem)<{
  $breakPoints: BreakpointChecks;
}>`
  left: ${(props) => (props.$breakPoints.isMobile ? "0" : "10%")};
  top: ${(props) => (props.$breakPoints.isMobile ? "30%" : "0")};

  animation: ${flyingAnim} 2.5s ease-in-out infinite;
`;

export function FloatingGraphic(props: GraphicItemProps) {
  const breakPoints = useMatchBreakpoints();
  return <FloatingGraphicItem $breakPoints={breakPoints} {...props} />;
}

export function BannerGraphics({ children }: PropsWithChildren) {
  return (
    <Container>
      <GraphicsPaintBoard>{children}</GraphicsPaintBoard>
    </Container>
  );
}
