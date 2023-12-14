import { ChainId } from '@pancakeswap/chains'
import { PredictionSupportedSymbol } from '@pancakeswap/prediction'
import PageLoader from 'components/Loader/PageLoader'
import { FetchStatus } from 'config/constants/types'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useEffect, useMemo, useState } from 'react'
import { filterLeaderboard } from 'state/predictions'
import { useGetLeaderboardFilters, useGetLeaderboardLoadingState } from 'state/predictions/hooks'
import { usePredictionConfigs } from 'views/Predictions/hooks/usePredictionConfigs'
import { useAccount } from 'wagmi'
import Filters from './components/Filters'
import Hero from './components/Hero'
import Results from './components/Results'
import ConnectedWalletResult from './components/Results/ConnectedWalletResult'

const Leaderboard = () => {
  const dispatch = useLocalDispatch()
  const { address: account } = useAccount()
  const filters = useGetLeaderboardFilters()
  const leaderboardLoadingState = useGetLeaderboardLoadingState()
  const [pickedChainId, setPickedChainId] = useState<ChainId>(ChainId.BSC)
  const [pickedTokenSymbol, setPickedTokenSymbol] = useState<PredictionSupportedSymbol>(PredictionSupportedSymbol.BNB)

  const predictionConfigs = usePredictionConfigs(pickedChainId)

  const symbol = useMemo(() => {
    return pickedTokenSymbol || (predictionConfigs && Object.values(predictionConfigs)?.[0]?.token?.symbol)
  }, [pickedTokenSymbol, predictionConfigs])

  useEffect(() => {
    if (predictionConfigs) {
      const extra = predictionConfigs?.[symbol] ?? Object.values(predictionConfigs)?.[0]
      dispatch(filterLeaderboard({ filters, extra }))
    }
  }, [account, filters, dispatch, predictionConfigs, pickedChainId, symbol])

  if (leaderboardLoadingState === FetchStatus.Idle) {
    return <PageLoader />
  }

  return (
    <>
      <Hero />
      <Filters
        pickedChainId={pickedChainId}
        pickedTokenSymbol={symbol}
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
    </>
  )
}

export default Leaderboard
