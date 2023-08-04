import { useState, useEffect, useMemo } from 'react'
import type WallchainSDK from '@wallchain/sdk'
import { TOptions } from '@wallchain/sdk'
import { Token, TradeType, Currency } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { useWalletClient } from 'wagmi'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { basisPointsToPercent } from 'utils/exchange'
import { FeeOptions } from '@pancakeswap/v3-sdk'
import { captureException } from '@sentry/nextjs'

import Bottleneck from 'bottleneck'
import { Address, Hex } from 'viem'
import { WallchainKeys, WallchainPairs } from 'config/wallchain'
import { useSwapCallArguments } from './useSwapCallArguments'

interface SwapCall {
  address: Address
  calldata: Hex
  value: Hex
}
interface WallchainSwapCall {
  getCall: () => Promise<SwapCall>
}

export type WallchainStatus = 'found' | 'pending' | 'not-found'

const limiter = new Bottleneck({
  maxConcurrent: 1, // only allow one request at a time
  minTime: 250, // add 250ms of spacing between requests
  highWater: 1, // only queue 1 request at a time, newer request will drop older
})

const overrideAddresses = {
  56: '0x6346e0a39e2fBbc133e4ce8390ab567108e62aEe',
}

const checkAddresses = (src: false | `0x${string}`, dst: false | `0x${string}`) => {
  if (src && dst) {
    const pair = WallchainPairs.find(([a, b]) => (a === src && b === dst) || (a === dst && b === src))
    return !!pair
  }
  return false
}

const loadData = async (account: string, sdk: WallchainSDK, swapCalls: SwapCall[]) => {
  if (await sdk.supportsChain()) {
    const resp = await sdk.checkForMEV({
      from: account,
      to: swapCalls[0].address,
      value: swapCalls[0].value,
      data: swapCalls[0].calldata,
    })

    if (resp.MEVFound) {
      const approvalFor = await sdk.getSpenderForAllowance()
      return ['found', approvalFor, resp.masterInput]
    }
  }
  return ['not-found', undefined, undefined]
}
const wrappedLoadData = limiter.wrap(loadData)

const extractAddressFromCurrency = (currency: Currency): `0x${string}` => {
  return currency.isNative ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' : (currency as Token).address
}

const extractTokensFromTrade = (trade: SmartRouterTrade<TradeType> | undefined | null) => {
  const inputCurrency = trade?.inputAmount?.currency
  const outputCurrency = trade?.outputAmount?.currency
  const srcToken = inputCurrency ? extractAddressFromCurrency(inputCurrency) : false
  const dstToken = outputCurrency ? extractAddressFromCurrency(outputCurrency) : false

  return [srcToken, dstToken] as [false | `0x${string}`, false | `0x${string}`]
}

export function useWallchainApi(
  trade?: SmartRouterTrade<TradeType>,
  deadline?: bigint,
  feeOptions?: FeeOptions,
): [WallchainStatus, string | undefined, string | undefined] {
  const [approvalAddress, setApprovalAddress] = useState<undefined | string>(undefined)
  const [status, setStatus] = useState<WallchainStatus>('pending')
  const [masterInput, setMasterInput] = useState<undefined | string>(undefined)
  const { data: walletClient } = useWalletClient()
  const { account } = useAccountActiveChain()
  const [allowedSlippageRaw] = useUserSlippage() || [INITIAL_ALLOWED_SLIPPAGE]
  const allowedSlippage = useMemo(() => basisPointsToPercent(allowedSlippageRaw), [allowedSlippageRaw])
  const [sdk, setSDK] = useState<WallchainSDK | undefined>(undefined)

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, account, deadline, feeOptions)

  useEffect(() => {
    ;(async () => {
      if (!walletClient) return
      if (!sdk) {
        const WallchainSDK = (await import('@wallchain/sdk')).default
        setSDK(
          new WallchainSDK({
            keys: WallchainKeys,
            provider: walletClient.transport as TOptions['provider'],
            overrideAddresses,
          }),
        )
        return
      }
      const [srcToken, dstToken] = extractTokensFromTrade(trade)
      if (checkAddresses(srcToken, dstToken)) {
        setStatus('pending')
        wrappedLoadData(account, sdk, swapCalls)
          .then(([reqStatus, address, recievedMasterInput]) => {
            setStatus(reqStatus as WallchainStatus)
            setApprovalAddress(address)
            setMasterInput(recievedMasterInput)
          })
          .catch((e) => {
            setStatus('not-found')
            setApprovalAddress(undefined)
            setMasterInput(undefined)
            captureException(e)
          })
      } else {
        setStatus('not-found')
        setApprovalAddress(undefined)
        setMasterInput(undefined)
      }
    })()
  }, [walletClient, account, swapCalls, sdk, trade])

  return [status, approvalAddress, masterInput]
}

export function useWallchainSwapCallArguments(
  trade: SmartRouterTrade<TradeType> | undefined | null,
  previousSwapCalls: { address: `0x${string}`; calldata: `0x${string}`; value: `0x${string}` }[] | undefined | null,
  account: string | undefined | null,
  masterInput?: string,
) {
  const [swapCalls, setSwapCalls] = useState<SwapCall[] | WallchainSwapCall[]>([])
  const { data: walletClient } = useWalletClient()

  const [srcToken, dstToken] = extractTokensFromTrade(trade)
  const amountIn = trade?.inputAmount?.numerator?.toString() as `0x${string}`
  const needPermit = !trade?.inputAmount?.currency?.isNative

  useEffect(() => {
    ;(async () => {
      if (
        !walletClient ||
        !masterInput ||
        !srcToken ||
        !dstToken ||
        !amountIn ||
        !previousSwapCalls ||
        !previousSwapCalls[0] ||
        !account
      ) {
        if (!previousSwapCalls || !previousSwapCalls.length) {
          setSwapCalls([])
        } else {
          setSwapCalls(previousSwapCalls)
        }

        return
      }

      const callback = async () => {
        try {
          const WallchainSDK = (await import('@wallchain/sdk')).default
          const sdk = new WallchainSDK({
            keys: WallchainKeys,
            provider: walletClient.transport as TOptions['provider'],
            overrideAddresses,
          })
          const spender = (await sdk.getSpender()) as `0x${string}`

          let witness: false | Awaited<ReturnType<typeof sdk.signPermit>> = false
          if (needPermit) {
            witness = await sdk.signPermit(srcToken as `0x${string}`, account, spender, amountIn)
          }

          const data = await sdk.createNewTransaction(
            {
              value: previousSwapCalls[0].value,
              to: previousSwapCalls[0].address,
              data: previousSwapCalls[0].calldata,
              from: account,
              srcToken: srcToken as `0x${string}`,
              dstToken: dstToken as `0x${string}`,
              amountIn,
              isPermit: false,
            },
            masterInput,
            witness,
          )

          return {
            address: data.to as `0x${string}`,
            calldata: data.data as `0x${string}`,
            value: data.value as `0x${string}`,
          }
        } catch (e) {
          return previousSwapCalls[0]
        }
      }

      setSwapCalls([{ getCall: callback }])
    })()
  }, [account, previousSwapCalls, masterInput, srcToken, dstToken, amountIn, needPermit, walletClient])

  return swapCalls
}
