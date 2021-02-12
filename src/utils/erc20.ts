import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Web3Provider, JsonRpcSigner, JsonRpcProvider } from '@ethersproject/providers'
import erc20 from 'config/abi/erc20.json'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
export const httpProvider = new JsonRpcProvider(RPC_URL)
// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

export function getContract(address: string, ABI: any, library?: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  if (library && account) return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
  return new Contract(address, ABI, getProviderOrSigner(window.library, window.account) as any)
}

export const getAllowance = async (
  lpContract: Contract,
  masterChefContract: Contract,
  account: string,
): Promise<string> => {
  try {
    const allowance: string = await lpContract.allowance(account, masterChefContract.address)
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getTokenBalance = async (
  provider: Web3Provider,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const contract = getContract(tokenAddress, erc20, provider)
  try {
    const balance: string = await contract.balanceOf(userAddress)
    return balance
  } catch (e) {
    return '0'
  }
}
