import { Text, TextProps, breakpoints } from "@pancakeswap/uikit";
import { PropsWithChildren } from "react";
import styled from "styled-components";

type VariantTypes = "purple" | "orange" | "yellow";

type Props = {
  variant: VariantTypes;
  fontSize?: number;
  lineHeight?: number;
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
  orange: {
    color: "#FFB237",
    strokeColor: "#802A21",
    strokeSize: 2,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: 800,
  },
  yellow: {
    color: "#FFB237",
    strokeColor: "#7645D9",
    strokeSize: 2,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: 800,
  },
};

function getTextShadow(color: string, size = 2) {
  return `-${size}px ${size}px 0px ${color}, ${size}px ${size}px 0px ${color}, ${size}px -${size}px 0 ${color}, -${size}px -${size}px 0 ${color}`;
}

function getFontSpecs({
  size,
  fontSize,
  lineHeight,
}: {
  size: "xxs" | "xs" | "sm" | "md" | "lg";
  fontSize: number;
  lineHeight: number;
}) {
  let multiplier = 1;
  switch (size) {
    case "sm":
      multiplier = 0.85714286;
      break;
    case "xs":
      multiplier = 0.71428571;
      break;
    case "xxs":
      multiplier = 0.57142857;
      break;
    default:
      multiplier = 1;
  }
  return `
font-size: calc(${fontSize * multiplier} * 1px);
line-height: calc(${lineHeight * multiplier} * 1px);
`;
}

const FancyText = styled(Text)<{
  fontSize: number;
  lineHeight: number;
  $strokeSize: number;
  $strokeColor: string;
}>`
  ${({ fontSize, lineHeight }) => getFontSpecs({ size: "xxs", fontSize, lineHeight })}

  text-shadow: ${(props) => getTextShadow(props.$strokeColor, props.$strokeSize)};
  font-family: "Kanit", sans-serif;

  @media screen and (min-width: ${breakpoints.xs}px) {
    ${({ fontSize, lineHeight }) => getFontSpecs({ size: "xs", fontSize, lineHeight })}
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    ${({ fontSize, lineHeight }) => getFontSpecs({ size: "sm", fontSize, lineHeight })}
  }

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ fontSize, lineHeight }) => getFontSpecs({ size: "md", fontSize, lineHeight })}
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    ${({ fontSize, lineHeight }) => getFontSpecs({ size: "lg", fontSize, lineHeight })}
  }
`;

export function BannerTitle({
  children,
  variant,
  strokeSize: defaultStrokeSize = 2,
  strokeColor: defaultStrokeColor = "#ffffff",
  ...props
}: PropsWithChildren<Omit<TextProps, "fontSize" | "lineHeight"> & Props>) {
  const { color, fontSize, fontWeight, strokeSize, strokeColor, lineHeight } = variants[variant];
  return (
    <FancyText
      color={color}
      fontSize={fontSize}
      lineHeight={lineHeight}
      fontWeight={fontWeight}
      $strokeSize={strokeSize || defaultStrokeSize}
      $strokeColor={strokeColor || defaultStrokeColor}
      {...props}
    >
      {children}
    </FancyText>
  );
}
