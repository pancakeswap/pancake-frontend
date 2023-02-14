import { Currency, TradeType } from '@pancakeswap/sdk'
import { Field } from 'state/swap/actions'
import useSWRImmutable from 'swr/immutable'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getRFQById, sendRFQAndGetRFQId } from '../apis'
import { MessageType, QuoteRequest, RFQResponse, TradeWithMM } from '../types'
import { parseMMTrade } from '../utils/exchange'

export const useGetRFQId = (param: QuoteRequest, isMMBetter: boolean): { rfqId: string; refreshRFQ: () => void } => {
  const { account } = useActiveWeb3React()
  const { data, mutate } = useSWRImmutable(
    isMMBetter &&
      account &&
      param &&
      param?.trader &&
      (param?.makerSideTokenAmount || param?.takerSideTokenAmount) &&
      param?.makerSideTokenAmount !== '0' &&
      param?.takerSideTokenAmount !== '0' && [
        `RFQ/${param.networkId}/${param.makerSideToken}/${param.takerSideToken}/${param.makerSideTokenAmount}/${param.takerSideTokenAmount}`,
      ],
    () => sendRFQAndGetRFQId(param),
    { refreshInterval: 30000 }, // 30 sec auto refresh Id once
  )
  return { rfqId: data?.message?.rfqId ?? '', refreshRFQ: mutate }
}

export const useGetRFQTrade = (
  rfqId: string,
  independentField: Field,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  isMMBetter: boolean,
  refreshRFQ: () => void,
): {
  rfq: RFQResponse['message'] | null
  trade: TradeWithMM<Currency, Currency, TradeType> | null
  refreshRFQ: () => void | null
  quoteExpiry: number | null
  error?: string
  rfqId?: string
} | null => {
  const { data, error } = useSWRImmutable(isMMBetter && rfqId && [`RFQ/${rfqId}`], () => getRFQById(rfqId), {
    errorRetryCount: 10,
    errorRetryInterval: 1000,
  })
  const isExactIn: boolean = independentField === Field.INPUT

  if (error && error?.message && !data?.message)
    return {
      rfq: null,
      trade: null,
      quoteExpiry: null,
      refreshRFQ: null,
      error: error?.message === 'RFQ not found' ? 'fetching... RFQ' : error?.message,
      rfqId,
    }
  if (data?.messageType === MessageType.RFQ_RESPONSE)
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
    }
  return null
}
