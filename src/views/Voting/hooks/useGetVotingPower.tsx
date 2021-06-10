import { useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import usePersistState from 'hooks/usePersistState'
import BigNumber from 'bignumber.js'
import { getVotingPower } from '../helpers'

interface State {
  isInitialized: boolean
  cakeBalance: BigNumber
  cakeVaultBalance: BigNumber
  cakePoolBalance: BigNumber
  poolsBalance: BigNumber
  cakeBnbLpBalance: BigNumber
  total: BigNumber
}

interface VotingPowerHydrate {
  isInitialized: boolean
  cakeBalance: string
  cakeVaultBalance: string
  cakePoolBalance: string
  poolsBalance: string
  cakeBnbLpBalance: string
  total: string
}

const hydrateVotingPower = (value: Partial<VotingPowerHydrate>): State => {
  return {
    isInitialized: Boolean(value.isInitialized),
    cakeBalance: new BigNumber(value.cakeBalance),
    cakeVaultBalance: new BigNumber(value.cakeVaultBalance),
    cakePoolBalance: new BigNumber(value.cakePoolBalance),
    poolsBalance: new BigNumber(value.poolsBalance),
    cakeBnbLpBalance: new BigNumber(value.cakeBnbLpBalance),
    total: new BigNumber(value.total),
  }
}

const dehydrateVotingPower = (state: State) => {
  return {
    isInitialized: state.isInitialized,
    cakeBalance: state.cakeBalance.toJSON(),
    cakeVaultBalance: state.cakeVaultBalance.toJSON(),
    cakePoolBalance: state.cakePoolBalance.toJSON(),
    poolsBalance: state.poolsBalance.toJSON(),
    cakeBnbLpBalance: state.cakeBnbLpBalance.toJSON(),
    total: state.total.toJSON(),
  }
}

const initialState: State = {
  isInitialized: false,
  cakeBalance: BIG_ZERO,
  cakeVaultBalance: BIG_ZERO,
  cakePoolBalance: BIG_ZERO,
  poolsBalance: BIG_ZERO,
  cakeBnbLpBalance: BIG_ZERO,
  total: BIG_ZERO,
}

const useGetVotingPower = (block?: number): State => {
  const { account } = useWeb3React()
  const isCancelled = useRef(false)
  const [votingPower, setVotingPower] = usePersistState(initialState, {
    localStorageKey: `pcs_votepower_${block}_${account}`,
    hydrate: hydrateVotingPower,
    dehydrate: dehydrateVotingPower,
  })
  const { isInitialized }: State = votingPower

  useEffect(() => {
    const fetchVotingPower = async () => {
      const response: Partial<VotingPowerHydrate> = await getVotingPower(account, block)

      if (!isCancelled.current) {
        setVotingPower(hydrateVotingPower({ isInitialized: true, ...response }))
      }
    }

    if (account && !isInitialized) {
      fetchVotingPower()
    }

    return () => {
      isCancelled.current = true
    }
  }, [account, block, isCancelled, isInitialized, setVotingPower])

  return votingPower
}

export default useGetVotingPower
