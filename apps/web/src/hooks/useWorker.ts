import { useEffect, useRef, useState } from 'react'

import { WorkerInstance, createWorker } from 'utils/worker'

export function useWorker(dedicatedWorker?: WorkerInstance) {
  const workerRef = useRef<WorkerInstance | undefined>(dedicatedWorker)
  const [worker, setWorker] = useState<WorkerInstance | undefined>(workerRef.current)

  useEffect(() => {
    if (workerRef.current) {
      return () => {}
    }

    const abortController = new AbortController()
    async function initWorkerInstance() {
      workerRef.current = await createWorker({ signal: abortController.signal })
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
  }, [])

  return worker
}
