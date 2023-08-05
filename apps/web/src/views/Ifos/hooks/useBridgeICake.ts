import { useMemo, useState } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { getCrossChainMessageUrl, CrossChainMessage } from '@pancakeswap/ifos'
import { getBlockExploreLink } from 'utils'

export enum BRIDGE_STATE {
  // Before start bridging
  INITIAL,

  // Pending user sign tx on wallet
  PENDING_WALLET_SIGN,

  // Sending tx on source chain
  PENDING_SOURCE_CHAIN_TX,

  // After getting receipt on source chain,
  // while pending tx on destination chain
  PENDING_CROSS_CHAIN_TX,

  // After message got confirmed on destination chain
  FINISHED,
}

export type BaseBridgeState = {
  state: BRIDGE_STATE.INITIAL | BRIDGE_STATE.PENDING_WALLET_SIGN | BRIDGE_STATE.PENDING_SOURCE_CHAIN_TX
}

export type PendingCrossChainState = {
  state: BRIDGE_STATE.PENDING_CROSS_CHAIN_TX
} & CrossChainMessage

export type BridgeSuccessState = {
  state: BRIDGE_STATE.FINISHED
} & CrossChainMessage

export type BridgeState = BaseBridgeState | PendingCrossChainState | BridgeSuccessState

const INITIAL_BRIDGE_STATE: BridgeState = {
  state: BRIDGE_STATE.FINISHED,
  srcUaAddress: '0x39061b58ecb2df82b5886528d77b3094179ce292',
  srcChainId: ChainId.BSC,
  srcUaNonce: 1,
  dstChainId: ChainId.POLYGON_ZKEVM,
  dstUaAddress: '0xe5de11958969e75c57e5708651a49f0cf3f34d13',
  dstTxHash: '0x8617b7ef9569113b09befdc0f11bd18caa912e3f68f38999a179cdb80fd96f77',
}

export function useBridgeICake() {
  const [bridgeState, setBridgeState] = useState<BridgeState>(INITIAL_BRIDGE_STATE)

  return {
    state: bridgeState,
  }
}

export function useBridgeMessageUrl(state: BridgeState) {
  return useMemo(
    () =>
      state.state === BRIDGE_STATE.PENDING_CROSS_CHAIN_TX || state.state === BRIDGE_STATE.FINISHED
        ? getCrossChainMessageUrl(state)
        : null,
    [state],
  )
}

export function useBridgeSuccessTxUrl(state: BridgeState) {
  return useMemo(
    () =>
      state.state === BRIDGE_STATE.FINISHED && state.dstTxHash
        ? getBlockExploreLink(state.dstTxHash, 'transaction', state.dstChainId)
        : null,
    [state],
  )
}
