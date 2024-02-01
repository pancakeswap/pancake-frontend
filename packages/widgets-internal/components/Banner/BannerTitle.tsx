import { Text, TextProps, useMatchBreakpoints, BreakpointChecks } from "@pancakeswap/uikit";
import { PropsWithChildren, useMemo } from "react";
import styled from "styled-components";

type VariantTypes = "purple";

type Props = {
  variant: VariantTypes;
  strokeColor?: string;
  strokeSize?: number;
};

type Variant = {
  color: string;
  strokeColor: string;
  strokeSize: number;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
};

const variants: { [key in VariantTypes]: Variant } = {
  purple: {
    color: "#7645D9",
    strokeColor: "#ffffff",
    strokeSize: 2,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: 800,
  },
};

function getTextShadow(color: string, size = 2) {
  return `-${size}px ${size}px 0px ${color}, ${size}px ${size}px 0px ${color}, ${size}px -${size}px 0 ${color}, -${size}px -${size}px 0 ${color}`;
}

function getVariant(breakPoint: BreakpointChecks, variant: Variant) {
  const { fontSize, lineHeight } = variant;
  let multiplier = 1;
  if (breakPoint.isTablet) {
    multiplier = 0.85714286;
  } else if (breakPoint.isMobile) {
    multiplier = 0.71428571;
  } else if (breakPoint.isXs) {
    multiplier = 0.57142857;
  }

  return {
    ...variant,
    fontSize: Math.ceil(fontSize * multiplier),
    lineHeight: Math.ceil(lineHeight * multiplier),
  };
}

const FancyText = styled(Text)<{
  $strokeSize: number;
  $strokeColor: string;
}>`
  text-shadow: ${(props) => getTextShadow(props.$strokeColor, props.$strokeSize)};
  font-family: "Kanit", sans-serif;
`;

export function BannerTitle({
  children,
  variant,
  strokeSize: defaultStrokeSize = 2,
  strokeColor: defaultStrokeColor = "#ffffff",
  ...props
}: PropsWithChildren<TextProps & Props>) {
  const breakPoints = useMatchBreakpoints();
  const { color, fontSize, fontWeight, strokeColor, strokeSize, lineHeight } = useMemo(
    () => getVariant(breakPoints, variants[variant]),
    [breakPoints, variant]
  );
  return (
    <FancyText
      color={color}
      fontSize={fontSize}
      lineHeight={`${lineHeight}px`}
      fontWeight={fontWeight}
      $strokeSize={strokeSize || defaultStrokeSize}
      $strokeColor={strokeColor || defaultStrokeColor}
      {...props}
    >
      {children}
    </FancyText>
  );
}
