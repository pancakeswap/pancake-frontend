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
  const cakeAsBigNumber = new BigNumber(cakeAsNumberBalance).multipliedBy(new BigNumber(10).pow(decimals))
  const cakeAsDisplayBalance = getFullDisplayBalance(amountCake, decimals, decimalsToRound)
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
  const sharesAsBigNumber = new BigNumber(sharesAsNumberBalance).multipliedBy(new BigNumber(10).pow(decimals))
  const sharesAsDisplayBalance = getFullDisplayBalance(amountShares, decimals, decimalsToRound)
  return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance }
}

export default convertSharesToCake
