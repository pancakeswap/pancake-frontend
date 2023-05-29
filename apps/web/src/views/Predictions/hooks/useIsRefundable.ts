import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { getPredictionsV2Contract } from 'utils/contractHelpers'
import { useConfig } from '../context/ConfigProvider'

const useIsRefundable = (epoch: number) => {
  const [isRefundable, setIsRefundable] = useState(false)
  const { address: account } = useAccount()
  const { address } = useConfig()

  useEffect(() => {
    const fetchRefundableStatus = async () => {
      const predictionsContract = getPredictionsV2Contract(address)
      const refundable = await predictionsContract.read.refundable([BigInt(epoch), account])

      if (refundable) {
        // Double check they have not already claimed
        const ledger = await predictionsContract.read.ledger([BigInt(epoch), account])
        setIsRefundable(ledger[2] === false)
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
