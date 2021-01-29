import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new JsonRpcProvider(RPC_URL)
/**
 * Provides a web3 instance using our own private provider httpProver
 */
const getContract = (abi: any, address: string) => {
  return new Contract(address, abi, httpProvider)
}

export { getContract, httpProvider }
