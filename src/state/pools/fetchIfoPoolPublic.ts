import BigNumber from 'bignumber.js'
import { convertSharesToCake } from 'views/Pools/helpers'
import { multicallv2 } from 'utils/multicall'
import ifoPoolAbi from 'config/abi/ifoPool.json'
import { getIfoPoolAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'

export const fetchPublicIfoPoolData = async () => {
  try {
    const calls = [
      'getPricePerFullShare',
      'totalShares',
      'calculateHarvestCakeRewards',
      'calculateTotalPendingCakeRewards',
      'startBlock',
    ].map((method) => ({
      address: getIfoPoolAddress(),
      name: method,
    }))

    const [[sharePrice], [shares], [estimatedCakeBountyReward], [totalPendingCakeHarvest], [startBlock]] =
      await multicallv2(ifoPoolAbi, calls)

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const totalCakeInVaultEstimate = convertSharesToCake(totalSharesAsBigNumber, sharePriceAsBigNumber)
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCakeInVault: totalCakeInVaultEstimate.cakeAsBigNumber.toJSON(),
      estimatedCakeBountyReward: new BigNumber(estimatedCakeBountyReward.toString()).toJSON(),
      totalPendingCakeHarvest: new BigNumber(totalPendingCakeHarvest.toString()).toJSON(),
      creditStartBlock: startBlock.toNumber(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalCakeInVault: null,
      estimatedCakeBountyReward: null,
      totalPendingCakeHarvest: null,
    }
  }
}

export const fetchIfoPoolFeesData = async () => {
  try {
    const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: getIfoPoolAddress(),
      name: method,
    }))

    const [[performanceFee], [callFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2(ifoPoolAbi, calls)

    return {
      performanceFee: performanceFee.toNumber(),
      callFee: callFee.toNumber(),
      withdrawalFee: withdrawalFee.toNumber(),
      withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
    }
  } catch (error) {
    return {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicIfoPoolData
