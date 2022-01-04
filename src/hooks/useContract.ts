import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  getBep20Contract,
  getCakeContract,
  getBunnyFactoryContract,
  
  
  
  getMasterchefContract,

  getSouschefContract,
  getClaimRefundContract,
  
  getErc721Contract,
  
  
  getChainlinkOracleContract,
  getSouschefV2Contract,
  
  
  
  getErc721CollectionContract,
  
} from 'utils/contractHelpers'
import { getMulticallAddress } from 'utils/addressHelpers'
import { VaultKey } from 'state/types'

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH } from '@pancakeswap/sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import ENS_PUBLIC_RESOLVER_ABI from '../config/abi/ens-public-resolver.json'
import ENS_ABI from '../config/abi/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../config/abi/erc20'
import ERC20_ABI from '../config/abi/erc20.json'
import WETH_ABI from '../config/abi/weth.json'
import multiCallAbi from '../config/abi/Multicall.json'
import { getContract, getProviderOrSigner } from '../utils'

/**
 * Helper hooks to get specific contracts (by ABI)
 */


export const useERC20 = (address: string, withSignerIfPossible = true) => {
  const { library, account } = useActiveWeb3React()
  return useMemo(
    () => getBep20Contract(address, withSignerIfPossible ? getProviderOrSigner(library, account) : null),
    [account, address, library, withSignerIfPossible],
  )
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getErc721Contract(address, library.getSigner()), [address, library])
}

export const useCake = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getCakeContract(library.getSigner()), [library])
}

export const useBunnyFactory = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBunnyFactoryContract(library.getSigner()), [library])
}

export const useMasterchef = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getMasterchefContract(library.getSigner()), [library])
}

export const useSousChef = (id) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getSouschefContract(id, library.getSigner()), [id, library])
}

export const useSousChefV2 = (id) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getSouschefV2Contract(id, library.getSigner()), [id, library])
}



export const useClaimRefundContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getClaimRefundContract(library.getSigner()), [library])
}




export const useChainlinkOracleContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getChainlinkOracleContract(library.getSigner()), [library])
}



export const useErc721CollectionContract = (collectionAddress: string, withSignerIfPossible = true) => {
  const { library, account } = useActiveWeb3React()
  return useMemo(() => {
    return getErc721CollectionContract(
      withSignerIfPossible ? getProviderOrSigner(library, account) : null,
      collectionAddress,
    )
  }, [account, library, collectionAddress, withSignerIfPossible])
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, withSignerIfPossible ? getProviderOrSigner(library, account) : null)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    // eslint-disable-next-line default-case
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.TESTNET:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  return useContract(getMulticallAddress(), multiCallAbi, false)
}
