import { ArrowForwardIcon, Link, OpenNewIcon, Text, TextProps } from "@pancakeswap/uikit";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { styled } from "styled-components";

type Props = {
  color?: string;
};

export interface LinkProps extends TextProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  externalIcon?: "openNew" | "arrowForward";
}

const LinkExternal: React.FC<React.PropsWithChildren<LinkProps>> = ({
  children,
  externalIcon = "openNew",
  ...props
}) => {
  return (
    <Link external {...props}>
      {children}
      {externalIcon === "openNew" && <OpenNewIcon color={props.color ? props.color : "primary"} ml="4px" />}
      {externalIcon === "arrowForward" && <ArrowForwardIcon color={props.color ? props.color : "primary"} ml="4px" />}
    </Link>
  );
};

const StyledLinkExternal = styled(LinkExternal)`
  padding: 4px 0;

  &:hover {
    text-decoration: none;
    cursor: pointer;
  }
`;

export function LinkExternalAction({ children, color, ...props }: PropsWithChildren<Props & LinkProps>) {
  return (
    <StyledLinkExternal color={color} {...props}>
      <Text bold color={color} fontSize={["14px", "14px", "16px"]} lineHeight={["16px"]}>
        {children}
      </Text>
    </StyledLinkExternal>
  );
}
