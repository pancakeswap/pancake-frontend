import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useGetCurrentEpoch } from 'state/hooks'
import { getPredictionsContract } from 'utils/contractHelpers'
import { markLedgerClaimStatus } from 'state/predictions'

const useIsRoundClaimable = (epoch: number) => {
  const currentEpoch = useGetCurrentEpoch()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchClaimableStatus = async () => {
      const contract = getPredictionsContract()
      const claimable = await contract.claimable(epoch, account)

      // "claimable" currently has a known bug where it returns true on Bull bets even if an address
      // has not interacted with it. As a temporary work around we also check the ledger to see if they placed a bet
      const ledger = await contract.ledger(epoch, account)

      dispatch(markLedgerClaimStatus({ account, epoch, claimed: claimable && ledger.amount.gt(0) }))
    }

    if (account) {
      fetchClaimableStatus()
    }
  }, [account, epoch, currentEpoch, dispatch])
}

export default useIsRoundClaimable
