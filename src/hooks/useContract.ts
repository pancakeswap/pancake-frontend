import { useMemo } from 'react'
import useWeb3Provider from 'hooks/useWeb3Provider'
import {
  getBep20Contract,
  getCakeContract,
  getBunnyFactoryContract,
  getBunnySpecialContract,
  getPancakeRabbitContract,
  getProfileContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getMasterchefContract,
  getPointCenterIfoContract,
  getSouschefContract,
  getClaimRefundContract,
  getTradingCompetitionContract,
  getEasterNftContract,
  getErc721Contract,
  getCakeVaultContract,
  getPredictionsContract,
  getChainlinkOracleContract,
  getSouschefV2Contract,
  getLotteryV2Contract,
  getBunnySpecialCakeVaultContract,
  getBunnySpecialPredictionContract,
} from 'utils/contractHelpers'

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH } from '@pancakeswap/sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import ENS_PUBLIC_RESOLVER_ABI from '../config/abi/ens-public-resolver.json'
import ENS_ABI from '../config/abi/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../config/abi/erc20'
import ERC20_ABI from '../config/abi/erc20.json'
import WETH_ABI from '../config/abi/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../config/constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './Auth'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
  const provider = useWeb3Provider()
  return useMemo(() => getIfoV1Contract(address, provider.getSigner()), [address, provider])
}

export const useIfoV2Contract = (address: string) => {
  const provider = useWeb3Provider()
  return useMemo(() => getIfoV2Contract(address, provider.getSigner()), [address, provider])
}

export const useERC20 = (address: string) => {
  const provider = useWeb3Provider()
  return useMemo(() => getBep20Contract(address, provider.getSigner()), [address, provider])
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const provider = useWeb3Provider()
  return useMemo(() => getErc721Contract(address, provider.getSigner()), [address, provider])
}

export const useCake = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getCakeContract(provider.getSigner()), [provider])
}

export const useBunnyFactory = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getBunnyFactoryContract(provider.getSigner()), [provider])
}

export const usePancakeRabbits = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getPancakeRabbitContract(provider.getSigner()), [provider])
}

export const useProfile = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getProfileContract(provider.getSigner()), [provider])
}

export const useLotteryV2Contract = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getLotteryV2Contract(provider.getSigner()), [provider])
}

export const useMasterchef = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getMasterchefContract(provider.getSigner()), [provider])
}

export const useSousChef = (id) => {
  const provider = useWeb3Provider()
  return useMemo(() => getSouschefContract(id, provider.getSigner()), [id, provider])
}

export const useSousChefV2 = (id) => {
  const provider = useWeb3Provider()
  return useMemo(() => getSouschefV2Contract(id, provider.getSigner()), [id, provider])
}

export const usePointCenterIfoContract = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getPointCenterIfoContract(provider.getSigner()), [provider])
}

export const useBunnySpecialContract = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getBunnySpecialContract(provider.getSigner()), [provider])
}

export const useClaimRefundContract = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getClaimRefundContract(provider.getSigner()), [provider])
}

export const useTradingCompetitionContract = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getTradingCompetitionContract(provider.getSigner()), [provider])
}

export const useEasterNftContract = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getEasterNftContract(provider.getSigner()), [provider])
}

export const useCakeVaultContract = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getCakeVaultContract(provider.getSigner()), [provider])
}

export const usePredictionsContract = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getPredictionsContract(provider.getSigner()), [provider])
}

export const useChainlinkOracleContract = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getChainlinkOracleContract(provider.getSigner()), [provider])
}

export const useSpecialBunnyCakeVaultContract = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getBunnySpecialCakeVaultContract(provider.getSigner()), [provider])
}

export const useSpecialBunnyPredictionContract = () => {
  const provider = useWeb3Provider()
  return useMemo(() => getBunnySpecialPredictionContract(provider.getSigner()), [provider])
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
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
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}
