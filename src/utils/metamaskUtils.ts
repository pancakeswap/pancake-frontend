const registerToken = async (earningTokenAddress: string, tokenName: string, tokenDecimals: number, image: string) => {
  const tokenAdded = await (window as any).ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: earningTokenAddress,
        symbol: tokenName,
        decimals: tokenDecimals,
        image,
      },
    },
  })

  return tokenAdded
}

export default registerToken
