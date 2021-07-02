import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getLotteryAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { useCake } from 'hooks/useContract'
import useRefresh from 'hooks/useRefresh'

// Retrieve lottery allowance
const useAllowance = () => {
  const [allowance, setAllowance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const cakeContract = useCake()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await cakeContract.allowance(account, getLotteryAddress())
      setAllowance(new BigNumber(res.toString()))
    }

    if (account) {
      fetchAllowance()
    }
  }, [account, cakeContract, fastRefresh])

  return allowance
}

export default useAllowance
