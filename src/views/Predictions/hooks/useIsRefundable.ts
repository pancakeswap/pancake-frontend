import { useEffect, useState } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getPredictionsContract } from 'utils/contractHelpers'
import { useConfig } from '../context/ConfigProvider'

const useIsRefundable = (epoch: number) => {
  const [isRefundable, setIsRefundable] = useState(false)
  const { account } = useWeb3React()
  const { address } = useConfig()

  useEffect(() => {
    const fetchRefundableStatus = async () => {
      const predictionsContract = getPredictionsContract(address)
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
  }, [account, epoch, setIsRefundable, address])

  return { isRefundable, setIsRefundable }
}

export default useIsRefundable
