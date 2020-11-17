import { useRef } from 'react'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import useWeb3 from 'hooks/useWeb3'
import ifo from 'sushi/lib/abi/ifo.json'

const useContract = (abi: AbiItem, address: string, contractOptions?: ContractOptions) => {
  const web3 = useWeb3()

  // Memoize the instance so hooks can safely use the web3 instance as a dependency
  const { current: contract } = useRef(new web3.eth.Contract(abi, address, contractOptions))

  return contract
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  const ifoAbi = (ifo as unknown) as AbiItem
  const contract = useContract(ifoAbi, address)
  return contract
}

export default useContract
