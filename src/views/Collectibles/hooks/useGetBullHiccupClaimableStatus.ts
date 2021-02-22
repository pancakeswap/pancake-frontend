import { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getBunnySpecialContract } from 'utils/contractHelpers'

export const BULL_NFT = 11
export const HICCUP_NFT = 10

const bunnySpecialContract = getBunnySpecialContract()

const useGetBullHiccupClaimableStatus = () => {
  const [hasChecked, setHasChecked] = useState(false)
  const [claimables, setClaimables] = useState({
    [BULL_NFT]: false,
    [HICCUP_NFT]: false,
  })
  const { account } = useWallet()

  useEffect(() => {
    const checkClaimableStatus = async () => {
      const [isBullClaimable, isHiccupClaimable] = (await bunnySpecialContract.methods
        .canClaimMultiple(account, [BULL_NFT, HICCUP_NFT])
        .call()) as boolean[]

      setClaimables({
        [BULL_NFT]: isBullClaimable,
        [HICCUP_NFT]: isHiccupClaimable,
      })
      setHasChecked(true)
    }

    if (account) {
      checkClaimableStatus()
    }
  }, [account, setClaimables, setHasChecked])

  return {
    isSomeClaimable: Object.values(claimables).some((status) => status === true),
    isBullClaimable: claimables[BULL_NFT],
    isHiccupClaimable: claimables[HICCUP_NFT],
    hasChecked,
  }
}

export default useGetBullHiccupClaimableStatus
