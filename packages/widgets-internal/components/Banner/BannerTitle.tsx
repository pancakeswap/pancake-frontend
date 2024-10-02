import { Text, TextProps, breakpoints } from "@pancakeswap/uikit";
import { PropsWithChildren } from "react";
import styled from "styled-components";

type VariantTypes = "white" | "gold" | "purple" | "orange" | "yellow" | "listaBlue" | "green";

type Props = {
  variant: VariantTypes | Variant;
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
  white: {
    color: "#ffffff",
    strokeColor: "#000000",
    strokeSize: 2,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: 800,
  },
  gold: {
    color: "#FFF500",
    strokeColor: "#081910",
    strokeSize: 2,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: 800,
  },
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
  listaBlue: {
    color: "#1F198A",
    strokeColor: "#1F198A",
    strokeSize: 0,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: 800,
  },
  green: {
    color: "#50E892",
    strokeColor: "#50E892",
    strokeSize: 0,
    fontSize: 28,
    lineHeight: 31,
    fontWeight: 800,
  },
};

function getTextShadow(color: string, size = 2) {
  return size
    ? `-${size}px ${size}px 0px ${color}, ${size}px ${size}px 0px ${color}, ${size}px -${size}px 0 ${color}, -${size}px -${size}px 0 ${color}`
    : "none";
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

const defaultStrokeSize = 2;
const defaultStrokeColor = "#ffffff";

export function BannerTitle({
  children,
  variant,
  strokeSize,
  strokeColor,
  color,
  ...props
}: PropsWithChildren<Omit<TextProps, "fontSize" | "lineHeight"> & Props>) {
  const variantData = typeof variant === "string" ? variants[variant] : variant;
  const {
    color: variantColor,
    fontSize,
    fontWeight,
    strokeSize: variantStrokeSize,
    strokeColor: variantStrokeColor,
    lineHeight,
  } = variantData;
  return (
    <FancyText
      color={color ?? variantColor}
      fontSize={fontSize}
      lineHeight={lineHeight}
      fontWeight={fontWeight}
      $strokeSize={strokeSize ?? variantStrokeSize ?? defaultStrokeSize}
      $strokeColor={strokeColor ?? variantStrokeColor ?? defaultStrokeColor}
      {...props}
    >
      {children}
    </FancyText>
  );
}
