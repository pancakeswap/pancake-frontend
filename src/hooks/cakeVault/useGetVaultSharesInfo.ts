import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { convertSharesToCake } from 'views/Pools/helpers'
import { useCakeVaultContract } from 'hooks/useContract'

const useGetVaultSharesInfo = (lastUpdated?: number) => {
  const cakeVaultContract = useCakeVaultContract()
  const [totalShares, setTotalShares] = useState(null)
  const [totalCakeInVault, setTotalCakeInVault] = useState(null)
  const [pricePerFullShare, setPricePerFullShare] = useState(null)

  useEffect(() => {
    const getPricePerShare = async () => {
      const sharePrice = await cakeVaultContract.methods.getPricePerFullShare().call()
      setPricePerFullShare(new BigNumber(sharePrice))
    }
    getPricePerShare()
  }, [cakeVaultContract, lastUpdated])

  useEffect(() => {
    const getTotalShares = async () => {
      const shares = await cakeVaultContract.methods.totalShares().call()
      const { cakeAsBigNumber } = convertSharesToCake(new BigNumber(shares), pricePerFullShare)
      setTotalShares(new BigNumber(shares))
      setTotalCakeInVault(cakeAsBigNumber)
    }
    getTotalShares()
  }, [cakeVaultContract, lastUpdated, pricePerFullShare])

  return { totalShares, totalCakeInVault, pricePerFullShare }
}

export default useGetVaultSharesInfo
