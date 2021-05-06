import BigNumber from 'bignumber.js'
import { useCakeVault } from 'state/hooks'

const useGetVaultPublicData = () => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalCakeInVault: totalCakeInVaultAsString,
  } = useCakeVault()

  const totalShares = new BigNumber(totalSharesAsString)
  const pricePerFullShare = new BigNumber(pricePerFullShareAsString)
  const totalCakeInVault = new BigNumber(totalCakeInVaultAsString)

  return { totalShares, pricePerFullShare, totalCakeInVault }
}

export default useGetVaultPublicData
