import { SmartRouter, V4Router } from '@pancakeswap/smart-router'
import { Call } from 'state/multicall/actions'

export interface Command {
  execute(messageAbortControllers: Map<number, AbortController>): Promise<any>
}

export enum CommandType {
  GET_BEST_TRADE = 'getBestTrade',
  GET_BEST_TRADE_OFFCHAIN = 'getBestTradeOffchain',
  MULTICALL_CHUNK = 'multicallChunk',
  ABORT = 'abort',
}

export type WorkerGetBestTradeEvent = [
  id: number,
  message: {
    cmd: CommandType.GET_BEST_TRADE
    params: SmartRouter.APISchema.RouterPostParams
  },
]

export type AbortEvent = [
  id: number,
  message: {
    cmd: CommandType.ABORT
    params: number
  },
]

export type WorkerMultiChunkEvent = [
  id: number,
  message: {
    cmd: CommandType.MULTICALL_CHUNK
    params: {
      chainId: number
      chunk: Call[]
      minBlockNumber: number
    }
  },
]

export type WorkerGetBestTradeOffchainEvent = [
  id: number,
  message: {
    cmd: CommandType.GET_BEST_TRADE_OFFCHAIN
    params: V4Router.APISchema.RouterPostParams
  },
]

export type WorkerEvent = WorkerGetBestTradeEvent | WorkerMultiChunkEvent | AbortEvent | WorkerGetBestTradeOffchainEvent
