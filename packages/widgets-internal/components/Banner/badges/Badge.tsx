import { FlexGap, Text, TextProps, useMatchBreakpoints } from "@pancakeswap/uikit";
import { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";
import Image from "next/legacy/image";

type Props = {
  logo?: ReactNode;
  text?: ReactNode;
};

const BadgeContainer = styled(FlexGap).attrs({
  flexDirection: "row",
  gap: "4px",
  alignItems: "center",
})``;

export function Badge({ logo, text }: Props) {
  return (
    <BadgeContainer>
      {logo}
      {text}
    </BadgeContainer>
  );
}

type BadgeLogoProps = {
  src: string;
  alt: string;
};

export function BadgeLogo({ src, alt }: BadgeLogoProps) {
  const { isXs } = useMatchBreakpoints();
  const size = isXs ? 16 : 20;
  return <Image src={src} alt={alt} width={size} height={size} unoptimized />;
}

export function BadgeText({ children, ...props }: PropsWithChildren<TextProps>) {
  return (
    <Text fontSize={16} lineHeight="20px" color="#090909" bold {...props}>
      {children}
    </Text>
  );
}
