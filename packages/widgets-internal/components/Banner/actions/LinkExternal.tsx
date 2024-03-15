import { LinkExternal, LinkProps, Text } from "@pancakeswap/uikit";
import { PropsWithChildren } from "react";
import { styled } from "styled-components";

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
      <Text bold color={color} fontSize={["14px", "14px", "16px"]} lineHeight={["16px"]}>
        {children}
      </Text>
    </StyledLinkExternal>
  );
}
