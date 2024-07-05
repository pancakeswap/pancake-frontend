import { ChainId } from '@pancakeswap/chains'
import { PCS_ACCOUNT_IN_ZYFI_VAULT, ZYFI_VAULT } from 'config/paymaster'
import { formatUnits, parseAbi } from 'viem'
import { getViemClients } from './viem'

export const getGasSponsorship = async (): Promise<{
  balance: bigint
  formattedBalance: string
  isEnoughGasBalance: boolean
}> => {
  try {
    const client = getViemClients({ chainId: ChainId.ZKSYNC })

    // ETH Balance
    const balance = await client.readContract({
      abi: parseAbi(['function balances(address vault) view returns (uint256)']),
      address: ZYFI_VAULT,
      args: [PCS_ACCOUNT_IN_ZYFI_VAULT],
      functionName: 'balances',
    })

    const formattedBalance = formatUnits(balance, 18)

    const isEnoughGasBalance = +formattedBalance > 0.025 // balance is greater than 0.025 ETH (~$70 at the moment)

    return { balance, formattedBalance, isEnoughGasBalance }
  } catch (e) {
    console.error('Unable to fetch Gas Sponsorship Balance', e)
    return { balance: 0n, formattedBalance: '0', isEnoughGasBalance: false }
  }
}
