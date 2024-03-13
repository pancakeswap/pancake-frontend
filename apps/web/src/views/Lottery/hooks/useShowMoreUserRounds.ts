import { useState } from 'react'
import { useAppDispatch } from 'state'
import { fetchAdditionalUserLotteries } from 'state/lottery'
import { MAX_USER_LOTTERIES_REQUEST_SIZE } from 'state/lottery/getUserLotteryData'
import { useAccount } from 'wagmi'

const useShowMoreUserRounds = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const [numUserRoundsRequested, setNumUserRoundsRequested] = useState(MAX_USER_LOTTERIES_REQUEST_SIZE)

  const handleShowMoreUserRounds = () => {
    if (account) dispatch(fetchAdditionalUserLotteries({ account, skip: numUserRoundsRequested }))
    setNumUserRoundsRequested(numUserRoundsRequested + MAX_USER_LOTTERIES_REQUEST_SIZE)
  }

  return { numUserRoundsRequested, handleShowMoreUserRounds }
}

export default useShowMoreUserRounds
