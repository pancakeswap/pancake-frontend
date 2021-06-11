import { useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import usePersistState from 'hooks/usePersistState'
import BigNumber from 'bignumber.js'
import { getVotingPower } from '../helpers'

interface State {
  isInitialized: boolean
  verificationHash: string
  cakeBalance: BigNumber
  cakeVaultBalance: BigNumber
  cakePoolBalance: BigNumber
  poolsBalance: BigNumber
  cakeBnbLpBalance: BigNumber
  total: BigNumber
}

interface VotingPowerHydrate {
  isInitialized: boolean
  verificationHash: string
  cakeBalance: string
  cakeVaultBalance: string
  cakePoolBalance: string
  poolsBalance: string
  cakeBnbLpBalance: string
  total: string
}

const hydrateVotingPower = ({
  isInitialized,
  verificationHash,
  cakeBalance,
  cakeVaultBalance,
  cakePoolBalance,
  poolsBalance,
  cakeBnbLpBalance,
  total,
}: Partial<VotingPowerHydrate>): State => {
  return {
    verificationHash,
    isInitialized: Boolean(isInitialized),
    cakeBalance: new BigNumber(cakeBalance),
    cakeVaultBalance: new BigNumber(cakeVaultBalance),
    cakePoolBalance: new BigNumber(cakePoolBalance),
    poolsBalance: new BigNumber(poolsBalance),
    cakeBnbLpBalance: new BigNumber(cakeBnbLpBalance),
    total: new BigNumber(total),
  }
}

const dehydrateVotingPower = (state: State) => {
  return {
    isInitialized: state.isInitialized,
    verificationHash: state.verificationHash,
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
  verificationHash: null,
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
