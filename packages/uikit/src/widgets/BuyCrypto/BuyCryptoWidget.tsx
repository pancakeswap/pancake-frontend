import styled from "styled-components";

import { ButtonProps, IconButton } from "../../components/Button";
import { ArrowDownIcon, ArrowUpDownIcon } from "../../components/Svg";

import { InputHeader, InputHeaderSubTitle, InputHeaderTitle } from "./InputHeader";

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-up-down {
    display: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`;

const SwitchButton = (props: ButtonProps) => (
  <SwitchIconButton variant="light" scale="sm" {...props}>
    <ArrowDownIcon className="icon-down" color="primary" />
    <ArrowUpDownIcon className="icon-up-down" color="primary" />
  </SwitchIconButton>
);

export { SwitchButton, InputHeaderTitle, InputHeaderSubTitle, InputHeader };
