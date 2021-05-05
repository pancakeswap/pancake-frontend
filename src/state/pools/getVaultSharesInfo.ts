import BigNumber from 'bignumber.js'
import { convertSharesToCake } from 'views/Pools/helpers'
import { getCakeVaultContract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'

const cakeVaultContract = getCakeVaultContract()

export const getVaultSharesInfo = async () => {
  try {
    const [sharePrice, shares] = await makeBatchRequest([
      cakeVaultContract.methods.getPricePerFullShare().call,
      cakeVaultContract.methods.totalShares().call,
    ])
    const sharePriceAsBigNumber = new BigNumber(sharePrice as string)
    const totalSharesAsBigNumber = new BigNumber(shares as string)
    const totalCakeInVaultEstimate = convertSharesToCake(totalSharesAsBigNumber, sharePriceAsBigNumber)

    return {
      totalShares: totalSharesAsBigNumber,
      totalCakeInVault: totalCakeInVaultEstimate.cakeAsBigNumber,
      pricePerFullShare: sharePriceAsBigNumber,
    }
  } catch (error) {
    return null
  }
}

export default getVaultSharesInfo
