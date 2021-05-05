import BigNumber from 'bignumber.js'
import { convertSharesToCake } from 'views/Pools/helpers'
import { getCakeVaultContract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'

const cakeVaultContract = getCakeVaultContract()

export const fetchPublicVaultData = async () => {
  try {
    const [sharePrice, shares, estimatedCakeBountyReward, totalPendingCakeHarvest] = await makeBatchRequest([
      cakeVaultContract.methods.getPricePerFullShare().call,
      cakeVaultContract.methods.totalShares().call,
      cakeVaultContract.methods.calculateHarvestCakeRewards().call,
      cakeVaultContract.methods.calculateTotalPendingCakeRewards().call,
    ])
    const totalSharesAsBigNumber = new BigNumber(shares as string)
    const sharePriceAsBigNumber = new BigNumber(sharePrice as string)
    const totalCakeInVaultEstimate = convertSharesToCake(totalSharesAsBigNumber, sharePriceAsBigNumber)
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCakeInVault: totalCakeInVaultEstimate.cakeAsBigNumber.toJSON(),
      estimatedCakeBountyReward: new BigNumber(estimatedCakeBountyReward as string).toJSON(),
      totalPendingCakeHarvest: new BigNumber(totalPendingCakeHarvest as string).toJSON(),
    }
  } catch (error) {
    return null
  }
}

export const fetchVaultFees = async () => {
  try {
    const [performanceFee, callFee, withdrawalFee, withdrawalFeePeriod] = await makeBatchRequest([
      cakeVaultContract.methods.performanceFee().call,
      cakeVaultContract.methods.withdrawFeePeriod().call,
      cakeVaultContract.methods.callFee().call,
      cakeVaultContract.methods.withdrawFee().call,
    ])
    return {
      performanceFee: performanceFee as string,
      callFee: callFee as string,
      withdrawalFee: withdrawalFee as string,
      withdrawalFeePeriod: withdrawalFeePeriod as string,
    }
  } catch (error) {
    return null
  }
}

export default fetchPublicVaultData
