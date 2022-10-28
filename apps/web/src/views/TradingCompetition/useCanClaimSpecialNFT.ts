import { useWeb3React } from '@pancakeswap/wagmi'
import { useEffect, useState } from 'react'
import { API_PROFILE } from 'config/constants/endpoints'

export const useCanClaimSpecialNFT = () => {
  const { account } = useWeb3React()
  const [canClaimSpecialNFT, setCanClaimSpecialNFT] = useState(false)
  useEffect(() => {
    const fetchUserTradingStats = async () => {
      const res = await fetch(`${API_PROFILE}/api/users/${account}`)
      const data = await res.json()
      if (parseInt(data?.leaderboard_dar?.darVolumeRank ?? '101') <= 100) setCanClaimSpecialNFT(true)
    }
    // If user has not registered, user trading information will not be displayed and should not be fetched
    if (account) {
      fetchUserTradingStats()
    }
  }, [account])
  return canClaimSpecialNFT
}
