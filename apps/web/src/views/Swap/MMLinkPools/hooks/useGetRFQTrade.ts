import useSWRImmutable from 'swr/immutable'
import { sendRFQAndGetRFQId, getRFQById } from '../apis'
import { QuoteRequest, MessageType, RFQResponse } from '../types'

const fetchRFQResult = async (param: QuoteRequest) => {
  const data = await sendRFQAndGetRFQId(param) // get rfq id always works
  // get rfq sometimes have some issue, need to fix from BE
  const rfq = await getRFQById('be1f36aa-6a3d-4b0e-9d72-67b174fb8502') // || data?.message.rfqId
  return rfq
}

export const useGetRFQTrade = (param: QuoteRequest): RFQResponse['message'] | null => {
  const { data, status, mutate } = useSWRImmutable(
    param &&
      param.trader &&
      (param.makerSideTokenAmount || param.takerSideTokenAmount) &&
      param.makerSideTokenAmount !== '0' &&
      param.takerSideTokenAmount !== '0' &&
      `RFQ/${param.networkId}/${param.makerSideToken}/${param.takerSideToken}/${param.makerSideTokenAmount}/${param.takerSideTokenAmount}`,
    () => fetchRFQResult(param),
  )
  return {
    takerSideToken: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    makerSideToken: '0x65afadd39029741b3b8f0756952c74678c9cec93',
    takerSideTokenAmount: '30000000000000000',
    makerSideTokenAmount: '49449489',
    rfqId: '803e9df3-584b-4678-8005-c833b2939b21',
    signature:
      '0x0bf88682bd4a02996be1af9509febe3d41930f890f592a476e27358569412e9a09c0eb31b94aab5edf52b1638c209cb7124b4028efab137ceee82fc7f6f5bd281c',
    quoteExpiry: 1675080627,
    trader: '0x3148Ba523363d073dbffBB62b5C18C77F7A705e9',
    nonce: '1',
    mmId: '1',
  }

  // return data?.messageType === MessageType.RFQ_RESPONSE ? data.message : null
}
