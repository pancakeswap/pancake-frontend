import { MOONPAY_SIGN_URL, ONRAMP_API_BASE_URL } from 'config/constants/endpoints'

// will cleanup urls later
export async function fetchMoonpayAvailability(userIp: string): Promise<Response> {
  // Fetch data from endpoint 1
  const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-moonpay-availability?userIp=${userIp}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const result = response.json()
  return result
}

export async function fetchMercuryoAvailability(userIp: string): Promise<Response> {
  // Fetch data from endpoint 2
  const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-mercuryo-availability?userIp=${userIp}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const result = response.json()
  return result
}

// for bsc connect we need to fetch our own custom api endpoint as even get requests require
// sig validation
export async function fetchBinanceConnectAvailability(userIp: string): Promise<Response> {
  const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-bsc-availability?userIp=${userIp}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ clientUserIp: userIp }),
  })
  const result = response.json()
  return result
}

export async function fetchProviderAvailabilities(payload): Promise<{ [provider: string]: boolean }> {
  // Fetch data from endpoint 1
  const response = await fetch(`${MOONPAY_SIGN_URL}/fetch-provider-availability`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  return result.result
}
