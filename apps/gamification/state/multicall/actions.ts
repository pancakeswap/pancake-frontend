import { createAction } from '@reduxjs/toolkit'
import { Address, Hex } from 'viem'

export interface Call {
  address: Address
  callData: Hex
}

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
const LOWER_HEX_REGEX = /^0x[a-f0-9]*$/
export function toCallKey(call: Call): string {
  if (!ADDRESS_REGEX.test(call.address)) {
    throw new Error(`Invalid address: ${call.address}`)
  }
  if (!LOWER_HEX_REGEX.test(call.callData)) {
    throw new Error(`Invalid hex: ${call.callData}`)
  }
  return `${call.address}-${call.callData}`
}

export function parseCallKey(callKey: string): Call {
  const pcs = callKey.split('-')
  if (pcs.length !== 2) {
    throw new Error(`Invalid call key: ${callKey}`)
  }
  return {
    address: pcs[0] as Hex,
    callData: pcs[1] as Hex,
  }
}

export interface ListenerOptions {
  // how often this data should be fetched, by default 1
  readonly blocksPerFetch?: number
  enabled?: boolean
}

export interface ListenerOptionsWithGas extends ListenerOptions {
  readonly gasRequired?: number
}

export const addMulticallListeners = createAction<{ chainId: number; calls: Call[]; options?: ListenerOptions }>(
  'multicall/addMulticallListeners',
)
export const removeMulticallListeners = createAction<{ chainId: number; calls: Call[]; options?: ListenerOptions }>(
  'multicall/removeMulticallListeners',
)
export const fetchingMulticallResults = createAction<{ chainId: number; calls: Call[]; fetchingBlockNumber: number }>(
  'multicall/fetchingMulticallResults',
)
export const errorFetchingMulticallResults = createAction<{
  chainId: number
  calls: Call[]
  fetchingBlockNumber: number
}>('multicall/errorFetchingMulticallResults')
export const updateMulticallResults = createAction<{
  chainId: number
  blockNumber: number
  results: {
    [callKey: string]: string | null
  }
}>('multicall/updateMulticallResults')
