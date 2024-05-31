import { V4Router } from '@pancakeswap/smart-router'

import type { WorkerGetBestTradeEvent, WorkerGetBestTradeOffchainEvent, WorkerMultiChunkEvent } from 'quote-worker'
import type { FetchChunkResult } from 'state/multicall/fetchChunk'

import { createWorkerScriptLoader } from './workerScriptLoader'

class WorkerProxy {
  id = 0

  // eslint-disable-next-line no-useless-constructor
  constructor(protected worker: Worker) {}

  public postMessage = async <T>(message: any, eventId?: number) => {
    if (!this.worker) {
      throw new Error('Worker not initialized')
    }

    const id = eventId ?? this.nextId
    if (id <= this.id) {
      throw new Error(`Failed to post Message. Duplicate message id: ${id}`)
    }
    this.id = id
    const promise = new Promise<T>((resolve, reject) => {
      const handler = (e: any) => {
        const [eId, data] = e.data
        if (id === eId) {
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

  public getBestTrade = async (
    params: WorkerGetBestTradeEvent[1]['params'] & {
      signal?: AbortSignal
    },
  ) => {
    const { signal, ...restParams } = params
    const eventId = this.nextId
    signal?.addEventListener('abort', async () => {
      try {
        await this.postMessage({
          cmd: 'abort',
          params: eventId,
        })
      } catch (e) {
        console.error('[Worker GetBestTrade]: Abort Error:', e)
      }
    })

    return this.postMessage(
      {
        cmd: 'getBestTrade',
        params: restParams,
      },
      eventId,
    )
  }

  public getBestTradeOffchain = async (
    params: WorkerGetBestTradeOffchainEvent[1]['params'] & {
      signal?: AbortSignal
    },
  ) => {
    const { signal, ...restParams } = params
    const eventId = this.nextId
    signal?.addEventListener('abort', async () => {
      try {
        await this.postMessage({
          cmd: 'abort',
          params: eventId,
        })
      } catch (e) {
        console.error('[Worker GetBestTrade]: Abort Error:', e)
      }
    })

    return this.postMessage<V4Router.Transformer.SerializedV4Trade>(
      {
        cmd: 'getBestTradeOffchain',
        params: restParams,
      },
      eventId,
    )
  }

  public destroy = async () => {
    return this.worker.terminate()
  }

  private get nextId() {
    return this.id + 1
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
