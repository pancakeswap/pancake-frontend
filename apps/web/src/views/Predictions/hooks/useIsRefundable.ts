import { useEffect, useState } from 'react'
import { usePredictionsContract } from 'hooks/useContract'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useConfig } from '../context/ConfigProvider'

const useIsRefundable = (epoch: number, enabled = true) => {
  const { account, chainId } = useAccountActiveChain()
  const config = useConfig()
  const predictionsContract = usePredictionsContract(config?.address ?? '0x', config?.isNativeToken ?? true)
  const [isRefundable, setIsRefundable] = useState(false)

  useEffect(() => {
    if (config?.address && account && epoch && chainId && enabled) {
      const fetchRefundableStatus = async () => {
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
  }, [account, epoch, config?.address, predictionsContract, chainId, enabled])

  return { isRefundable, setIsRefundable }
}

export default useIsRefundable
