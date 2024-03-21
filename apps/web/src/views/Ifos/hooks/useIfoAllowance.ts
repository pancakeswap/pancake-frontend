import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useERC20, useTokenContract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

// Retrieve IFO allowance
const useIfoAllowance = (
  tokenContract: ReturnType<typeof useTokenContract> | ReturnType<typeof useERC20>, // TODO: merge hooks
  spenderAddress: Address,
  dependency?: any,
): BigNumber => {
  const { address: account } = useAccount()
  const [allowance, setAllowance] = useState(BIG_ZERO)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await tokenContract?.read.allowance([account!, spenderAddress])
        setAllowance(new BigNumber(res?.toString() ?? 0))
      } catch (e) {
        console.error(e)
      }
    }

    if (account) {
      fetch()
    }
  }, [account, spenderAddress, tokenContract, dependency])

  return allowance
}

export default useIfoAllowance
