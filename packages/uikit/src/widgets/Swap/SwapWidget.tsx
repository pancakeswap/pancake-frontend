// import { AutoColumn } from "../../components/AutoColumn";
// import { AutoRow } from "../../components/AutoRow";
import { ButtonProps, IconButton } from "../../components/Button";
import { ArrowDownIcon, ArrowUpDownIcon } from "../../components/Svg";
import { switchButtonClass, iconDownClass, iconUpDownClass } from "./SwapWidget.css";
import { CurrencyInputPanel } from "./CurrencyInputPanel";
import { CurrencyInputHeader, CurrencyInputHeaderSubTitle, CurrencyInputHeaderTitle } from "./CurrencyInputHeader";
import { SwapPage } from "./Page";
import { SwapFooter } from "./Footer";
import { SwapInfo, SwapInfoLabel } from "./SwapInfo";

// const SwapBody = ({ children }) => (
//   <AutoColumn justifyItems="space-between">
//     <AutoRow>{children}</AutoRow>
//   </AutoColumn>
// );

const SwapSwitchButton = (props: ButtonProps) => (
  <IconButton className={switchButtonClass} variant="light" scale="sm" {...props}>
    <ArrowDownIcon className={iconDownClass} color="primary" />
    <ArrowUpDownIcon className={iconUpDownClass} color="primary" />
  </IconButton>
);

const Swap = {
  SwitchButton: SwapSwitchButton,
  CurrencyInputHeaderTitle,
  CurrencyInputHeaderSubTitle,
  CurrencyInputHeader,
  CurrencyInputPanel,
  Page: SwapPage,
  Footer: SwapFooter,
  Info: SwapInfo,
  InfoLabel: SwapInfoLabel,
};

export { Swap };
