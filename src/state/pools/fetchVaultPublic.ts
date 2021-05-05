import BigNumber from 'bignumber.js'
import { convertSharesToCake } from 'views/Pools/helpers'
import { getCakeVaultContract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'

const cakeVaultContract = getCakeVaultContract()

export const fetchPublicVaultData = async () => {
  try {
    const [
      sharePrice,
      shares,
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
      estimatedCallBountyReward,
      totalPendingCakeRewards,
    ] = await makeBatchRequest([
      cakeVaultContract.methods.getPricePerFullShare().call,
      cakeVaultContract.methods.totalShares().call,
      cakeVaultContract.methods.performanceFee().call,
      cakeVaultContract.methods.withdrawFeePeriod().call,
      cakeVaultContract.methods.callFee().call,
      cakeVaultContract.methods.withdrawFee().call,
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
      performanceFee: performanceFee as string,
      callFee: callFee as string,
      withdrawalFee: withdrawalFee as string,
      withdrawalFeePeriod: withdrawalFeePeriod as string,
      estimatedCallBountyReward: new BigNumber(estimatedCallBountyReward as string).toJSON(),
      totalPendingCakeRewards: new BigNumber(totalPendingCakeRewards as string).toJSON(),
    }
  } catch (error) {
    return null
  }
}

export default fetchPublicVaultData
