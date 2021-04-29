import { useEffect, useState } from 'react'
import { usePredictionsContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'

const useIsRefundable = (epoch: number) => {
  const [isRefundable, setIsRefundable] = useState(false)
  const predictionsContract = usePredictionsContract()
  const { account } = useWeb3React()

  useEffect(() => {
    const fetchRefundableStatus = async () => {
      const canClaim = await predictionsContract.methods.claimable(epoch, account).call()

      if (canClaim) {
        const refundable = await predictionsContract.methods.refundable(epoch, account).call()
        setIsRefundable(refundable)
      } else {
        setIsRefundable(false)
      }
    }

    if (account) {
      fetchRefundableStatus()
    }
  }, [account, epoch, predictionsContract, setIsRefundable])

  return { isRefundable, setIsRefundable }
}

export default useIsRefundable
