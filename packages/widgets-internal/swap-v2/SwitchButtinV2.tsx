import { styled } from "styled-components";

import { ArrowUpDownIcon, ButtonProps, IconButton } from "@pancakeswap/uikit";

const SwitchIconButtonV2 = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`;

export const SwitchButtonV2 = (props: ButtonProps) => (
  <SwitchIconButtonV2 variant="light" scale="sm" {...props}>
    <ArrowUpDownIcon className="icon-up-down" color="primary" />
  </SwitchIconButtonV2>
);
