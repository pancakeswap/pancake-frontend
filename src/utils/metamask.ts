import { getAddress } from 'utils/addressHelpers'

const addTokenToMetaMask = async (tokenSymbol, tokenAddress, tokenDecimals, tokenImageUrl) => {
  const add = await (window as any).ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20', // Initially only supports ERC20, but eventually more!
      options: {
        address: getAddress(tokenAddress), // The address that the token is at.
        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
        decimals: tokenDecimals, // The number of decimals in the token
        image: tokenImageUrl,
      },
    },
  })

  return add
}

export default addTokenToMetaMask
