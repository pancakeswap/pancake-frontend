import {
  OrderBookRequest,
  OrderBookResponse,
  QuoteRequest,
  RFQIdResponse,
  RFQResponse,
  RFQErrorResponse,
} from '../types'

// const API_ENDPOINT = `https://test.linked-pool.pancakeswap.com/quote-service`
const API_ENDPOINT = `https://linked-pool.pancakeswap.com/quote-service`

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

export const getRFQById = async (id: string | number): Promise<RFQResponse | RFQErrorResponse> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/rfq/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    return data as RFQResponse
  } catch (e) {
    return Promise.reject(e)
  }
}
