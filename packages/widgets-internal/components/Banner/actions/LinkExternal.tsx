import { styled } from "styled-components";
import { LinkExternal, Text, LinkProps } from "@pancakeswap/uikit";
import { PropsWithChildren } from "react";

type Props = {
  color?: string;
};

const StyledLinkExternal = styled(LinkExternal)`
  padding: 4px 0;
  font-size: 12px;
  line-height: 14px;
  texttransform: uppercase;

  &:hover {
    text-decoration: none;
    cursor: pointer;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    line-height: 16px;
    texttransform: capitalize;
  }
`;

export function LinkExternalAction({ children, color, ...props }: PropsWithChildren<Props & LinkProps>) {
  return (
    <StyledLinkExternal color={color} {...props}>
      <Text color={color} bold>
        {children}
      </Text>
    </StyledLinkExternal>
  );
}
