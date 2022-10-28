import { getAddress } from '@ethersproject/address'
import memoize from 'lodash/memoize'
import { ChainId, Token } from '@pancakeswap/sdk'

const mapping = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.ETHEREUM]: 'ethereum',
}

const getTokenLogoURL = memoize(
  async (token?: Token) => {
    if (token && mapping[token.chainId]) {
      let logoUrl = ''
      const checksumAddress = getAddress(token.address)
      const trustWalletUrl = `https://assets-cdn.trustwallet.com/blockchains/${
        mapping[token.chainId]
      }/assets/${checksumAddress}/logo.png`
      logoUrl = await tryLogo(trustWalletUrl)
      if (logoUrl === '') logoUrl = `https://tokens.pancakeswap.finance/images/${checksumAddress}.png`
      return logoUrl
    }
    return null
  },
  (t) => `${t.chainId}#${t.address}`,
)

const tryLogo = async (ImageSrc: string) => {
  try {
    return (await imageDecodeAsync(ImageSrc)).src
  } catch {
    return ''
  }
}

export async function imageDecodeAsync(src: string) {
  const image = new Image()
  image.src = src

  if (image.decode) {
    await image.decode()
    return image
  }

  // jest enter this block
  return new Promise<typeof image>((resolve, reject) => {
    image.onload = () => resolve(image)
    image.onerror = reject
  })
}

export default getTokenLogoURL
