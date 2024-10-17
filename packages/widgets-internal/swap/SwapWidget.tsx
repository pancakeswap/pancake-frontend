import { styled } from "styled-components";

import { ArrowDownIcon, ArrowUpDownIcon, ButtonProps, IconButton } from "@pancakeswap/uikit";
import { CurrencyInputHeader, CurrencyInputHeaderSubTitle, CurrencyInputHeaderTitle } from "./CurrencyInputHeader";
import { CurrencyInputPanel } from "./CurrencyInputPanel";
import { SwapFooter as Footer } from "./Footer";
import { SwapPage as Page } from "./Page";
import { SwapInfo as Info, SwapInfoLabel as InfoLabel } from "./SwapInfo";
import { TradePrice } from "./TradePrice";

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

export {
  CurrencyInputHeader,
  CurrencyInputHeaderSubTitle,
  CurrencyInputHeaderTitle,
  CurrencyInputPanel,
  Footer,
  Info,
  InfoLabel,
  Page,
  SwitchButton,
  TradePrice,
};
