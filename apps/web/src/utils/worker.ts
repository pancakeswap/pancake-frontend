import type { WorkerGetBestTradeEvent, WorkerMultiChunkEvent } from 'quote-worker'
import type { FetchChunkResult } from 'state/multicall/fetchChunk'

import { createWorkerScriptLoader } from './workerScriptLoader'

class WorkerProxy {
  id = 0

  // eslint-disable-next-line no-useless-constructor
  constructor(protected worker: Worker) {}

  public postMessage = async <T>(message: any) => {
    if (!this.worker) {
      throw new Error('Worker not initialized')
    }

    const id = this.id++
    const promise = new Promise<T>((resolve, reject) => {
      const handler = (e: any) => {
        const [eventId, data] = e.data
        if (id === eventId) {
          this.worker.removeEventListener('message', handler)
          if (data.success === false) {
            reject(data.error)
          } else {
            resolve(data.result)
          }
        }
      }
      this.worker.addEventListener('message', handler)
    })

    this.worker.postMessage([id, message])
    return promise
  }

  public fetchChunk = async (params: WorkerMultiChunkEvent[1]['params']): FetchChunkResult => {
    return this.postMessage({
      cmd: 'multicallChunk',
      params,
    })
  }

  public getBestTrade = async (params: WorkerGetBestTradeEvent[1]['params']) => {
    return this.postMessage({
      cmd: 'getBestTrade',
      params,
    })
  }

  public destroy = async () => {
    return this.worker.terminate()
  }
}

function createWorkerInstance(script: string) {
  return new WorkerProxy(new Worker(new URL(script)))
}

function createWorkerCreator() {
  const loadWorkerScript = createWorkerScriptLoader()

  return async function createWorker() {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      return undefined
    }
    const script = await loadWorkerScript()
    return createWorkerInstance(script)
  }
}

export const createWorker = createWorkerCreator()

export type WorkerInstance = Awaited<ReturnType<typeof createWorker>>
