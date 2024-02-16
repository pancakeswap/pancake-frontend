import { useIsomorphicEffect } from '@pancakeswap/uikit'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { datadogRum } from 'utils/datadog'
import { useAccount } from 'wagmi'

import { useGlobalSettingsEvaluation } from './useGlobalSettingsEvaluation'

const readyAtom = atom(false)

export function useDataDogRUMReady() {
  const [ready] = useAtom(readyAtom)
  return ready
}

export function useDataDogRUM() {
  const [ready, setReady] = useAtom(readyAtom)
  const { address } = useAccount()
  useGlobalSettingsEvaluation()

  useEffect(() => {
    if (ready) {
      return
    }

    if (address) {
      datadogRum.init()
      setReady(true)
    }
  }, [ready, address, setReady])

  useIsomorphicEffect(() => {
    // @ts-ignore
    if (window?.ethereum?.isBinance)
      datadogRum.startView({ name: 'Page View From Binance Web3 Wallet', service: window.location.pathname })
  }, [])

  useEffect(() => {
    if (ready && address) {
      datadogRum.setUser({
        id: address,
      })
    }
  }, [ready, address])
}

export type FeatureFlagEvaluation = {
  flagName: string
  value?: boolean | string | number
}

export function useFeatureFlagEvaluations(evaluations?: FeatureFlagEvaluation[]) {
  const ready = useDataDogRUMReady()

  useEffect(() => {
    if (!ready || !evaluations) {
      return
    }

    for (const { flagName, value } of evaluations) {
      if (value !== undefined) {
        datadogRum.addFeatureFlagEvaluation(flagName, value)
      }
    }
  }, [ready, evaluations])
}

export function useFeatureFlagEvaluation(flagName: string, value?: boolean | string | number) {
  const ready = useDataDogRUMReady()

  useEffect(() => {
    if (!ready) {
      return
    }

    if (value !== undefined) {
      datadogRum.addFeatureFlagEvaluation(flagName, value)
    }
  }, [ready, flagName, value])
}
