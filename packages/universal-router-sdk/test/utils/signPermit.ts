import { PermitSingle } from '@pancakeswap/permit2-sdk'
import { type Address, type WalletClient } from 'viem'

export const signPermit = (permit: PermitSingle, wallet: WalletClient, permit2Address: Address) => {
  const chainId = wallet
}
