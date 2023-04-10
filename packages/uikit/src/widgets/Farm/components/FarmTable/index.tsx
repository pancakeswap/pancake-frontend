import CellLayout from "./CellLayout";
import Earned from "./Earned";
import LpAmount from "./LpAmount";
import Details from "./Details";
import Liquidity, { StakedLiquidity } from "./Liquidity";
import Multiplier from "./Multiplier";
import FarmTokenInfo from "./FarmTokenInfo";
import FarmTableHarvestAction from "./Actions/HarvestAction";
import AccountNotConnect from "./Actions/AccountNotConnect";
import StakeComponent from "./Actions/StakeComponent";
import StakeActionDataNotReady from "./Actions/StakeActionDataNotReady";
import EnableStakeAction from "./Actions/EnableStakeAction";
import StakedActionComponent from "./Actions/StakedActionComponent";

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
};

export default FarmTable;
