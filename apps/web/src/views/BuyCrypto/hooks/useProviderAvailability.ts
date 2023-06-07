// will cleanup urls later
export async function fetchMoonpayAvailability(userIp: string): Promise<Response> {
  // Fetch data from endpoint 1
  const response = await fetch(
    `https://api.moonpay.com/v4/ip_address?apiKey=pk_test_1Ibe44lMglFVL8COOYO7SEKnIBrzrp54&ipAddress=${userIp}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
  return response
}

export async function fetchMercuryoAvailability(userIp: string): Promise<Response> {
  // Fetch data from endpoint 2
  const response = await fetch(`https://api.mercuryo.io/v1.6/public/data-by-ip?ip=${userIp}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response
}

// for bsc connect we need to fetch our own custom api endpoint as even get requests require
// sig validation
export async function fetchBinanceConnectAvailability(userIp: string): Promise<Response> {
  const response = await fetch('/api/onramp-url-sign/fetch-bsc-connect-availability', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ clientUserIp: userIp }),
  })
  return response
}
