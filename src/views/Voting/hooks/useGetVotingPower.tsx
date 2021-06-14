import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { getActivePools } from 'utils/callHelpers'
import { getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { getVotingPower } from '../helpers'

interface State {
  verificationHash: string
  cakeBalance: BigNumber
  cakeVaultBalance: BigNumber
  cakePoolBalance: BigNumber
  poolsBalance: BigNumber
  cakeBnbLpBalance: BigNumber
  total: BigNumber
}

const initialState: State = {
  verificationHash: null,
  cakeBalance: BIG_ZERO,
  cakeVaultBalance: BIG_ZERO,
  cakePoolBalance: BIG_ZERO,
  poolsBalance: BIG_ZERO,
  cakeBnbLpBalance: BIG_ZERO,
  total: BIG_ZERO,
}

const useGetVotingPower = (block?: number, isActive = true): State & { isLoading: boolean } => {
  const { account } = useWeb3React()
  const [votingPower, setVotingPower] = useState(initialState)
  const [isLoading, setIsLoading] = useState(!!account)

  useEffect(() => {
    const fetchVotingPower = async () => {
      setIsLoading(true)

      try {
        const eligiblePools = await getActivePools(block)
        const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress))
        const { cakeBalance, cakeBnbLpBalance, cakePoolBalance, total, poolsBalance, ...rest } = await getVotingPower(
          account,
          poolAddresses,
          block,
        )

        if (isActive) {
          setVotingPower((prevVotingPower) => ({
            ...prevVotingPower,
            ...rest,
            cakeBalance: new BigNumber(cakeBalance),
            cakeBnbLpBalance: new BigNumber(cakeBnbLpBalance),
            cakePoolBalance: new BigNumber(cakePoolBalance),
            poolsBalance: new BigNumber(poolsBalance),
            total: new BigNumber(total),
          }))
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (account && isActive) {
      fetchVotingPower()
    }
  }, [account, block, setVotingPower, isActive, setIsLoading])

  return { ...votingPower, isLoading }
}

export default useGetVotingPower
