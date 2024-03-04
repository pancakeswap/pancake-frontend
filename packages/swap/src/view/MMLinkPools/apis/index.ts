import {
  OrderBookRequest,
  OrderBookResponse,
  QuoteRequest,
  RFQIdResponse,
  RFQResponse,
  RFQErrorResponse,
  zRFQResponse,
  MessageType,
} from '../types'

const API_ENDPOINT = process.env.NEXT_PUBLIC_MM_API_URL

export const getMMOrderBook = async (param: OrderBookRequest): Promise<OrderBookResponse> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/order-book-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    })
    const data = await response.json()
    return data as OrderBookResponse
  } catch (e) {
    return Promise.reject(e)
  }
}

export const sendRFQAndGetRFQId = async (param: QuoteRequest): Promise<RFQIdResponse> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/rfq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    })
    const data = await response.json()
    return data as RFQIdResponse
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getRFQById = async (id: string | number) => {
  const response = await fetch(`${API_ENDPOINT}/rfq/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const data = (await response.json()) as RFQResponse | RFQErrorResponse

  if (data?.messageType === MessageType.RFQ_ERROR) {
    if (data?.message?.error === 'RFQ not found')
      throw new RFQErrorNotFound(data?.message?.error, response.status !== 404)
    if (data?.message?.error.includes(RFQInsufficientError.originMessage)) throw new RFQInsufficientError()
    throw new MMError(data?.message?.error)
  }
  zRFQResponse.parse(data)
  return data
}

export class MMError extends Error {
  shouldRetry: boolean

  internalError?: string

  constructor(message?: string) {
    super(message)
    this.internalError = message
    this.message = 'Unable request a quote'
  }
}

export class RFQErrorNotFound extends MMError {
  constructor(message: string, shouldRetry: boolean) {
    super()
    this.internalError = message
    if (shouldRetry) {
      this.message = 'Quoting'
    } else {
      this.message = 'Cannot find quote now. Please try again later.'
    }
    this.shouldRetry = shouldRetry
  }
}

class RFQInsufficientError extends MMError {
  static originMessage = 'insufficient_liquidity'

  shouldRetry = false

  constructor() {
    super()
    this.message = 'Insufficient liquidity. Please try again later.'
  }
}
