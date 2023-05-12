import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Address, useAccount } from 'wagmi'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useERC20, useTokenContract } from 'hooks/useContract'

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
        const res = await tokenContract.read.allowance([account, spenderAddress])
        setAllowance(new BigNumber(res.toString()))
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
