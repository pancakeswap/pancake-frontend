import { CAKE } from '@pancakeswap/tokens'

// Addresses
import {
  getPancakeProfileAddress,
  getBunnyFactoryAddress,
  getLotteryV2Address,
  getMasterChefV2Address,
  getMasterChefV1Address,
  getPointCenterIfoAddress,
  getTradingCompetitionAddressEaster,
  getCakeVaultAddress,
  getFarmAuctionAddress,
  getAnniversaryAchievement,
  getNftMarketAddress,
  getNftSaleAddress,
  getPancakeSquadAddress,
  getTradingCompetitionAddressFanToken,
  getTradingCompetitionAddressMobox,
  getTradingCompetitionAddressMoD,
  getICakeAddress,
  getPotteryDrawAddress,
  getCakeFlexibleSideVaultAddress,
  getPredictionsV1Address,
  getBCakeFarmBoosterAddress,
  getBCakeFarmBoosterProxyFactoryAddress,
  getNonBscVaultAddress,
  getCrossFarmingSenderAddress,
  getCrossFarmingReceiverAddress,
  getStableSwapNativeHelperAddress,
  getTradingRewardAddress,
  getMasterChefV3Address,
  getV3MigratorAddress,
  getV3AirdropAddress,
} from 'utils/addressHelpers'

// ABI
import profileABI from 'config/abi/pancakeProfile.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import cakeAbi from 'config/abi/cake.json'
import ifoV1Abi from 'config/abi/ifoV1.json'
import ifoV2Abi from 'config/abi/ifoV2.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import masterChef from 'config/abi/masterchef.json'
import masterChefV1 from 'config/abi/masterchefV1.json'
import tradingCompetitionEasterAbi from 'config/abi/tradingCompetitionEaster.json'
import tradingCompetitionFanTokenAbi from 'config/abi/tradingCompetitionFanToken.json'
import tradingCompetitionMoboxAbi from 'config/abi/tradingCompetitionMobox.json'
import tradingCompetitionMoDAbi from 'config/abi/tradingCompetitionMoD.json'
import cakeVaultV2Abi from 'config/abi/cakeVaultV2.json'
import cakeFlexibleSideVaultV2Abi from 'config/abi/cakeFlexibleSideVaultV2.json'
import predictionsAbi from 'config/abi/predictions.json'
import predictionsV1Abi from 'config/abi/predictionsV1.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import farmAuctionAbi from 'config/abi/farmAuction.json'
import anniversaryAchievementAbi from 'config/abi/anniversaryAchievement.json'
import nftMarketAbi from 'config/abi/nftMarket.json'
import nftSaleAbi from 'config/abi/nftSale.json'
import pancakeSquadAbi from 'config/abi/pancakeSquad.json'
import erc721CollectionAbi from 'config/abi/erc721collection.json'
import potteryDrawAbi from 'config/abi/potteryDrawAbi.json'
import iCakeAbi from 'config/abi/iCake.json'
import ifoV3Abi from 'config/abi/ifoV3.json'
import cakePredictionsAbi from 'config/abi/cakePredictions.json'
import bCakeFarmBoosterAbi from 'config/abi/bCakeFarmBooster.json'
import bCakeFarmBoosterProxyFactoryAbi from 'config/abi/bCakeFarmBoosterProxyFactory.json'
import bCakeProxyAbi from 'config/abi/bCakeProxy.json'
import nonBscVault from 'config/abi/nonBscVault.json'
import crossFarmingSenderAbi from 'config/abi/crossFarmingSender.json'
import crossFarmingReceiverAbi from 'config/abi/crossFarmingReceiver.json'
import crossFarmingProxyAbi from 'config/abi/crossFarmingProxy.json'
import stableSwapNativeHelperAbi from 'config/abi/stableSwapNativeHelper.json'
import sid from 'config/abi/SID.json'
import uns from 'config/abi/UNS.json'
import sidResolver from 'config/abi/SIDResolver.json'
import tradingRewardABI from 'config/abi/tradingReward.json'
import masterChefV3Abi from 'config/abi/masterChefV3.json'
import v3MigratorAbi from 'config/abi/v3Migrator.json'
import V3AirdropAbi from 'config/abi/v3Airdrop.json'

import { ChainId } from '@pancakeswap/sdk'
import { Address, erc20ABI, erc721ABI, WalletClient } from 'wagmi'
import { GetContractArgs } from 'wagmi/actions'
import { getContract as getContract_ } from 'viem'
import { bunnyFactoryABI } from 'config/abi/bunnyFactory'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { v3AirdropABI } from 'config/abi/v3Airdrop'
import { Abi } from 'abitype'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { potteryVaultABI } from 'config/abi/potteryVaultAbi'
import { potteryDrawABI } from 'config/abi/potteryDrawAbi'
import { masterChefV3ABI } from 'config/abi/masterChefV3'
import { masterChefV2ABI } from 'config/abi/masterchef'
import { pancakeSquadABI } from 'config/abi/pancakeSquad'
import { nftMarketABI } from 'config/abi/nftMarket'
import { bCakeFarmBoosterABI } from 'config/abi/bCakeFarmBooster'
import { sidABI } from 'config/abi/SID'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { lotteryV2ABI } from 'config/abi/lotteryV2'
import { predictionsV2ABI } from 'config/abi/predictionsV2'
import { farmAuctionABI } from 'config/abi/farmAuction'

import { viemClients } from './viem'
import { SIDResolverABI } from 'config/abi/SIDResolver'

export const getContract = <TAbi extends Abi | unknown[]>({
  abi,
  address,
  chainId = ChainId.BSC,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: WalletClient
}) => {
  const c = getContract_({
    abi,
    address,
    publicClient: viemClients[chainId],
    walletClient: signer,
  })
  return {
    ...c,
    abi,
    address,
  }
}

export const getBep20Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: erc20ABI, address, signer })
}

export const getErc721Contract = (address: Address, walletClient?: WalletClient) => {
  return getContract_({
    abi: erc721ABI,
    address,
    walletClient,
  })
}
export const getLpContract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: lpTokenABI, address, signer, chainId })
}

export const getPointCenterIfoContract = (signer?: WalletClient) => {
  return getContract({ abi: pointCenterIfo, address: getPointCenterIfoAddress(), signer })
}
export const getCakeContract = (chainId?: number) => {
  return getContract({
    abi: erc20ABI,
    address: chainId ? CAKE[chainId].address : CAKE[ChainId.BSC].address,
    chainId,
  })
}

// TODO: wagmi
export const profileContractArgs = {
  abi: pancakeProfileABI,
  address: getPancakeProfileAddress(),
  chainId: ChainId.BSC,
} satisfies GetContractArgs

// TODO: wagmi
export const profileContract = getContract_(profileContractArgs)
export const getProfileContract = (signer?: WalletClient) => {
  return getContract({ abi: pancakeProfileABI, address: getPancakeProfileAddress(), signer })
}

export const getBunnyFactoryContract = (signer?: WalletClient) => {
  return getContract({ abi: bunnyFactoryAbi, address: getBunnyFactoryAddress(), signer })
}
export const getLotteryV2Contract = (signer?: WalletClient) => {
  return getContract({ abi: lotteryV2ABI, address: getLotteryV2Address(), signer })
}
export const getMasterchefV1Contract = (signer?: WalletClient) => {
  return getContract({ abi: masterChefV1, address: getMasterChefV1Address(), signer })
}

export const getTradingCompetitionContractEaster = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionEasterAbi,
    address: getTradingCompetitionAddressEaster(),
    signer,
  })
}

export const getTradingCompetitionContractFanToken = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionFanTokenAbi,
    address: getTradingCompetitionAddressFanToken(),
    signer,
  })
}
export const getTradingCompetitionContractMobox = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionMoboxAbi,
    address: getTradingCompetitionAddressMobox(),
    signer,
  })
}

export const getTradingCompetitionContractMoD = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionMoDAbi,
    address: getTradingCompetitionAddressMoD(),
    signer,
  })
}

export const getCakeVaultV2Contract = (signer?: WalletClient) => {
  return getContract({ abi: cakeVaultV2Abi, address: getCakeVaultAddress(), signer })
}

export const getCakeFlexibleSideVaultV2Contract = (signer?: WalletClient) => {
  return getContract({
    abi: cakeFlexibleSideVaultV2Abi,
    address: getCakeFlexibleSideVaultAddress(),
    signer,
  })
}

export const getPredictionsV2Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: predictionsV2ABI, address, signer })
}

export const getPredictionsV1Contract = (signer?: WalletClient) => {
  return getContract({ abi: predictionsV1Abi, address: getPredictionsV1Address(), signer })
}

export const getCakePredictionsContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: cakePredictionsAbi, address, signer })
}

export const getChainlinkOracleContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: chainlinkOracleABI, address, signer, chainId })
}

export const getFarmAuctionContract = (signer?: WalletClient) => {
  return getContract({ abi: farmAuctionABI, address: getFarmAuctionAddress(), signer })
}
export const getAnniversaryAchievementContract = (signer?: WalletClient) => {
  return getContract({
    abi: anniversaryAchievementAbi,
    address: getAnniversaryAchievement(),
    signer,
  })
}

export const getNftMarketContract = (signer?: WalletClient) => {
  return getContract({ abi: nftMarketABI, address: getNftMarketAddress(), signer })
}
export const getNftSaleContract = (signer?: WalletClient) => {
  return getContract({ abi: nftSaleAbi, address: getNftSaleAddress(), signer })
}
export const getPancakeSquadContract = (signer?: WalletClient) => {
  return getContract({ abi: pancakeSquadABI, address: getPancakeSquadAddress(), signer })
}
export const getErc721CollectionContract = (signer?: WalletClient, address?: Address) => {
  return getContract({ abi: erc721CollectionAbi, address, signer })
}

export const getPotteryVaultContract = (address: Address, walletClient?: WalletClient) => {
  return getContract_({ abi: potteryVaultABI, address, walletClient })
}

export const getPotteryDrawContract = (walletClient?: WalletClient) => {
  return getContract_({ abi: potteryDrawABI, address: getPotteryDrawAddress(), walletClient })
}

export const getIfoCreditAddressContract = (signer?: WalletClient) => {
  return getContract({ abi: iCakeAbi, address: getICakeAddress(), signer })
}

export const getBCakeFarmBoosterContract = (signer?: WalletClient) => {
  return getContract({ abi: bCakeFarmBoosterABI, address: getBCakeFarmBoosterAddress(), signer })
}

export const getBCakeFarmBoosterProxyFactoryContract = (signer?: WalletClient) => {
  return getContract({
    abi: bCakeFarmBoosterProxyFactoryAbi,
    address: getBCakeFarmBoosterProxyFactoryAddress(),
    signer,
  })
}

export const getBCakeProxyContract = (proxyContractAddress: Address, signer?: WalletClient) => {
  return getContract({ abi: bCakeProxyAbi, address: proxyContractAddress, signer })
}

export const getNonBscVaultContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: nonBscVault, address: getNonBscVaultAddress(chainId), chainId, signer })
}

export const getSidContract = (address: Address, chainId: number) => {
  return getContract({ abi: sidABI, address, chainId })
}

export const getUnsContract = (address: Address, chainId?: ChainId, signer?: WalletClient) => {
  return getContract({
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'addr',
            type: 'address',
          },
        ],
        name: 'reverseNameOf',
        outputs: [
          {
            internalType: 'string',
            name: 'reverseUri',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    chainId,
    address,
    signer,
  })
}

export const getSidResolverContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: SIDResolverABI, address, signer })
}

export const getCrossFarmingSenderContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingSenderAbi,
    address: getCrossFarmingSenderAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingReceiverContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingReceiverAbi,
    address: getCrossFarmingReceiverAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingProxyContract = (
  proxyContractAddress: Address,
  signer?: WalletClient,
  chainId?: number,
) => {
  return getContract({ abi: crossFarmingProxyAbi, address: proxyContractAddress, chainId, signer })
}

export const getStableSwapNativeHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stableSwapNativeHelperAbi,
    address: getStableSwapNativeHelperAddress(chainId),
    chainId,
    signer,
  })
}

export const getMasterChefContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: masterChefV2ABI,
    address: getMasterChefV2Address(chainId),
    chainId,
    signer,
  })
}
export const getMasterChefV3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: masterChefV3ABI,
    address: getMasterChefV3Address(chainId),
    chainId,
    signer,
  })
}

export const getV3MigratorContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: v3MigratorAbi,
    address: getV3MigratorAddress(chainId),
    chainId,
    signer,
  })
}

export const getTradingRewardContract = (chainId?: number, signer?: Signer | Provider) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardAddress(chainId),
    signer,
    chainId,
  }) as TradingReward
}

export const getV3AirdropContract = (signer?: WalletClient) => {
  return getContract({
    abi: v3AirdropABI,
    address: getV3AirdropAddress(),
    signer,
  })
}
