import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { atom, useAtom } from 'jotai'

import { datadogRum } from 'utils/datadog'

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

  useEffect(() => {
    if (ready && address) {
      datadogRum.setUser({
        id: address,
      })
    }
  }, [ready, address])
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
