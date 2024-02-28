import { styled } from "styled-components";
import { Button, LinkProps } from "@pancakeswap/uikit";
import { PropsWithChildren } from "react";
import { LinkExternalAction } from "./LinkExternal";

type Props = {
  color?: string;
};

const StyledButton = styled(Button)<{
  $backgroundColor?: string;
  $textColor?: string;
  $boxShadow?: string;
}>`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.2);

  &:hover > a {
    text-decoration: none;
  }
`;

export function ButtonLinkAction({ children, color, href, external, ...props }: PropsWithChildren<Props & LinkProps>) {
  return (
    <StyledButton {...props}>
      <LinkExternalAction href={href} external={external} color={color}>
        {children}
      </LinkExternalAction>
    </StyledButton>
  );
}
