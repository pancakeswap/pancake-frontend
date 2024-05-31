import { ChainId, chainNameToChainId } from '@pancakeswap/chains'
import { PredictionSupportedSymbol, SUPPORTED_CHAIN_IDS } from '@pancakeswap/prediction'
import PageLoader from 'components/Loader/PageLoader'
import { FetchStatus } from 'config/constants/types'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { filterLeaderboard } from 'state/predictions'
import { useGetLeaderboardFilters, useGetLeaderboardLoadingState } from 'state/predictions/hooks'
import { usePredictionConfigs } from 'views/Predictions/hooks/usePredictionConfigs'
import { useAccount } from 'wagmi'
import { PredictionSubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import Filters from './components/Filters'
import Hero from './components/Hero'
import Results from './components/Results'
import ConnectedWalletResult from './components/Results/ConnectedWalletResult'

const Leaderboard = () => {
  const dispatch = useLocalDispatch()
  const { query } = useRouter()
  const { address: account } = useAccount()
  const filters = useGetLeaderboardFilters()
  const leaderboardLoadingState = useGetLeaderboardLoadingState()
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true)
  const [pickedChainId, setPickedChainId] = useState<ChainId>(ChainId.BSC)
  const [pickedTokenSymbol, setPickedTokenSymbol] = useState<PredictionSupportedSymbol>(PredictionSupportedSymbol.BNB)
  const predictionConfigs = usePredictionConfigs(pickedChainId)

  useEffect(() => {
    if (typeof query?.chain === 'string' && SUPPORTED_CHAIN_IDS.includes(Number(chainNameToChainId[query?.chain]))) {
      setPickedChainId(Number(chainNameToChainId[query?.chain]))
    }
  }, [query])

  useEffect(() => {
    if (predictionConfigs) {
      const defaultPickedTokenSymbol =
        typeof query?.token === 'string' &&
        PredictionSupportedSymbol?.[query?.token] &&
        predictionConfigs[PredictionSupportedSymbol?.[query?.token]]
          ? PredictionSupportedSymbol?.[query?.token]
          : (Object.values(predictionConfigs)?.[0]?.token?.symbol as PredictionSupportedSymbol)

      setPickedTokenSymbol(defaultPickedTokenSymbol)
      setIsFirstTime(false)
    }
  }, [query, predictionConfigs, pickedChainId])

  useEffect(() => {
    if (predictionConfigs && !isFirstTime) {
      const extra = predictionConfigs?.[pickedTokenSymbol] ?? Object.values(predictionConfigs)?.[0]
      dispatch(filterLeaderboard({ filters, extra }))
    }
  }, [isFirstTime, account, filters, dispatch, predictionConfigs, pickedChainId, pickedTokenSymbol])

  if (leaderboardLoadingState === FetchStatus.Idle) {
    return <PageLoader />
  }

  return (
    <>
      <Hero />
      <Filters
        pickedChainId={pickedChainId}
        pickedTokenSymbol={pickedTokenSymbol}
        predictionConfigs={predictionConfigs}
        setPickedChainId={setPickedChainId}
        setPickedTokenSymbol={setPickedTokenSymbol}
      />
      <ConnectedWalletResult
        token={predictionConfigs?.[pickedTokenSymbol]?.token}
        api={predictionConfigs?.[pickedTokenSymbol]?.api ?? ''}
      />
      <Results
        token={predictionConfigs?.[pickedTokenSymbol]?.token}
        api={predictionConfigs?.[pickedTokenSymbol]?.api ?? ''}
      />
      <PredictionSubgraphHealthIndicator />
    </>
  )
}

export default Leaderboard
