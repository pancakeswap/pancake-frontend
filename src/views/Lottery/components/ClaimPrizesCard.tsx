import React, { useCallback } from 'react'
import { Box } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTotalClaim } from 'hooks/useTickets'
import { getBalanceNumber } from 'utils/formatBalance'
import YourPrizesCard from './YourPrizesCard'
import UnlockWalletCard from './UnlockWalletCard'

const ClaimPrizesCard = () => {
  const { account } = useWeb3React()
  const { claimAmount, setLastUpdated } = useTotalClaim()
  const winnings = getBalanceNumber(claimAmount)
  const isAWin = winnings > 0

  const handleSuccess = useCallback(() => {
    setLastUpdated()
  }, [setLastUpdated])

  return (
    <Box mb="32px">
      {!account ? <UnlockWalletCard /> : <YourPrizesCard isAWin={isAWin} onSuccess={handleSuccess} />}
    </Box>
  )
}

export default ClaimPrizesCard
