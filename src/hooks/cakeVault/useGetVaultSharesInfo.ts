import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { convertSharesToCake } from 'views/Pools/helpers'
import { useCakeVaultContract } from 'hooks/useContract'
import makeBatchRequest from 'utils/makeBatchRequest'

const useGetVaultSharesInfo = (lastUpdated?: number) => {
  const cakeVaultContract = useCakeVaultContract()
  const [totalShares, setTotalShares] = useState(null)
  const [totalCakeInVault, setTotalCakeInVault] = useState(null)
  const [pricePerFullShare, setPricePerFullShare] = useState(null)

  useEffect(() => {
    const getTotalShares = async () => {
      const [sharePrice, shares] = await makeBatchRequest([
        cakeVaultContract.methods.getPricePerFullShare().call,
        cakeVaultContract.methods.totalShares().call,
      ])
      const sharePriceAsBigNumber = new BigNumber(sharePrice as string)
      const totalSharesAsBigNumber = new BigNumber(shares as string)
      const totalCakeInVaultEstimate = convertSharesToCake(totalSharesAsBigNumber, sharePriceAsBigNumber)
      setPricePerFullShare(sharePriceAsBigNumber)
      setTotalShares(totalSharesAsBigNumber)
      setTotalCakeInVault(totalCakeInVaultEstimate.cakeAsBigNumber)
    }
    getTotalShares()
  }, [cakeVaultContract, lastUpdated])

  return { totalShares, totalCakeInVault, pricePerFullShare }
}

export default useGetVaultSharesInfo
