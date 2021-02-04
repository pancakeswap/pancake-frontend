import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import getRpcUrl from 'utils/getRpcUrl'
import { getProviderOrSigner } from './erc20'

const RPC_URL = getRpcUrl()
const httpProvider = new JsonRpcProvider(RPC_URL)
/**
 * Provides a web3 instance using our own private provider httpProver
 */
const getContract = (abi: any, address: string) => {
  return new Contract(address, abi, getProviderOrSigner(window.library, window.account))
}

export { getContract, httpProvider }
