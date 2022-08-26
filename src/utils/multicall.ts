import { Interface } from '@ethersproject/abi'
import { CallOverrides } from '@ethersproject/contracts'
import { createMulticall } from '@pancakeswap/multicall'
import { useMulticallContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { provider } from './wagmi'

export interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  params?: any[] // Function params
}

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean
}

const { multicall, multicallv2 } = createMulticall(provider)

export default multicall

export { multicallv2 }

export type ReturnUseMultiCall = ReturnType<typeof useMulticall>

export const useMulticall = () => {
  const multi = useMulticallContract()

  return useCallback(
    async <T = any>(abi: any[], calls: Call[], options?: MulticallOptions): Promise<T> => {
      const { requireSuccess = true, ...overrides } = options || {}
      const itf = new Interface(abi)

      const calldata = calls.map((call) => ({
        target: call.address.toLowerCase(),
        callData: itf.encodeFunctionData(call.name, call.params),
      }))

      const returnData = await multi.tryAggregate(requireSuccess, calldata, overrides)
      const res = returnData.map((call, i) => {
        const [result, data] = call
        return result ? itf.decodeFunctionResult(calls[i].name, data) : null
      })

      return res as any
    },
    [multi],
  )
}
