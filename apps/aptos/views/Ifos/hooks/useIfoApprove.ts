import { TransactionResponse } from '@pancakeswap/awgmi/core'
import { useCallback } from 'react'
import { Ifo } from 'config/constants/types'
// import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
// import { useERC20 } from 'hooks/useContract'

const useIfoApprove = (_ifo: Ifo, _spenderAddress: string): (() => Promise<TransactionResponse>) => {
  // const raisingTokenContract = useERC20(ifo.currency.address)
  // const { callWithGasPrice } = useCallWithGasPrice()
  const onApprove = useCallback(async () => {
    // return callWithGasPrice(raisingTokenContract, 'approve', [spenderAddress, MaxUint256])
    const temporary = {} as TransactionResponse
    return temporary
  }, [])

  return onApprove
}

export default useIfoApprove
