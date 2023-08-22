import { getViemClients } from 'utils/viem'
import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { tokenAplABI } from 'config/abi/tokenApl'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'

// Contract will return price with 10^8, although ALP token decimals is 18.
const TOKEN_DECIMALS = 8
const CONTRACT_ADDRESS = '0xB3879E95a4B8e3eE570c232B19d520821F540E48'

const fetchTokenAplPrice = async () => {
  const client = getViemClients({ chainId: ChainId.ARBITRUM_ONE })
  const [alpPrice] = await client.multicall({
    contracts: [
      {
        abi: tokenAplABI,
        address: CONTRACT_ADDRESS,
        functionName: 'alpPrice',
      },
    ],
    allowFailure: false,
  })

  const alpUsdPrice = getBalanceAmount(new BigNumber(alpPrice.toString()), TOKEN_DECIMALS).toNumber()
  return alpUsdPrice ?? 0
}

export default fetchTokenAplPrice
