import { styled } from "styled-components";
import { LinkExternal, Text, LinkProps } from "@pancakeswap/uikit";
import { PropsWithChildren } from "react";

type Props = {
  color?: string;
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
      <Text color={color} fontSize={14} lineHeight="16px" bold>
        {children}
      </Text>
    </StyledLinkExternal>
  );
}
