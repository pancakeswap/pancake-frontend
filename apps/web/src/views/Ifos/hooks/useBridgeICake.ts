import { useMemo, useState, useCallback, useEffect } from 'react'
import { ChainId, CurrencyAmount, Currency } from '@pancakeswap/sdk'
import {
  INFO_SENDER,
  getCrossChainMessageUrl,
  CrossChainMessage,
  getBridgeICakeGasFee,
  getCrossChainMessage,
  pancakeInfoSenderABI,
  getLayerZeroChainId,
  MessageStatus,
} from '@pancakeswap/ifos'
import { useAccount } from 'wagmi'
import { Hash, Address } from 'viem'
import localforage from 'localforage'
import { useQuery } from '@tanstack/react-query'

import { getBlockExploreLink } from 'utils'
import { getViemClients } from 'utils/viem'
import { useContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useTransactionAdder } from 'state/transactions/hooks'
import useCatchTxError from 'hooks/useCatchTxError'
import { isUserRejected } from 'utils/sentry'

import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useChainName } from './useChainNames'

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
  state: BRIDGE_STATE.INITIAL,
}

type Params = {
  ifoId: string
  srcChainId: ChainId
  ifoChainId: ChainId

  // icake on source chain
  icake?: CurrencyAmount<Currency>
  // icake on destination chain
  dstIcake?: CurrencyAmount<Currency>

  // Called if user reject signing bridge tx
  onUserReject?: () => void
}

// NOTE: this hook has side effect
export function useBridgeICake({ srcChainId, ifoChainId, icake, ifoId, dstIcake, onUserReject }: Params) {
  const [signing, setSigning] = useState(false)
  const sourceChainName = useChainName(srcChainId)
  const ifoChainName = useChainName(ifoChainId)
  const { address: account } = useAccount()
  const { callWithGasPrice } = useCallWithGasPrice()
  const addTransaction = useTransactionAdder()
  const infoSender = useContract(INFO_SENDER, pancakeInfoSenderABI, { chainId: srcChainId })
  const { receipt, saveTransactionHash, clearTransactionHash, txHash } = useLatestBridgeTx(ifoId, srcChainId)
  const message = useCrossChainMessage({ txHash: receipt?.transactionHash, srcChainId })
  const { fetchWithCatchTxError } = useCatchTxError({ throwUserRejectError: true })
  const isICakeSynced = useMemo(
    () => icake && dstIcake && icake.quotient === dstIcake.quotient && icake.quotient > 0n,
    [icake, dstIcake],
  )

  const bridge = useCallback(async () => {
    if (!account) {
      return
    }
    try {
      await fetchWithCatchTxError(async () => {
        setSigning(true)
        const gasEstimate = await getBridgeICakeGasFee({
          srcChainId,
          dstChainId: ifoChainId,
          account,
          provider: getViemClients,
        })
        const txReceipt = await callWithGasPrice(infoSender, 'sendSyncMsg', [getLayerZeroChainId(ifoChainId)], {
          value: gasEstimate.quotient,
        })
        saveTransactionHash(txReceipt.hash)
        const summary = `Bridge ${icake?.toExact()} iCAKE from ${sourceChainName} to ${ifoChainName}`
        addTransaction(txReceipt, {
          summary,
          translatableSummary: {
            text: 'Bridge %icakeAmount% iCAKE from %srcChain% to %ifoChain%',
            data: {
              icakeAmount: icake?.toExact() || '',
              srcChain: sourceChainName,
              ifoChain: ifoChainName,
            },
          },
          type: 'bridge-icake',
        })
        setSigning(false)
        return txReceipt
      })
    } catch (e) {
      if (isUserRejected(e)) {
        onUserReject?.()
        return
      }
      console.error(e)
    } finally {
      setSigning(false)
    }
  }, [
    onUserReject,
    fetchWithCatchTxError,
    saveTransactionHash,
    account,
    srcChainId,
    ifoChainId,
    callWithGasPrice,
    infoSender,
    addTransaction,
    icake,
    sourceChainName,
    ifoChainName,
  ])

  const state = useMemo<BridgeState>(() => {
    if (!txHash && !signing && !receipt && !message) {
      return INITIAL_BRIDGE_STATE
    }
    if (signing) {
      return {
        state: BRIDGE_STATE.PENDING_WALLET_SIGN,
      }
    }
    if (txHash && (!receipt || !message)) {
      return {
        state: BRIDGE_STATE.PENDING_SOURCE_CHAIN_TX,
      }
    }
    if (message && message.status !== MessageStatus.DELIVERED) {
      return {
        state: BRIDGE_STATE.PENDING_CROSS_CHAIN_TX,
        ...message,
      }
    }
    if (message && message.status === MessageStatus.DELIVERED) {
      return {
        state: BRIDGE_STATE.FINISHED,
        ...message,
      }
    }
    return INITIAL_BRIDGE_STATE
  }, [signing, receipt, message, txHash])

  const isBridging = useMemo(
    () => state.state !== BRIDGE_STATE.INITIAL && state.state !== BRIDGE_STATE.FINISHED,
    [state.state],
  )

  const isBridged = useMemo(
    () => isICakeSynced || message?.status === MessageStatus.DELIVERED,
    [message?.status, isICakeSynced],
  )

  return {
    state,
    bridge,
    isBridging,
    isBridged,
    clearBridgeHistory: clearTransactionHash,
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

const getLastBridgeTxStorageKey = (ifoId: string, chainId?: ChainId, account?: Address) =>
  chainId && account && `bridge-icake-tx-hash-latest-${account}-${chainId}-${ifoId}`

export function useLatestBridgeTx(ifoId: string, chainId?: ChainId) {
  const { address: account } = useAccount()
  const [tx, setTx] = useState<Hash | null>(null)
  const storageKey = useMemo(() => getLastBridgeTxStorageKey(ifoId, chainId, account), [ifoId, chainId, account])

  const tryGetTxFromStorage = useCallback(async () => {
    if (!storageKey) {
      return
    }

    try {
      const lastTx: Hash | null = await localforage.getItem(storageKey)
      if (lastTx) {
        setTx(lastTx)
      }
    } catch (e) {
      console.error(e)
    }
  }, [storageKey])

  const saveTransactionHash = useCallback(
    async (txHash: Hash) => {
      setTx(txHash)
      if (storageKey) {
        await localforage.setItem(storageKey, txHash)
      }
    },
    [storageKey],
  )

  const clearTransactionHash = useCallback(async () => {
    if (storageKey) {
      await localforage.removeItem(storageKey)
    }
  }, [storageKey])

  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const { data: receipt } = useQuery({
    queryKey: [tx, 'bridge-icake-tx-receipt'],
    queryFn: () => tx && waitForTransaction({ hash: tx, chainId }),
    enabled: Boolean(tx && chainId),
  })

  // Get last tx from storage on load
  useEffect(() => {
    tryGetTxFromStorage()
  }, [tryGetTxFromStorage])

  return {
    txHash: tx,
    receipt,
    saveTransactionHash,
    clearTransactionHash,
  }
}

type CrossChainMeesageParams = {
  txHash?: Hash | null
  srcChainId?: ChainId
}

export function useCrossChainMessage({ txHash, srcChainId }: CrossChainMeesageParams) {
  const { data: message } = useQuery({
    queryKey: [txHash, srcChainId, 'ifo-cross-chain-sync-message'],

    queryFn: () => {
      if (!srcChainId || !txHash) {
        throw new Error('Invalid srcChainId or tx hash')
      }

      return getCrossChainMessage({
        chainId: srcChainId,
        txHash,
      })
    },

    enabled: Boolean(txHash && srcChainId),
    refetchInterval: 5 * 1000,
  })
  return message
}
