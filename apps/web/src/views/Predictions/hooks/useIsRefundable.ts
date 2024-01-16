import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useState } from 'react'
import { getPredictionsV2Contract } from 'utils/contractHelpers'
import { useAccount } from 'wagmi'
import { useConfig } from '../context/ConfigProvider'

const useIsRefundable = (epoch: number) => {
  const [isRefundable, setIsRefundable] = useState(false)
  const { address: account } = useAccount()
  const config = useConfig()
  const { chainId } = useActiveChainId()

  useEffect(() => {
    if (config?.address && account) {
      const fetchRefundableStatus = async () => {
        const predictionsContract = getPredictionsV2Contract(config.address, chainId)
        const refundable = await predictionsContract.read.refundable([BigInt(epoch), account])

        if (refundable) {
          // Double check they have not already claimed
          const ledger = await predictionsContract.read.ledger([BigInt(epoch), account])
          setIsRefundable(ledger[2] === false)
        } else {
          setIsRefundable(false)
        }
      }

      fetchRefundableStatus()
    }
  }, [account, epoch, setIsRefundable, config, chainId])

  return { isRefundable, setIsRefundable }
}

export default useIsRefundable
