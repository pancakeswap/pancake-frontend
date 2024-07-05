import { Box, BoxProps, Flex, FlexProps } from "@pancakeswap/uikit";
import styled from "styled-components";

import { flyingAnim } from "./animations";

const Container = styled(Flex)`
  z-index: 1;
  position: relative;
  width: 50%;
`;

type SizeVariant = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

const variantFallback: SizeVariant[] = ["xs", "sm", "md", "lg", "xl", "xxl"];

function getFallbackVariant(variants: GraphicVariants | undefined, expectVariant: SizeVariant) {
  const defaultFallback = "xxl";
  if (!variants) {
    return defaultFallback;
  }
  const index = variantFallback.indexOf(expectVariant);
  if (index === -1) {
    return defaultFallback;
  }
  return variantFallback.slice(index).find((variant) => Boolean(variants[variant])) || defaultFallback;
}

function getBackgroundGraphicVariant({
  size,
  $variants,
  $width,
  $height,
  $src,
}: {
  size: SizeVariant;
  $variants?: GraphicVariants;
  $src: string;
  $width: number;
  $height: number;
}) {
  const variant = getFallbackVariant($variants, size);
  return `
background-image: url("${$variants?.[variant]?.src || $src}");
width: ${$variants?.[variant]?.width || $width}px;
height: ${$variants?.[variant]?.height || $height}px;
`;
}

const CustomImage = styled(Box)<{
  $variants?: GraphicVariants;
  $src: string;
  $width: number;
  $height: number;
}>`
  background-size: cover;

  ${({ $variants, $width, $height, $src }) =>
    getBackgroundGraphicVariant({
      $variants,
      $width,
      $height,
      $src,
      size: "xs",
    })}

  ${({ theme }) => theme.mediaQueries.sm} {
    ${({ $variants, $width, $height, $src }) =>
      getBackgroundGraphicVariant({
        $variants,
        $width,
        $height,
        $src,
        size: "sm",
      })}
  }

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ $variants, $width, $height, $src }) =>
      getBackgroundGraphicVariant({
        $variants,
        $width,
        $height,
        $src,
        size: "md",
      })}
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    ${({ $variants, $width, $height, $src }) =>
      getBackgroundGraphicVariant({
        $variants,
        $width,
        $height,
        $src,
        size: "lg",
      })}
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    ${({ $variants, $width, $height, $src }) =>
      getBackgroundGraphicVariant({
        $variants,
        $width,
        $height,
        $src,
        size: "xl",
      })}
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    ${({ $variants, $width, $height, $src }) =>
      getBackgroundGraphicVariant({
        $variants,
        $width,
        $height,
        $src,
        size: "xxl",
      })}
  }
`;

function getGraphicImageSpecs({
  size,
  $width,
  $height,
}: {
  size: "sm" | "md" | "lg";
  $width: number;
  $height: number;
}) {
  let multiplier = 1;
  switch (size) {
    case "md":
      multiplier = 0.9375;
      break;
    case "sm":
      multiplier = 0.75;
      break;
    default:
      multiplier = 1;
  }
  return `
width: ${$width * multiplier}px;
height: ${$height * multiplier}px;
`;
}

const GraphicImage = styled(Box)<{
  $src: string;
  $width: number;
  $height: number;
}>`
  background-image: url("${({ $src }) => $src}");
  background-size: cover;

  ${({ $width, $height }) =>
    getGraphicImageSpecs({
      $width,
      $height,
      size: "sm",
    })}

  ${({ theme }) => theme.mediaQueries.sm} {
    ${({ $width, $height }) =>
      getGraphicImageSpecs({
        $width,
        $height,
        size: "md",
      })}
  }

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ $width, $height }) =>
      getGraphicImageSpecs({
        $width,
        $height,
        size: "lg",
      })}
  }
`;

const GraphicsPaintBoard = styled(Box)`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  height: 122%;
  overflow: hidden;
  border-radius: 0 0 32px 0;
`;

type GraphicItemProps = {
  className?: string;
  width: number;
  height: number;
  src: string;
};

export type GraphicDetail = {
  width: number;
  height: number;
  src: string;
};

export type GraphicVariants = {
  [Size in SizeVariant]?: GraphicDetail;
};

const GraphicItemContainer = styled(Box)`
  position: absolute;
`;

export function BannerGraphicItem({ src, height, width, className }: GraphicItemProps) {
  return (
    <GraphicItemContainer className={className}>
      <GraphicImage $src={src} $width={width} $height={height} />
    </GraphicItemContainer>
  );
}

const BackgroundItem = styled(GraphicItemContainer)`
  left: 5%;
  bottom: 0;

  ${({ theme }) => theme.mediaQueries.lg} {
    left: 50%;
    transform: translateX(-50%);
  }
`;

type BackgroundGraphicProps = {
  className?: string;
} & GraphicDetail &
  GraphicVariants;

export function BackgroundGraphic({ className, src, width, height, ...variants }: BackgroundGraphicProps) {
  return (
    <BackgroundItem className={className}>
      <CustomImage $src={src} $width={width} $height={height} $variants={variants} />
    </BackgroundItem>
  );
}

export const FloatingGraphic = styled(BannerGraphicItem)`
  left: 0;
  top: 30%;

  ${({ theme }) => theme.mediaQueries.sm} {
    left: 10%;
    top: 10%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    left: 10%;
    top: 0;
  }

  animation: ${flyingAnim} 2.5s ease-in-out infinite;
`;

interface BannerGraphicsProps extends FlexProps {
  paintBoardProps?: BoxProps;
  children?: React.ReactNode;
}

export function BannerGraphics({ children, paintBoardProps, ...props }: BannerGraphicsProps) {
  return (
    <Container {...props}>
      <GraphicsPaintBoard {...paintBoardProps}>{children}</GraphicsPaintBoard>
    </Container>
  );
}
