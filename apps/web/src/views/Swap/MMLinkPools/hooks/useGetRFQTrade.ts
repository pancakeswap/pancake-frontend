import { Currency } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { MutableRefObject, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useDebounce } from '@pancakeswap/hooks'
import { Field } from 'state/swap/actions'
import { useQuery } from '@tanstack/react-query'
import { getRFQById, MMError, sendRFQAndGetRFQId } from '../apis'
import { MessageType, MMRfqTrade, QuoteRequest, RFQResponse } from '../types'
import { parseMMTrade } from '../utils/exchange'

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

  const enabled = Boolean(
    isMMBetter &&
      account &&
      param &&
      param?.trader &&
      ((param?.makerSideTokenAmount && param?.makerSideTokenAmount !== '0') ||
        (param?.takerSideTokenAmount && param?.takerSideTokenAmount !== '0')),
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
  // eslint-disable-next-line no-param-reassign
  if (!data?.message?.rfqId) isRFQLive.current = false

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
): MMRfqTrade | null => {
  const deferredRfqId = useDeferredValue(rfqId)
  const deferredIsMMBetter = useDebounce(isMMBetter, 300)
  const enabled = Boolean(deferredIsMMBetter && deferredRfqId)
  const [{ error, data, isLoading }, setRfqState] = useState<{ error: unknown; data: RFQResponse; isLoading: boolean }>(
    {
      error: null,
      data: null,
      isLoading: false,
    },
  )
  const {
    error: errorResponse,
    data: dataResponse,
    isLoading: isLoadingResponse,
  } = useQuery([`RFQ/${deferredRfqId}`], () => getRFQById(deferredRfqId), {
    enabled,
    staleTime: Infinity,
    retry: (failureCount, err) => {
      if (err instanceof MMError) {
        return err.shouldRetry
      }
      return failureCount < 4
    },
  })
  const isExactIn: boolean = independentField === Field.INPUT

  useEffect(() => {
    setRfqState((prevState) => {
      if (!enabled)
        return {
          error: null,
          data: null,
          isLoading: false,
        }
      const { data: prevData } = prevState
      return {
        error: errorResponse,
        data: !prevState ? dataResponse : isLoadingResponse ? prevData : dataResponse,
        isLoading: isLoadingResponse,
      }
    })
  }, [errorResponse, dataResponse, isLoadingResponse, enabled])

  return useMemo(() => {
    if (error && error instanceof Error && error?.message) {
      // eslint-disable-next-line no-param-reassign
      if (isRFQLive) isRFQLive.current = false
      return {
        rfq: null,
        trade: null,
        quoteExpiry: null,
        refreshRFQ: null,
        error,
        rfqId,
        isLoading: enabled && isLoading,
      }
    }
    if (data?.messageType === MessageType.RFQ_RESPONSE) {
      // eslint-disable-next-line no-param-reassign
      if (isRFQLive) isRFQLive.current = true
      return {
        rfq: data?.message,
        rfqId,
        trade: parseMMTrade(
          isExactIn,
          inputCurrency,
          outputCurrency,
          data?.message?.takerSideTokenAmount,
          data?.message?.makerSideTokenAmount,
        ),
        quoteExpiry: data?.message?.quoteExpiry ?? null,
        refreshRFQ,
        isLoading: enabled && isLoading,
      }
    }
    // eslint-disable-next-line no-param-reassign
    if (isRFQLive) isRFQLive.current = false
    return {
      rfq: null,
      trade: null,
      quoteExpiry: null,
      isLoading: enabled && isLoading,
      refreshRFQ: null,
    }
  }, [
    data?.message,
    data?.messageType,
    enabled,
    error,
    inputCurrency,
    isExactIn,
    isLoading,
    isRFQLive,
    outputCurrency,
    refreshRFQ,
    rfqId,
  ])
}
