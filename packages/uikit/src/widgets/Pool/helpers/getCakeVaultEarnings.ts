import BigNumber from "bignumber.js";
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from "@pancakeswap/utils/formatBalance";

// min deposit and withdraw amount
export const MIN_LOCK_AMOUNT = new BigNumber(10000000000000);

export const ENABLE_EXTEND_LOCK_AMOUNT = new BigNumber(100000000000000);

export const convertSharesToCake = (
  shares: BigNumber,
  cakePerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
  fee?: BigNumber
) => {
  const sharePriceNumber = getBalanceNumber(cakePerFullShare, decimals);
  const amountInCake = new BigNumber(shares.multipliedBy(sharePriceNumber)).minus(fee || BIG_ZERO);
  const cakeAsNumberBalance = getBalanceNumber(amountInCake, decimals);
  const cakeAsBigNumber = getDecimalAmount(new BigNumber(cakeAsNumberBalance), decimals);
  const cakeAsDisplayBalance = getFullDisplayBalance(amountInCake, decimals, decimalsToRound);
  return { cakeAsNumberBalance, cakeAsBigNumber, cakeAsDisplayBalance };
};

export const getCakeVaultEarnings = (
  account: string,
  cakeAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
  fee?: BigNumber
) => {
  const hasAutoEarnings = account && cakeAtLastUserAction?.gt(0) && userShares?.gt(0);
  const { cakeAsBigNumber } = convertSharesToCake(userShares, pricePerFullShare);
  const autoCakeProfit = cakeAsBigNumber.minus(fee || BIG_ZERO).minus(cakeAtLastUserAction);
  const autoCakeToDisplay = autoCakeProfit.gte(0) ? getBalanceNumber(autoCakeProfit, 18) : 0;

  const autoUsdProfit = autoCakeProfit.times(earningTokenPrice);
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0;
  return { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay };
};

export default getCakeVaultEarnings;
