import AccountNotConnect from "./Actions/AccountNotConnect";
import EnableStakeAction from "./Actions/EnableStakeAction";
import FarmTableHarvestAction from "./Actions/HarvestAction";
import StakeActionDataNotReady from "./Actions/StakeActionDataNotReady";
import StakeComponent from "./Actions/StakeComponent";
import StakedActionComponent from "./Actions/StakedActionComponent";
import { ActionContainer } from "./Actions/styles";
import CellLayout from "./CellLayout";
import Details from "./Details";
import Earned from "./Earned";
import FarmTokenInfo from "./FarmTokenInfo";
import Liquidity, { StakedLiquidity } from "./Liquidity";
import LpAmount from "./LpAmount";
import Multiplier from "./Multiplier";

const FarmTable = {
  CellLayout,
  Earned,
  Details,
  Liquidity,
  StakedLiquidity,
  Multiplier,
  FarmTokenInfo,
  FarmTableHarvestAction,
  AccountNotConnect,
  StakeComponent,
  StakeActionDataNotReady,
  EnableStakeAction,
  StakedActionComponent,
  LpAmount,
  ActionContainer,
};

export default FarmTable;
