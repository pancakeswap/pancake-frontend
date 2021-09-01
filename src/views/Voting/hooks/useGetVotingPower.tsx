import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getActivePools } from 'utils/calls'
import { getAddress } from 'utils/addressHelpers'
import { simpleRpcProvider } from 'utils/providers'
import { getVotingPower } from '../helpers'

interface State {
  verificationHash: string
  cakeBalance: number
  cakeVaultBalance: number
  cakePoolBalance: number
  poolsBalance: number
  cakeBnbLpBalance: number
  total: number
}

const initialState: State = {
  verificationHash: null,
  cakeBalance: 0,
  cakeVaultBalance: 0,
  cakePoolBalance: 0,
  poolsBalance: 0,
  cakeBnbLpBalance: 0,
  total: 0,
}

const useGetVotingPower = (block?: number, isActive = true): State & { isLoading: boolean } => {
  const { account } = useWeb3React()
  const [votingPower, setVotingPower] = useState(initialState)
  const [isLoading, setIsLoading] = useState(!!account)

  useEffect(() => {
    const fetchVotingPower = async () => {
      setIsLoading(true)

      try {
        const blockNumber = block || (await simpleRpcProvider.getBlockNumber())
        const eligiblePools = await getActivePools(blockNumber)
        const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress))
        const {
          cakeBalance,
          cakeBnbLpBalance,
          cakePoolBalance,
          total,
          poolsBalance,
          cakeVaultBalance,
          verificationHash,
        } = await getVotingPower(account, poolAddresses, blockNumber)

        if (isActive) {
          setVotingPower((prevVotingPower) => ({
            ...prevVotingPower,
            verificationHash,
            cakeBalance: parseFloat(cakeBalance),
            cakeBnbLpBalance: parseFloat(cakeBnbLpBalance),
            cakePoolBalance: parseFloat(cakePoolBalance),
            poolsBalance: parseFloat(poolsBalance),
            cakeVaultBalance: parseFloat(cakeVaultBalance),
            total: parseFloat(total),
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
