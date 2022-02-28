import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getActivePools } from 'utils/calls'
import { getAddress } from 'utils/addressHelpers'
import { simpleRpcProvider } from 'utils/providers'
import { getVotingPower } from '../helpers'

interface State {
  cakeBalance: number
  cakeVaultBalance: number
  cakePoolBalance: number
  poolsBalance: number
  cakeBnbLpBalance: number
  ifoPoolBalance: number
  total: number
}

const initialState: State = {
  cakeBalance: 0,
  cakeVaultBalance: 0,
  cakePoolBalance: 0,
  poolsBalance: 0,
  cakeBnbLpBalance: 0,
  ifoPoolBalance: 0,
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
          IFOPoolBalance,
        } = await getVotingPower(account, poolAddresses, blockNumber)

        if (isActive) {
          setVotingPower((prevVotingPower) => ({
            ...prevVotingPower,
            cakeBalance: parseFloat(cakeBalance),
            cakeBnbLpBalance: parseFloat(cakeBnbLpBalance),
            cakePoolBalance: parseFloat(cakePoolBalance),
            poolsBalance: parseFloat(poolsBalance),
            cakeVaultBalance: parseFloat(cakeVaultBalance),
            ifoPoolBalance: IFOPoolBalance ? parseFloat(IFOPoolBalance) : 0,
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
