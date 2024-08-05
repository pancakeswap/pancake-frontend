import { atom, useAtom, useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'

import { WorkerInstance, createWorker } from 'utils/worker'

const globalWorkerAtom = atom<WorkerInstance | undefined>(undefined)

function createUseWorkerHook(shared?: boolean) {
  const useWorkerState = shared ? () => useAtom(globalWorkerAtom) : useState

  return function useWorker() {
    const [worker, setWorker] = useWorkerState<WorkerInstance | undefined>()
    const workerRef = useRef<WorkerInstance | undefined>(worker)

    useEffect(() => {
      if (workerRef.current) {
        return () => {}
      }

      const abortController = new AbortController()
      async function initWorkerInstance() {
        workerRef.current = await createWorker()
        if (abortController.signal.aborted) {
          workerRef.current?.destroy()
          return
        }
        setWorker(workerRef.current)
      }
      initWorkerInstance()

      return () => {
        abortController.abort()
        workerRef.current?.destroy()
      }
    }, [setWorker])

    return worker
  }
}

export const useWorker = createUseWorkerHook(false)

export const useInitGlobalWorker = createUseWorkerHook(true)

export function useGlobalWorker() {
  return useAtomValue(globalWorkerAtom)
}
