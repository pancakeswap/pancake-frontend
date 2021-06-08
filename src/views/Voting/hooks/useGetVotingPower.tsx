import { useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getCakeBalance, getUserStakeInCakeBnbLp, getUserStakeInCakePool, getUserStakeInPools } from 'utils/callHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import usePersistState from 'hooks/usePersistState'
import BigNumber from 'bignumber.js'

interface State {
  isInitialized: boolean
  cakeBnbLp: BigNumber
  cakePool: BigNumber
  cakeBalance: BigNumber
  pools: BigNumber
}

interface VotingPowerHydrate {
  isInitialized: boolean
  cakeBnbLp: string
  cakePool: string
  cakeBalance: string
  pools: string
}

const hydrateVotingPower = (value: VotingPowerHydrate): State => {
  return {
    isInitialized: Boolean(value.isInitialized),
    cakeBnbLp: new BigNumber(value.cakeBnbLp),
    cakePool: new BigNumber(value.cakePool),
    cakeBalance: new BigNumber(value.cakeBalance),
    pools: new BigNumber(value.pools),
  }
}

const dehydrateVotingPower = (state: State) => {
  return {
    isInitialized: state.isInitialized,
    cakeBnbLp: state.cakeBnbLp.toJSON(),
    cakePool: state.cakePool.toJSON(),
    cakeBalance: state.cakeBalance.toJSON(),
    pools: state.pools.toJSON(),
  }
}

const initialState: State = {
  isInitialized: false,
  cakeBnbLp: BIG_ZERO,
  cakePool: BIG_ZERO,
  cakeBalance: BIG_ZERO,
  pools: BIG_ZERO,
}

const useGetVotingPower = (block?: number) => {
  const { account } = useWeb3React()
  const isCancelled = useRef(false)
  const [votingPower, setVotingPower] = usePersistState(initialState, {
    localStorageKey: `pcs_vote_power_${block}_${account}`,
    hydrate: hydrateVotingPower,
    dehydrate: dehydrateVotingPower,
  })
  const { isInitialized } = votingPower

  useEffect(() => {
    const fetchVotingPower = async () => {
      const [userSTakeInCakeBnbLp, userStakeInCakePool, userCakeBalance, userPools] = await Promise.all([
        getUserStakeInCakeBnbLp(account, block),
        getUserStakeInCakePool(account, block),
        getCakeBalance(account, block),
        getUserStakeInPools(account, block),
      ])

      if (!isCancelled.current) {
        setVotingPower({
          isInitialized: true,
          pools: userPools,
          cakeBnbLp: userSTakeInCakeBnbLp,
          cakePool: userStakeInCakePool,
          cakeBalance: userCakeBalance,
        })
      }
    }

    if (account && !isInitialized) {
      fetchVotingPower()
    }

    return () => {
      isCancelled.current = true
    }
  }, [account, block, isCancelled, isInitialized, setVotingPower])

  return { isInitialized, votingPower }
}

export default useGetVotingPower
