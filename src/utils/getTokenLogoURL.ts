const getTokenLogoURL = (address: string) =>
  address.toLowerCase() === '0x5625eb03D999817941BaD868BbF8A0eaf0749557'.toLowerCase()
    ? `https://tianguis.finance/images/tokens/${address}.png`
    : `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`

/*  */

export default getTokenLogoURL
