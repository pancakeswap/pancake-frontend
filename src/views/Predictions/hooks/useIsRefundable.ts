import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getPredictionsContract } from 'utils/contractHelpers'

const useIsRefundable = (epoch: number) => {
  const [isRefundable, setIsRefundable] = useState(false)
  const { account } = useWeb3React()

  useEffect(() => {
    const fetchRefundableStatus = async () => {
      const predictionsContract = getPredictionsContract()
      const refundable = await predictionsContract.refundable(epoch, account)

      if (refundable) {
        // Double check they have not already claimed
        const ledger = await predictionsContract.ledger(epoch, account)
        setIsRefundable(ledger.claimed === false)
      } else {
        setIsRefundable(false)
      }
    }

    if (account) {
      fetchRefundableStatus()
    }
  }, [account, epoch, setIsRefundable])

  return { isRefundable, setIsRefundable }
}

export default useIsRefundable
