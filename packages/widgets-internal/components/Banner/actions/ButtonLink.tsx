import { Button, ButtonProps } from "@pancakeswap/uikit";
import { PropsWithChildren } from "react";
import { styled } from "styled-components";
import { LinkExternalAction, LinkProps } from "./LinkExternal";

type Props = {
  color?: string;
};

const StyledButton = styled(Button)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.2);

  &:hover > a {
    text-decoration: none;
  }
`;

export function ButtonLinkAction({
  children,
  color,
  href,
  external,
  externalIcon,
  ...props
}: PropsWithChildren<Props & LinkProps & ButtonProps>) {
  return (
    <StyledButton {...props}>
      <LinkExternalAction href={href} external={external} color={color} externalIcon={externalIcon}>
        {children}
      </LinkExternalAction>
    </StyledButton>
  );
}
