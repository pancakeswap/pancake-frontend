import { getPoolContractBySousId } from '@pancakeswap/pools'
import {
  Cake,
  CakeFlexibleSideVaultV2,
  CakeVaultV2,
  Erc20,
  Erc20Bytes32,
  Erc721collection,
  Multicall,
  Weth,
  Zap,
  IPancakePair,
} from 'config/abi/types'
import QuoterV2Abi from 'config/abi/QuoterV2.json'
import { erc20ABI, erc721ABI, useWalletClient, useContractWrite, useContractRead } from 'wagmi'
import { getContract as getContract__ } from 'wagmi/actions'
import { Address } from 'viem'
import { Abi } from 'abitype'

import zapAbi from 'config/abi/zap.json'
import NFTPositionManagerABI from 'config/abi/nftPositionManager.json'
import addresses from 'config/constants/contracts'
import { useProviderOrSigner } from 'hooks/useProviderOrSigner'
import { useMemo } from 'react'
import { getAddressFromMap, getMulticallAddress, getPredictionsV1Address, getZapAddress } from 'utils/addressHelpers'
import {
  getAnniversaryAchievementContract,
  getBCakeFarmBoosterContract,
  getBCakeFarmBoosterProxyFactoryContract,
  getBCakeProxyContract,
  getBep20Contract,
  getBunnyFactoryContract,
  getCakeContract,
  getCakeFlexibleSideVaultV2Contract,
  getCakePredictionsContract,
  getCakeVaultV2Contract,
  getChainlinkOracleContract,
  getCrossFarmingProxyContract,
  getErc721CollectionContract,
  getErc721Contract,
  getFarmAuctionContract,
  getIfoCreditAddressContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getIfoV3Contract,
  getLotteryV2Contract,
  getMasterChefContract,
  getMasterchefV1Contract,
  getNftMarketContract,
  getNftSaleContract,
  getNonBscVaultContract,
  getPointCenterIfoContract,
  getPotteryDrawContract,
  getPotteryVaultContract,
  getPredictionsContract,
  getPredictionsV1Contract,
  profileContract,
  getTradingCompetitionContractEaster,
  getTradingCompetitionContractFanToken,
  getTradingCompetitionContractMobox,
  getTradingCompetitionContractMoD,
  getStableSwapNativeHelperContract,
  getSidContract,
  getTradingRewardContract,
  getV3MigratorContract,
  getMasterChefV3Contract,
  getV3AirdropContract,
  getUnsContract,
  profileContractArgs,
} from 'utils/contractHelpers'

// Imports below migrated from Exchange useContract.ts
import { Contract } from 'ethers'
import { WNATIVE, ChainId } from '@pancakeswap/sdk'
import { ERC20_BYTES32_ABI } from 'config/abi/erc20'
import ERC20_ABI from 'config/abi/erc20.json'
import IPancakePairABI from 'config/abi/IPancakePair.json'
import multiCallAbi from 'config/abi/Multicall.json'
import WETH_ABI from 'config/abi/weth.json'
import WBETH_BSC_ABI from 'config/abi/wbethBSC.json'
import WBETH_ETH_ABI from 'config/abi/wbethETH.json'
import { getContract } from 'utils'
import { viemClients } from 'utils/viem'
import { ifoV1ABI } from 'config/abi/ifoV1'
import { ifoV2ABI } from 'config/abi/ifoV2'
import { ifoV3ABI } from 'config/abi/ifoV3'
import { CAKE } from '@pancakeswap/tokens'
import { multicallABI } from 'config/abi/Multicall'

import { WBETH } from 'config/constants/liquidStaking'
import { VaultKey } from 'state/types'
import { useActiveChainId } from './useActiveChainId'
import { nftPositionManagerABI } from 'config/abi/nftPositionManager'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: Address) => {
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()
  return useMemo(
    () =>
      getContract__({
        abi: ifoV1ABI,
        chainId,
        address,
        walletClient,
      }),
    [address, chainId, walletClient],
  )
}

export const useIfoV2Contract = (address: Address) => {
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()
  return useMemo(
    () =>
      getContract__({
        chainId,
        abi: ifoV2ABI,
        address,
        walletClient,
      }),
    [address, chainId, walletClient],
  )
}

export const useIfoV3Contract = (address: Address) => {
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()
  return useMemo(
    () =>
      getContract__({
        chainId,
        abi: ifoV3ABI,
        address,
        walletClient,
      }),
    [address, chainId, walletClient],
  )
}

export const useERC20 = (address: Address) => {
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()
  return useMemo(
    () =>
      getContract__({
        chainId,
        abi: erc20ABI,
        address,
        walletClient,
      }),
    [address, chainId, walletClient],
  )
}

export const useCake = () => {
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()

  return useMemo(
    () =>
      getContract__({
        chainId,
        abi: erc20ABI,
        address: CAKE[chainId].address ?? CAKE[ChainId.BSC].address,
        walletClient,
      }),
    [chainId, walletClient],
  )
}

export const useBunnyFactory = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBunnyFactoryContract(signer), [signer])
}

export const useProfileContract = (withSignerIfPossible = true) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getProfileContract(signer), [providerOrSigner])
}

export const useLotteryV2Contract = () => {
  const providerOrSigner = useProviderOrSigner(true, true)
  return useMemo(() => getLotteryV2Contract(providerOrSigner), [providerOrSigner])
}

export const useMasterchef = (withSignerIfPossible = true) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterchefContract(signer, chainId), [signer, chainId])
}

export const useMasterchefV1 = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterchefV1Contract(signer), [signer])
}

export const useSousChef = (id) => {
  const { data: signer } = useWalletClient()
  const { chainId } = useActiveChainId()
  return useMemo(() => getPoolContractBySousId({ sousId: id, provider: signer, chainId }), [id, signer, chainId])
}

export const usePointCenterIfoContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPointCenterIfoContract(signer), [signer])
}

export const useTradingCompetitionContractEaster = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible, true)
  return useMemo(() => getTradingCompetitionContractEaster(providerOrSigner), [providerOrSigner])
}

export const useTradingCompetitionContractFanToken = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible, true)
  return useMemo(() => getTradingCompetitionContractFanToken(providerOrSigner), [providerOrSigner])
}

export const useTradingCompetitionContractMobox = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible, true)
  return useMemo(() => getTradingCompetitionContractMobox(providerOrSigner), [providerOrSigner])
}

export const useTradingCompetitionContractMoD = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible, true)
  return useMemo(() => getTradingCompetitionContractMoD(providerOrSigner), [providerOrSigner])
}

export const useVaultPoolContract = (vaultKey: VaultKey): CakeVaultV2 | CakeFlexibleSideVaultV2 => {
  const { data: signer } = useWalletClient()
  return useMemo(() => {
    if (vaultKey === VaultKey.CakeVault) {
      return getCakeVaultV2Contract(signer)
    }
    if (vaultKey === VaultKey.CakeFlexibleSideVault) {
      return getCakeFlexibleSideVaultV2Contract(signer)
    }
    return null
  }, [signer, vaultKey])
}

export const useCakeVaultContract = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getCakeVaultV2Contract(providerOrSigner), [providerOrSigner])
}

export const useIfoCreditAddressContract = () => {
  return useMemo(() => getIfoCreditAddressContract(), [])
}

export const usePredictionsContract = (address: string, tokenSymbol: string) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => {
    if (address === getPredictionsV1Address()) {
      return getPredictionsV1Contract(signer)
    }
    const getPredContract = tokenSymbol === 'CAKE' ? getCakePredictionsContract : getPredictionsContract

    return getPredContract(address, signer)
  }, [address, tokenSymbol, signer])
}

export const useChainlinkOracleContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible, true)
  return useMemo(() => getChainlinkOracleContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useAnniversaryAchievementContract = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible, true)
  return useMemo(() => getAnniversaryAchievementContract(providerOrSigner), [providerOrSigner])
}

export const useNftSaleContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftSaleContract(signer), [signer])
}

export const useFarmAuctionContract = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible, true)
  return useMemo(() => getFarmAuctionContract(providerOrSigner), [providerOrSigner])
}

export const useNftMarketContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftMarketContract(signer), [signer])
}

export const useErc721CollectionContract = (
  collectionAddress: string,
): { reader: Erc721collection; signer: Erc721collection } => {
  const { data: signer } = useWalletClient()
  return useMemo(
    () => ({
      reader: getErc721CollectionContract(null, collectionAddress),
      signer: getErc721CollectionContract(signer, collectionAddress),
    }),
    [signer, collectionAddress],
  )
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
export function useContract<TAbi extends Abi>(
  addressOrAddressMap: Address | { [chainId: number]: Address } | undefined,
  abi: TAbi,
) {
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()
  // const providerOrSigner = useProviderOrSigner(withSignerIfPossible)

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      const c = getContract__({
        abi,
        address,
        chainId,
        walletClient,
      })
      return {
        ...c,
        abi,
        address,
      }
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20ABI)
}

export function useGetTokenContract(tokenAddress?: Address, withSignerIfPossible?: boolean) {
  const { chainId } = useActiveChainId()
  const publicClient = viemClients[chainId as ChainId]
  const { data: walletClient } = useWalletClient({ chainId })

  return useMemo(() => {
    return getContract__({
      address: tokenAddress,
      abi: erc20ABI,
      walletClient,
    })
  }, [tokenAddress, walletClient])
}

export function useWNativeContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveChainId()
  return useContract<Weth>(chainId ? WNATIVE[chainId]?.address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useWBETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveChainId()

  const abi = useMemo(
    () => ([ChainId.ETHEREUM, ChainId.GOERLI].includes(chainId) ? WBETH_ETH_ABI : WBETH_BSC_ABI),
    [chainId],
  )

  return useContract<Weth>(chainId ? WBETH[chainId] : undefined, abi, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract<Erc20Bytes32>(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): IPancakePair | null {
  return useContract(pairAddress, IPancakePairABI, withSignerIfPossible)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}

export const usePotterytVaultContract = (address: Address) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPotteryVaultContract(address, signer), [address, signer])
}

export const usePotterytDrawContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPotteryDrawContract(signer), [signer])
}

export function useZapContract(withSignerIfPossible = true) {
  const { chainId } = useActiveChainId()
  return useContract<Zap>(getZapAddress(chainId), zapAbi, withSignerIfPossible)
}

export function useBCakeFarmBoosterContract(withSignerIfPossible = true) {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible, true)
  return useMemo(() => getBCakeFarmBoosterContract(providerOrSigner), [providerOrSigner])
}

export function useBCakeFarmBoosterProxyFactoryContract(withSignerIfPossible = true) {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible, true)
  return useMemo(() => getBCakeFarmBoosterProxyFactoryContract(providerOrSigner), [providerOrSigner])
}

export function useBCakeProxyContract(proxyContractAddress: string, withSignerIfPossible = true) {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible, true)
  return useMemo(
    () => proxyContractAddress && getBCakeProxyContract(proxyContractAddress, providerOrSigner),
    [providerOrSigner, proxyContractAddress],
  )
}

export const useNonBscVault = (withSignerIfPossible = true) => {
  const { chainId } = useActiveChainId()
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getNonBscVaultContract(providerOrSigner, chainId), [providerOrSigner, chainId])
}

export const useSIDContract = (address, chainId) => {
  return useMemo(() => getSidContract(address, chainId), [address, chainId])
}

export const useUNSContract = (address, chainId, provider) => {
  return useMemo(() => getUnsContract(address, chainId, provider), [chainId, address, provider])
}

export const useCrossFarmingProxy = (proxyContractAddress: string, withSignerIfPossible = true) => {
  const { chainId } = useActiveChainId()
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(
    () => proxyContractAddress && getCrossFarmingProxyContract(proxyContractAddress, providerOrSigner, chainId),
    [proxyContractAddress, providerOrSigner, chainId],
  )
}

export const useStableSwapNativeHelperContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getStableSwapNativeHelperContract(signer, chainId), [signer, chainId])
}

export const useQuoterV2Contract = () => {
  return useContract(addresses.quoter, QuoterV2Abi)
}

export function useV3NFTPositionManagerContract() {
  return useContract(addresses.nftPositionManager, nftPositionManagerABI)
}

export function useMasterchefV3() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterChefV3Contract(signer, chainId), [chainId, signer])
}

export function useV3MigratorContract() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getV3MigratorContract(signer, chainId), [chainId, signer])
}

export const useTradingRewardContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useSigner()
  return useMemo(() => getTradingRewardContract(chainId, signer), [signer, chainId])
}

export const useV3AirdropContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getV3AirdropContract(signer), [signer])
}
