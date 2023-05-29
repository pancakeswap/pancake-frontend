import { getPoolContractBySousId } from '@pancakeswap/pools'

import { erc20ABI, useWalletClient, usePublicClient } from 'wagmi'
import { Address } from 'viem'
import { Abi } from 'abitype'

import addresses from 'config/constants/contracts'
import { useMemo } from 'react'
import { getMulticallAddress, getPredictionsV1Address, getZapAddress } from 'utils/addressHelpers'
import {
  getContract,
  getBCakeFarmBoosterContract,
  getBCakeFarmBoosterProxyFactoryContract,
  getBCakeProxyContract,
  getBunnyFactoryContract,
  getCakeFlexibleSideVaultV2Contract,
  getCakePredictionsContract,
  getCakeVaultV2Contract,
  getChainlinkOracleContract,
  getCrossFarmingProxyContract,
  getFarmAuctionContract,
  getIfoCreditAddressContract,
  getLotteryV2Contract,
  getMasterChefContract,
  getMasterchefV1Contract,
  getNftMarketContract,
  getNftSaleContract,
  getNonBscVaultContract,
  getPointCenterIfoContract,
  getPotteryDrawContract,
  getPotteryVaultContract,
  getPredictionsV2Contract,
  getPredictionsV1Contract,
  getProfileContract,
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
} from 'utils/contractHelpers'

import { WNATIVE, ChainId, pancakePairV2ABI } from '@pancakeswap/sdk'
import { nonfungiblePositionManagerABI } from '@pancakeswap/v3-sdk'
import { CAKE } from '@pancakeswap/tokens'
import { ifoV1ABI } from 'config/abi/ifoV1'
import { ifoV2ABI } from 'config/abi/ifoV2'
import { ifoV3ABI } from 'config/abi/ifoV3'
import { multicallABI } from 'config/abi/Multicall'
import { WBETH } from 'config/constants/liquidStaking'
import { VaultKey } from 'state/types'
import { wbethEthABI } from 'config/abi/wbethETH'
import { wbethBscABI } from 'config/abi/wbethBSC'
import { zapABI } from 'config/abi/zap'
import { erc20Bytes32ABI } from 'config/abi/erc20_bytes32'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { wethABI } from 'config/abi/weth'
import { erc721CollectionABI } from 'config/abi/erc721collection'
import { infoStableSwapABI } from 'config/abi/infoStableSwap'
/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: Address) => {
  return useContract(address, ifoV1ABI)
}

export const useIfoV2Contract = (address: Address) => {
  return useContract(address, ifoV2ABI)
}

export const useIfoV3Contract = (address: Address) => {
  return useContract(address, ifoV3ABI)
}

export const useERC20 = (address: Address) => {
  return useContract(address, erc20ABI)
}

export const useCake = () => {
  const { chainId } = useActiveChainId()

  return useContract(CAKE[chainId].address ?? CAKE[ChainId.BSC].address, erc20ABI)
}

export const useBunnyFactory = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBunnyFactoryContract(signer), [signer])
}

export const useProfileContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getProfileContract(signer), [signer])
}

export const useLotteryV2Contract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getLotteryV2Contract(signer), [signer])
}

export const useMasterchef = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterChefContract(signer, chainId), [signer, chainId])
}

export const useMasterchefV1 = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterchefV1Contract(signer), [signer])
}

export const useSousChef = (id) => {
  const { data: signer } = useWalletClient()
  const { chainId } = useActiveChainId()
  const publicClient = usePublicClient({ chainId })
  return useMemo(
    () =>
      getPoolContractBySousId({
        sousId: id,
        signer,
        chainId,
        publicClient,
      }),
    [id, signer, chainId, publicClient],
  )
}

export const usePointCenterIfoContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPointCenterIfoContract(signer), [signer])
}

export const useTradingCompetitionContractEaster = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractEaster(signer), [signer])
}

export const useTradingCompetitionContractFanToken = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractFanToken(signer), [signer])
}

export const useTradingCompetitionContractMobox = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractMobox(signer), [signer])
}

export const useTradingCompetitionContractMoD = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractMoD(signer), [signer])
}

export const useVaultPoolContract = <T extends VaultKey>(
  vaultKey: T,
):
  | (T extends VaultKey.CakeVault
      ? ReturnType<typeof getCakeVaultV2Contract>
      : ReturnType<typeof getCakeFlexibleSideVaultV2Contract>)
  | null => {
  const { data: signer } = useWalletClient()
  return useMemo(() => {
    if (vaultKey === VaultKey.CakeVault) {
      return getCakeVaultV2Contract(signer)
    }
    if (vaultKey === VaultKey.CakeFlexibleSideVault) {
      return getCakeFlexibleSideVaultV2Contract(signer)
    }
    return null
  }, [signer, vaultKey]) as any
}

export const useCakeVaultContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getCakeVaultV2Contract(signer), [signer])
}

export const useIfoCreditAddressContract = () => {
  return useMemo(() => getIfoCreditAddressContract(), [])
}

export const usePredictionsContract = (address: Address, tokenSymbol: string) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => {
    if (address === getPredictionsV1Address()) {
      return getPredictionsV1Contract(signer)
    }
    const getPredContract = tokenSymbol === 'CAKE' ? getCakePredictionsContract : getPredictionsV2Contract

    return getPredContract(address, signer)
  }, [address, tokenSymbol, signer])
}

export const useChainlinkOracleContract = (address) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getChainlinkOracleContract(address, signer), [signer, address])
}

export const useNftSaleContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftSaleContract(signer), [signer])
}

export const useFarmAuctionContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getFarmAuctionContract(signer), [signer])
}

export const useNftMarketContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftMarketContract(signer), [signer])
}

export const useErc721CollectionContract = (collectionAddress: Address) => {
  return useContract(collectionAddress, erc721CollectionABI)
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
) {
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      const c = getContract({
        abi,
        address,
        chainId,
        signer: walletClient,
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

export function useWNativeContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId ? WNATIVE[chainId]?.address : undefined, wethABI)
}

export function useWBETHContract() {
  const { chainId } = useActiveChainId()

  const abi = useMemo(
    () => ([ChainId.ETHEREUM, ChainId.GOERLI].includes(chainId) ? wbethEthABI : wbethBscABI),
    [chainId],
  )

  return useContract(chainId ? WBETH[chainId] : undefined, abi)
}

export function useBytes32TokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Bytes32ABI)
}

export function usePairContract(pairAddress?: Address) {
  return useContract(pairAddress, pancakePairV2ABI)
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

export function useZapContract() {
  const { chainId } = useActiveChainId()
  return useContract(getZapAddress(chainId), zapABI)
}

export function useBCakeFarmBoosterContract() {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBCakeFarmBoosterContract(signer), [signer])
}

export function useBCakeFarmBoosterProxyFactoryContract() {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBCakeFarmBoosterProxyFactoryContract(signer), [signer])
}

export function useBCakeProxyContract(proxyContractAddress: Address) {
  const { data: signer } = useWalletClient()
  return useMemo(
    () => proxyContractAddress && getBCakeProxyContract(proxyContractAddress, signer),
    [signer, proxyContractAddress],
  )
}

export const useNonBscVault = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNonBscVaultContract(signer, chainId), [signer, chainId])
}

export const useSIDContract = (address, chainId) => {
  return useMemo(() => getSidContract(address, chainId), [address, chainId])
}

export const useUNSContract = (address, chainId, provider) => {
  return useMemo(() => getUnsContract(address, chainId, provider), [chainId, address, provider])
}

export const useCrossFarmingProxy = (proxyContractAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => proxyContractAddress && getCrossFarmingProxyContract(proxyContractAddress, signer, chainId),
    [proxyContractAddress, signer, chainId],
  )
}

export const useStableSwapNativeHelperContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getStableSwapNativeHelperContract(signer, chainId), [signer, chainId])
}

export function useV3NFTPositionManagerContract() {
  return useContract(addresses.nftPositionManager, nonfungiblePositionManagerABI)
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

export const useTradingRewardContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingRewardContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useV3AirdropContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getV3AirdropContract(signer), [signer])
}

export const useInfoStableSwapContract = (infoAddress?: Address) => {
  return useContract(infoAddress, infoStableSwapABI)
}
