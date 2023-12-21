import { ChainId } from '@pancakeswap/chains'
import { Currency, Token, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { FeeOptions } from '@pancakeswap/v3-sdk'
import { captureException } from '@sentry/nextjs'
import { useQuery } from '@tanstack/react-query'
import type WallchainSDK from '@wallchain/sdk'
import type { TMEVFoundResponse } from '@wallchain/sdk'
import { TOptions } from '@wallchain/sdk'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { atom, useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { basisPointsToPercent } from 'utils/exchange'
import { useWalletClient } from 'wagmi'

import Bottleneck from 'bottleneck'
import { WALLCHAIN_ENABLED, WallchainKeys, WallchainTokens } from 'config/wallchain'
import { Address, Hex } from 'viem'
import { useSwapCallArguments } from './useSwapCallArguments'

interface SwapCall {
  address: Address
  calldata: Hex
  value: Hex
}
interface WallchainSwapCall {
  getCall: () => Promise<SwapCall | { error: Error }>
}

export type WallchainStatus = 'found' | 'pending' | 'not-found'
export type TWallchainMasterInput = [TMEVFoundResponse['searcherRequest'], string | undefined] | undefined

const limiter = new Bottleneck({
  maxConcurrent: 1, // only allow one request at a time
  minTime: 250, // add 250ms of spacing between requests
  highWater: 1, // only queue 1 request at a time, newer request will drop older
})

const addresses = {
  // MetaSwapWrapper
  56: '0xC0ffeE00c3F5A11369EeB57693C56Fd939dc6DBb',
}
const permitAddresses = {
  56: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
}

const originators = {
  56: ['0xaAB27a41646A4b7e660f2BFc6e22a41550665fef'],
}

const loadData = async (account: string, sdk: WallchainSDK, swapCalls: SwapCall[]) => {
  if (await sdk.supportsChain()) {
    const approvalFor = await sdk.getSpenderForAllowance()

    try {
      const resp = await sdk.checkForMEV({
        from: account,
        to: swapCalls[0].address,
        value: swapCalls[0].value,
        data: swapCalls[0].calldata,
      })
      if (resp.MEVFound) {
        return ['found', approvalFor, resp.searcherRequest, resp.searcherSignature, resp.suggestedGas] as const
      }
    } catch (e) {
      return ['not-found', undefined, undefined, undefined, undefined]
    }
  }
  return ['not-found', undefined, undefined, undefined, undefined]
}
const wrappedLoadData = limiter.wrap(loadData)

const extractAddressFromCurrency = (currency: Currency): `0x${string}` => {
  return currency.isNative ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : (currency as Token).address
}

const extractTokensFromTrade = (trade: SmartRouterTrade<TradeType> | undefined | null) => {
  const inputCurrency = trade?.inputAmount?.currency
  const outputCurrency = trade?.outputAmount?.currency
  const srcToken = inputCurrency ? extractAddressFromCurrency(inputCurrency) : false
  const dstToken = outputCurrency ? extractAddressFromCurrency(outputCurrency) : false

  return [srcToken, dstToken] as [false | `0x${string}`, false | `0x${string}`]
}

function useWallchainSDK() {
  const { data: walletClient } = useWalletClient()
  const { chainId } = useActiveChainId()
  const { data: wallchainSDK } = useQuery({
    queryKey: ['wallchainSDK', walletClient?.account, walletClient?.chain],

    queryFn: async () => {
      const WallchainSDK = (await import('@wallchain/sdk')).default
      return new WallchainSDK({
        keys: WallchainKeys as { [key: string]: string },
        provider: walletClient?.transport as TOptions['provider'],
        addresses,
        permitAddresses,
        originators,
      })
    },

    enabled: Boolean(chainId === ChainId.BSC && walletClient && WALLCHAIN_ENABLED),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return wallchainSDK
}

const wallchainStatusAtom = atom<WallchainStatus>('pending')
export function useWallchainStatus() {
  return useAtom(wallchainStatusAtom)
}

export function useWallchainApi(
  trade?: SmartRouterTrade<TradeType>,
  deadline?: bigint,
  feeOptions?: FeeOptions,
): [WallchainStatus, string | undefined, [TMEVFoundResponse['searcherRequest'], string | undefined] | undefined] {
  const [approvalAddress, setApprovalAddress] = useState<undefined | string>(undefined)
  const [status, setStatus] = useWallchainStatus()
  const [masterInput, setMasterInput] = useState<
    undefined | [TMEVFoundResponse['searcherRequest'], string | undefined]
  >(undefined)
  const { data: walletClient } = useWalletClient()
  const { account } = useAccountActiveChain()
  const [allowedSlippageRaw] = useUserSlippage() || [INITIAL_ALLOWED_SLIPPAGE]
  const allowedSlippage = useMemo(() => basisPointsToPercent(allowedSlippageRaw), [allowedSlippageRaw])
  const [lastUpdate, setLastUpdate] = useState(0)
  const useUniversalRouter = true

  const sdk = useWallchainSDK()

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, account, undefined, deadline, feeOptions)

  useEffect(() => {
    if (!sdk || !walletClient || !trade || !account || useUniversalRouter) {
      setStatus('not-found')
      return
    }
    if (trade.routes.length === 0 || trade.inputAmount.currency.chainId !== ChainId.BSC) return
    if (lastUpdate > Date.now() - 2000) return
    const includesToken = trade.routes.some((route) => {
      const goodSrc =
        route.inputAmount.currency.isToken && WallchainTokens.some((token) => route.inputAmount.currency.equals(token))
      const goodDst =
        route.outputAmount.currency.isToken &&
        WallchainTokens.some((token) => route.outputAmount.currency.equals(token))
      return goodSrc || goodDst
    })
    if (includesToken) {
      if (status !== 'found') {
        // we need status only for the first time, to ensure that first response is loaded, but then we expect to reuse response for 2 seconds (line 135)
        setStatus('pending')
      }
      wrappedLoadData(account, sdk, swapCalls)
        .then(([reqStatus, address, searcherRequest, searcherSignature]) => {
          setStatus(reqStatus as WallchainStatus)
          setApprovalAddress(address)
          setMasterInput([searcherRequest as TMEVFoundResponse['searcherRequest'], searcherSignature as string])
          setLastUpdate(Date.now())
        })
        .catch((e) => {
          setStatus('not-found')
          setApprovalAddress(undefined)
          setMasterInput(undefined)
          captureException(e)
          setLastUpdate(Date.now())
        })
    } else {
      setStatus('not-found')
      setApprovalAddress(undefined)
      setMasterInput(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletClient, account, swapCalls, sdk, trade, setStatus])

  return [status, approvalAddress, masterInput]
}

export function useWallchainSwapCallArguments(
  trade: SmartRouterTrade<TradeType> | undefined | null,
  previousSwapCalls: { address: `0x${string}`; calldata: `0x${string}`; value: `0x${string}` }[] | undefined | null,
  account: string | undefined | null,
  onWallchainDrop: () => void,
  masterInput?: [TMEVFoundResponse['searcherRequest'], string],
): SwapCall[] | WallchainSwapCall[] {
  const [swapCalls, setSwapCalls] = useState<SwapCall[] | WallchainSwapCall[]>([])
  const { data: walletClient } = useWalletClient()

  const [srcToken, dstToken] = extractTokensFromTrade(trade)
  const isNative = trade?.inputAmount?.currency?.isNative
  const amountIn = trade?.inputAmount?.numerator?.toString() as `0x${string}`
  const needPermit = !trade?.inputAmount?.currency?.isNative

  const sdk = useWallchainSDK()

  useEffect(() => {
    if (
      !walletClient ||
      !masterInput ||
      !masterInput[0] ||
      !srcToken ||
      !dstToken ||
      !amountIn ||
      !previousSwapCalls ||
      !previousSwapCalls[0] ||
      !sdk ||
      !account
    ) {
      if (!previousSwapCalls || !previousSwapCalls.length) {
        setSwapCalls([])
      } else {
        setSwapCalls(previousSwapCalls)
      }

      return
    }

    loadData(account, sdk, previousSwapCalls).then(async (response) => {
      const [status, _approvalAddress, searcherRequest, searcherSignature, suggestedGas] = response as [
        WallchainStatus,
        string | undefined,
        TMEVFoundResponse['searcherRequest'] | undefined,
        string | undefined,
        string | undefined,
      ]
      if (status === 'not-found') {
        if (isNative) {
          setSwapCalls(previousSwapCalls)
        } else {
          // if previous call succeded but MEV disappeared need to reset allowance flow
          const callback = async () => {
            onWallchainDrop()
            return {
              error: new Error('MEV not found'),
            }
          }
          setSwapCalls([{ getCall: callback }])
        }
      } else {
        const callback = async () => {
          try {
            const spender = (await sdk.getSpender()) as `0x${string}`
            let witness: false | Awaited<ReturnType<typeof sdk.signPermit>> = false

            if (needPermit) {
              witness = await sdk.signPermit(srcToken, account, spender, amountIn)
            }

            const data = await sdk.createNewTransaction(
              previousSwapCalls[0].address,
              previousSwapCalls[0].address,
              false,
              previousSwapCalls[0].calldata,
              amountIn,
              previousSwapCalls[0].value,
              srcToken,
              dstToken,
              searcherSignature as `0x${string}`,
              searcherRequest as unknown as TMEVFoundResponse['searcherRequest'],
              witness,
            )

            return {
              address: data.to as `0x${string}`,
              calldata: data.data as `0x${string}`,
              value: data.value as `0x${string}`,
              gas: suggestedGas,
            }
          } catch (error) {
            return { error } as { error: Error }
          }
        }

        setSwapCalls([{ getCall: callback }])
      }
    })
  }, [
    account,
    previousSwapCalls,
    masterInput,
    srcToken,
    dstToken,
    amountIn,
    needPermit,
    walletClient,
    sdk,
    onWallchainDrop,
    isNative,
  ])

  return swapCalls
}
