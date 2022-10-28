import { useCallback } from 'react'
import { MaxUint256 } from '@ethersproject/constants'
import { Ifo } from 'config/constants/types'
import { useCallWithMarketGasPrice } from 'hooks/useCallWithMarketGasPrice'
import { useERC20 } from 'hooks/useContract'

const useIfoApprove = (ifo: Ifo, spenderAddress: string) => {
  const raisingTokenContract = useERC20(ifo.currency.address)
  const { callWithMarketGasPrice } = useCallWithMarketGasPrice()
  const onApprove = useCallback(async () => {
    return callWithMarketGasPrice(raisingTokenContract, 'approve', [spenderAddress, MaxUint256])
  }, [spenderAddress, raisingTokenContract, callWithMarketGasPrice])

  return onApprove
}

export default useIfoApprove
