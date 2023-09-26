import { createPublicClient, http } from 'viem'
import { bscTestnet, goerli } from 'viem/chains'
import Permit2Abi from '../../abis/Permit2.json'
import { PERMIT2_ADDRESS } from '../constants'

export type viemAddress = `0x${string}`

const goerliTestnetClient = createPublicClient({
  chain: goerli,
  transport: http('https://goerli.infura.io/v3/3f4ad76a6b444342bde910d098ff8a4e'),
})

const bscTestnetClient = createPublicClient({
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/'),
})

const getProvider = (chainId: number) => {
  switch(chainId) {
    case 5:
      return goerliTestnetClient
    case 97:
      return bscTestnetClient
    default:
      return goerliTestnetClient
  }
}

export interface AllowanceData {
  amount: any
  nonce: number
  expiration: number
}

export class AllowanceProvider {
  private permit2: any

  constructor(chainId: number) {
    this.permit2 = getProvider(chainId)
  }

  async getAllowanceData(token: string, owner: string, spender: string): Promise<any> {
    const allowanceData =  await this.permit2.readContract({
      address: PERMIT2_ADDRESS as viemAddress,
      abi: Permit2Abi,
      functionName: 'allowance',
      args: [owner, token, spender]
    })
    return allowanceData
  }

  // async getAllowance(token: string, owner: string, spender: string): Promise<BigNumber> {
  //   return (await this.getAllowanceData(token, owner, spender)).amount
  // }

  // async getNonce(token: string, owner: string, spender: string): Promise<number> {
  //   return (await this.getAllowanceData(token, owner, spender)).nonce
  // }

  // async getExpiration(token: string, owner: string, spender: string): Promise<number> {
  //   return (await this.getAllowanceData(token, owner, spender)).expiration
  // }
}
