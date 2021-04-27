import BigNumber from 'bignumber.js'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'

export const convertSharesToCake = (
  shares: BigNumber,
  cakePerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceAsNumber = getBalanceNumber(cakePerFullShare)
  const amountCake = new BigNumber(shares.multipliedBy(sharePriceAsNumber))
  const cakeAsNumberBalance = getBalanceNumber(amountCake, decimals)
  const cakeAsDisplayBalance = getFullDisplayBalance(amountCake, decimals, decimalsToRound)
  const cakeAsBigNumber = new BigNumber(amountCake)
  return { cakeAsNumberBalance, cakeAsBigNumber, cakeAsDisplayBalance }
}

export const convertCakeToShares = (
  cake: BigNumber,
  cakePerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceAsNumber = getBalanceNumber(cakePerFullShare)
  const amountShares = new BigNumber(cake.dividedBy(sharePriceAsNumber))
  const sharesAsNumberBalance = getBalanceNumber(amountShares, decimals)
  const sharesAsDisplayBalance = getFullDisplayBalance(amountShares, decimals, decimalsToRound)
  const sharesAsBigNumber = new BigNumber(amountShares)
  return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance }
}

export default convertSharesToCake
