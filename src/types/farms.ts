import { Contract } from 'web3-eth-contract'

export interface Farm {
  pid: number
  name: string
  lpSymbol: string
  lpAddress: string
  lpContract: Contract
  tokenAddress: string
  earnToken: string
  earnTokenAddress: string
  tokenSymbol: string
  multiplier: string
}
