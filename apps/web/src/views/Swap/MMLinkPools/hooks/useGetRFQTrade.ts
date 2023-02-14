import { Currency, TradeType } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { MutableRefObject, useDeferredValue } from 'react'
import { Field } from 'state/swap/actions'
import { useQuery } from '@tanstack/react-query'
import { getRFQById, sendRFQAndGetRFQId } from '../apis'
import { MessageType, QuoteRequest, RFQResponse, TradeWithMM } from '../types'
import { parseMMTrade } from '../utils/exchange'

// export const useGetRFQId = (param: QuoteRequest, isMMBetter: boolean): { rfqId: string; refreshRFQ: () => void } => {
//   const { account } = useActiveWeb3React()
//   const { data, mutate } = useSWRImmutable(
//     isMMBetter &&
//       account &&
//       param &&
//       param?.trader &&
//       (param?.makerSideTokenAmount || param?.takerSideTokenAmount) &&
//       param?.makerSideTokenAmount !== '0' &&
//       param?.takerSideTokenAmount !== '0' && [
//         `RFQ/${param.networkId}/${param.makerSideToken}/${param.takerSideToken}/${param.makerSideTokenAmount}/${param.takerSideTokenAmount}`,
//       ],
//     () => sendRFQAndGetRFQId(param),
//     { refreshInterval: 30000 }, // 30 sec auto refresh Id once
//   )
//   return { rfqId: data?.message?.rfqId ?? '', refreshRFQ: mutate }
// }

export const useGetRFQId = (
  param: QuoteRequest | null,
  isMMBetter: boolean,
  rfqUserInputPath: MutableRefObject<string>,
  isRFQLive: MutableRefObject<boolean>,
): { rfqId: string; refreshRFQ: () => void; rfqUserInputCache: string; isLoading: boolean } => {
  const { account } = useActiveWeb3React()

  if (rfqUserInputPath)
    // eslint-disable-next-line no-param-reassign
    rfqUserInputPath.current = `${param?.networkId}/${param?.makerSideToken}/${param?.takerSideToken}/${param?.makerSideTokenAmount}/${param?.takerSideTokenAmount}`
  // eslint-disable-next-line no-param-reassign
  if (isRFQLive) isRFQLive.current = false

  const enabled = Boolean(
    isMMBetter &&
      account &&
      param &&
      param?.trader &&
      (param?.makerSideTokenAmount || param?.takerSideTokenAmount) &&
      param?.makerSideTokenAmount !== '0' &&
      param?.takerSideTokenAmount !== '0',
  )

  const { data, refetch, isLoading } = useQuery(
    [`RFQ/${rfqUserInputPath.current}`],
    () => sendRFQAndGetRFQId(param),
    {
      refetchInterval: 20000,
      retry: true,
      refetchOnWindowFocus: false,
      enabled,
    }, // 20sec
  )
  return {
    rfqId: data?.message?.rfqId ?? '',
    refreshRFQ: refetch,
    rfqUserInputCache: rfqUserInputPath.current,
    isLoading: enabled && isLoading,
  }
}

export const useGetRFQTrade = (
  rfqId: string,
  independentField: Field,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  isMMBetter: boolean,
  refreshRFQ: () => void,
  isRFQLive: MutableRefObject<boolean>,
): {
  rfq: RFQResponse['message'] | null
  trade: TradeWithMM<Currency, Currency, TradeType> | null
  refreshRFQ: () => void | null
  quoteExpiry: number | null
  isLoading: boolean
  error?: string
  rfqId?: string
} | null => {
  const deferedRfqId = useDeferredValue(rfqId)
  const { error, data, isLoading } = useQuery([`RFQ/${deferedRfqId}`], () => getRFQById(deferedRfqId), {
    enabled: Boolean(isMMBetter && deferedRfqId),
    retry: 6,
    staleTime: Infinity,
  })
  // const { data, error, isLoading } = useSWRImmutable(isMMBetter && rfqId && [`RFQ/${rfqId}`], () => getRFQById(rfqId), {
  //   errorRetryCount: 10,
  //   errorRetryInterval: 1000,
  // })
  const isExactIn: boolean = independentField === Field.INPUT

  if (error && error instanceof Error && error?.message && !data?.message)
    return {
      rfq: null,
      trade: null,
      quoteExpiry: null,
      refreshRFQ: null,
      error: error?.message === 'RFQ not found' ? 'fetching... RFQ' : error?.message,
      rfqId,
      isLoading,
    }
  if (data?.messageType === MessageType.RFQ_RESPONSE) {
    // eslint-disable-next-line no-param-reassign
    if (isRFQLive) isRFQLive.current = true
    return {
      rfq: data?.message,
      trade: parseMMTrade(
        isExactIn,
        inputCurrency,
        outputCurrency,
        data?.message?.takerSideTokenAmount,
        data?.message?.makerSideTokenAmount,
      ),
      quoteExpiry: data?.message?.quoteExpiry ?? null,
      refreshRFQ,
      isLoading,
    }
  }
  return null
}
