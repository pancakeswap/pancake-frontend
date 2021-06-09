import { useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import {
  getCakeBalance,
  getUserCakeVaultBalance,
  getUserStakeInCakeBnbLp,
  getUserStakeInCakePool,
  getUserStakeInPools,
} from 'utils/callHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import usePersistState from 'hooks/usePersistState'
import BigNumber from 'bignumber.js'

interface State {
  isInitialized: boolean
  cakeBnbLp: BigNumber
  cakePool: BigNumber
  cakeBalance: BigNumber
  pools: BigNumber
  cakeVaultBalance: BigNumber
}

interface VotingPowerHydrate {
  isInitialized: boolean
  cakeBnbLp: string
  cakePool: string
  cakeBalance: string
  pools: string
  cakeVaultBalance: string
}

const hydrateVotingPower = (value: VotingPowerHydrate): State => {
  return {
    isInitialized: Boolean(value.isInitialized),
    cakeBnbLp: new BigNumber(value.cakeBnbLp),
    cakePool: new BigNumber(value.cakePool),
    cakeBalance: new BigNumber(value.cakeBalance),
    pools: new BigNumber(value.pools),
    cakeVaultBalance: new BigNumber(value.cakeVaultBalance),
  }
}

const dehydrateVotingPower = (state: State) => {
  return {
    isInitialized: state.isInitialized,
    cakeBnbLp: state.cakeBnbLp.toJSON(),
    cakePool: state.cakePool.toJSON(),
    cakeBalance: state.cakeBalance.toJSON(),
    pools: state.pools.toJSON(),
    cakeVaultBalance: state.cakeVaultBalance.toJSON(),
  }
}

const initialState: State = {
  isInitialized: false,
  cakeBnbLp: BIG_ZERO,
  cakePool: BIG_ZERO,
  cakeBalance: BIG_ZERO,
  pools: BIG_ZERO,
  cakeVaultBalance: BIG_ZERO,
}

const useGetVotingPower = (block?: number) => {
  const { account } = useWeb3React()
  const isCancelled = useRef(false)
  const [votingPower, setVotingPower] = usePersistState(initialState, {
    localStorageKey: `pcs_vote_power_${block}_${account}`,
    hydrate: hydrateVotingPower,
    dehydrate: dehydrateVotingPower,
  })
  const { isInitialized, cakePool, cakeBnbLp, cakeBalance, pools }: State = votingPower

  const getTotal = () => {
    return cakePool.plus(cakeBnbLp).plus(cakeBalance).plus(pools)
  }

  useEffect(() => {
    const fetchVotingPower = async () => {
      const [userSTakeInCakeBnbLp, userStakeInCakePool, userCakeBalance, userPools, userCakeVaultBalance] =
        await Promise.all([
          getUserStakeInCakeBnbLp(account, block),
          getUserStakeInCakePool(account, block),
          getCakeBalance(account, block),
          getUserStakeInPools(account, block),
          getUserCakeVaultBalance(account, block),
        ])

      if (!isCancelled.current) {
        setVotingPower({
          isInitialized: true,
          pools: userPools,
          cakeBnbLp: userSTakeInCakeBnbLp,
          cakePool: userStakeInCakePool,
          cakeBalance: userCakeBalance,
          cakeVaultBalance: userCakeVaultBalance,
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

  return { isInitialized, votingPower, getTotal }
}

export default useGetVotingPower
