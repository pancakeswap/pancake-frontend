import React, { createContext, ReactNode, useEffect, useState, useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { usePredictionBnb } from 'hooks/useContract'
import { getPreRounds, getPreBetInfos, cropRound, cropRoundWithBetInfo, getSecondsToNextRound, updateRounds } from '../utils'
import { IRound, STATUS } from '../types'

type PredictionProviderProps = {
  children: ReactNode
}

type Callback = {
  sender: string, 
  epoch: number, 
  amount: string
}

type State = {
  currentEpoch: number
  preRounds: IRound[]
  curRound: IRound
  nextRound: IRound
}

type Context = {
  account: string
  remainSecond: number
  updateEpoch: (r: number) => void
  setRemainSecond: (r: number) => void
} & State

export const PredictionProviderContext = createContext<Context | null>(null)

const PredictionProvider: React.FC<PredictionProviderProps> = ({ children }) => {
  const { account } = useWallet()
  const [remainSecond, setRemainSecond] = useState(0)
  const [state, setState] = useState<State>({
    currentEpoch: -1,
    preRounds: [],
    curRound: {} as IRound,
    nextRound: {} as IRound,
  })
  const { currentEpoch } = state
  const bnbPredictionContract = usePredictionBnb()
  const updateEpoch = useCallback((epoch) => {
    setState((s) => ({
      ...s,
      currentEpoch: epoch,
    }))
  }, [])
  const onClaimCallback = useCallback((params: Callback) => {
    if (params.amount === account) {
      setState((s) => ({
        ...s,
        preRounds: updateRounds(s.preRounds, params)
      }))
    }
  }, [account])
  const onBidCallback = useCallback(async (epoch: number) => {
    const promises = [bnbPredictionContract.methods.rounds(epoch).call()]
    if (account) {
      promises.push(bnbPredictionContract.methods.ledger(epoch, account).call())
    }
    const rs = await Promise.all(promises)
    const nextRound = rs.shift()
    let nextBetInfo
    if (account) {
      nextBetInfo = rs.shift()
    }
    setState((s) => ({
      ...s,
      nextRound: cropRoundWithBetInfo(cropRound([nextRound], STATUS.COMING), [nextBetInfo])[0],
    }))
    
  }, [account, bnbPredictionContract])
  

  // Static data
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const cEpoch = await bnbPredictionContract.methods.currentEpoch().call()
        setState((s) => ({
          ...s,
          currentEpoch: +cEpoch,
        }))
      } catch (error) {
        console.error('an error occured', error)
      }
    }

    fetchContractData()
  }, [bnbPredictionContract])

  // Data from the contract that needs an account
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        if (currentEpoch === -1) return
        let preBetInfos
        let curBetInfo
        let nextBetInfo
        const promises = [
          getPreRounds(bnbPredictionContract, currentEpoch),
          bnbPredictionContract.methods.rounds(currentEpoch).call(),
          bnbPredictionContract.methods.rounds(currentEpoch + 1).call()
        ]
        if (account) {
          promises.push(
            getPreBetInfos(bnbPredictionContract, +currentEpoch, account),
            bnbPredictionContract.methods.ledger(currentEpoch, account).call(),
            bnbPredictionContract.methods.ledger(currentEpoch + 1, account).call(),
          )
        }
        const rs = await Promise.all(promises)
        const [preRounds, curRound, nextRound, ...restRs] = rs
        if (account && restRs.length === 3) {
          [preBetInfos, curBetInfo, nextBetInfo] = restRs
        }
        setState((s) => ({
          ...s,
          preRounds: cropRoundWithBetInfo(cropRound(preRounds, STATUS.EXPIRED), preBetInfos),
          curRound: cropRoundWithBetInfo(cropRound([curRound], STATUS.LIVE), [curBetInfo])[0],
          nextRound: cropRoundWithBetInfo(cropRound([nextRound], STATUS.COMING), [nextBetInfo])[0],
        }))
        setRemainSecond(getSecondsToNextRound())
      } catch (error) {
        console.error('an error occured', error)
      }
    }

    fetchContractData()
  }, [account, currentEpoch, bnbPredictionContract])

  // subscribe contract events
  useEffect(() => {
    const subscribeEvents = async () => {
      try {
        bnbPredictionContract.events.BetBear().on('data', (event) => {
          // onBidCallback
          console.log('bit bear...', event.returnValues) // same results as the optional callback above
        })
        bnbPredictionContract.events.BetBull().on('data', (event) => {
          // onBidCallback
          // 0: "0x0E03aF5d4a7B721Ce8cF54ef2ddDb96aaC618048"
          // 1: "1"
          // 2: "20000000000000"
          // currentEpoch: "1"
          // price: "20000000000000"
          // sender: "0x0E03aF5d4a7B721Ce8cF54ef2ddDb96aaC618048"
          console.log('bit bull...', event.returnValues) // same results as the optional callback above
        })
        bnbPredictionContract.events.Claim().on('data', (event) => {
          console.log('claim...', event.returnValues) // same results as the optional callback above
          // handleClaim
        })
      } catch (error) {
        console.error('an error occured', error)
      }
    }
    subscribeEvents()
    // TODO disconnect?
  }, [setState, bnbPredictionContract])

  return (
    <PredictionProviderContext.Provider value={{ ...state, account, remainSecond, setRemainSecond, updateEpoch }}>
      {children}
    </PredictionProviderContext.Provider>
  )
}

export default PredictionProvider
