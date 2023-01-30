import { Currency, TradeType } from '@pancakeswap/sdk'
import { Field } from 'state/swap/actions'
import useSWRImmutable from 'swr/immutable'
import { getRFQById, sendRFQAndGetRFQId } from '../apis'
import { MessageType, QuoteRequest, RFQResponse, TradeWithMM } from '../types'
import { parseMMTrade } from '../utils/exchange'

const delay = (t) => new Promise((resolve) => setTimeout(resolve, t))

const fetchRFQResult = async (param: QuoteRequest) => {
  const data = await sendRFQAndGetRFQId(param) // get rfq id always works
  // get rfq sometimes have some issue, need to fix from BE
  // can be fixed buy using delay for now
  await delay(6000)
  const rfq = await getRFQById(data?.message.rfqId) // || data?.message.rfqId
  return rfq
}

export const useGetRFQTrade = (
  independentField: Field,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  param: QuoteRequest,
  isMMBetter: boolean,
): {
  rfq: RFQResponse['message']
  trade: TradeWithMM<Currency, Currency, TradeType>
  refreshRFQ: () => void
} | null => {
  const { data, mutate } = useSWRImmutable(
    isMMBetter &&
      param &&
      param.trader &&
      (param.makerSideTokenAmount || param.takerSideTokenAmount) &&
      param.makerSideTokenAmount !== '0' &&
      param.takerSideTokenAmount !== '0' && [
        `RFQ/${param.networkId}/${param.makerSideToken}/${param.takerSideToken}/${param.makerSideTokenAmount}/${param.takerSideTokenAmount}`,
      ],
    () => fetchRFQResult(param),
    { refreshInterval: 60000 }, // 60sec auto refresh
  )
  const isExactIn: boolean = independentField === Field.INPUT

  if (data?.messageType !== MessageType.RFQ_RESPONSE) return null
  return {
    rfq: data.message,
    trade: parseMMTrade(
      isExactIn,
      inputCurrency,
      outputCurrency,
      data.message.takerSideTokenAmount,
      data.message.makerSideTokenAmount,
    ),
    refreshRFQ: mutate,
  }
}
