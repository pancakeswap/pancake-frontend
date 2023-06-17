import axios from 'axios'
// will cleanup urls later
const MOONPAY_EBDPOINT = `https://api.moonpay.com/v3/currencies/`

export async function fetchMoonpayQuote(baseAmount: number, currencyCode: string, outputCurrency: string) {
  // Fetch data from endpoint 1
  const response = await fetch(
    `${MOONPAY_EBDPOINT}${outputCurrency.toLowerCase()}/buy_quote/?apiKey=pk_live_Ch5fat39X8NvMZwih2k7hK4sDrKanSPz&baseCurrencyAmount=${baseAmount}&&baseCurrencyCode=${currencyCode.toLowerCase()}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
  const result = response.json()
  return result
}

export async function fetchMercuryoQuote(payload: any) {
  // Fetch data from endpoint 2

  const res = await axios.post('https://pcs-onramp-api.com/fetch-mercuryo-quote', payload)
  const result = res.data
  return result.result.result
}

// export async function fetchMercuryoQuote(fiatCurrency: string, cryptoCurrency: string, amount: number) {
//   // Fetch data from endpoint 2
//   const response = await fetch(
//     `${MERCURYO_ENDPOINT}?from=${fiatCurrency.toUpperCase()}&to=${cryptoCurrency.toUpperCase()}&amount=${
//       amount + 7
//     }&widget_id=64d1f9f9-85ee-4558-8168-1dc0e7057ce6`,
//     {
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//     },
//   )
//   const result = response.json()
//   return result
// }

// for bsc connect we need to fetch our own custom api endpoint as even get requests require
// sig validation
export async function fetchBinanceConnectQuote(payload: any) {
  const response = await fetch('https://pcs-onramp-api.com/fetch-bsc-quote', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const result = response.json()
  return result
}
