import axios from 'axios'

export const getLOTTPriceInUSD = async () => {
  let price = 0
  try {
    const result = await axios('https://api.coingecko.com/api/v3/simple/price?ids=safemoon-2&vs_currencies=usd')
    // @ts-ignore
    price = result.data['safemoon-2'].usd
  } catch (error) {
    console.log(error)
  }
  return price
}
