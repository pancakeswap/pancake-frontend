import { Contract, ethers, Overrides } from 'ethers'
import { useGasPrice } from 'state/user/hooks'

/**
 * Perform a contract call with a gas price returned from useGasPrice
 * @param contract Used to perform the call
 * @param methodName The name of the method called
 * @param methodArgs An array of arguments to pass to the method
 * @param overrides An overrides object to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export async function useCallWithGasPrice(
  contract: Contract,
  methodName: string,
  methodArgs: any[] = [],
  overrides: Overrides = null,
): Promise<ethers.providers.TransactionResponse> {
  const gasPrice = useGasPrice()

  const tx = await contract[methodName](...methodArgs, {
    ...overrides,
    gasPrice,
  })
  return tx
}
