import { CAKE } from '@pancakeswap/tokens'

// Addresses
import {
  getAffiliateProgramAddress,
  getAnniversaryAchievementAddress,
  getBCakeFarmBoosterAddress,
  getBCakeFarmBoosterProxyFactoryAddress,
  getBCakeFarmBoosterV3Address,
  getBCakeFarmBoosterVeCakeAddress,
  getBunnyFactoryAddress,
  getCakeFlexibleSideVaultAddress,
  getCakeVaultAddress,
  getCalcGaugesVotingAddress,
  getCrossFarmingReceiverAddress,
  getCrossFarmingSenderAddress,
  getFarmAuctionAddress,
  getFixedStakingAddress,
  getGaugesVotingAddress,
  getLotteryV2Address,
  getMasterChefV2Address,
  getMasterChefV3Address,
  getNftMarketAddress,
  getNftSaleAddress,
  getNonBscVaultAddress,
  getPancakeProfileAddress,
  getPancakeSquadAddress,
  getPointCenterIfoAddress,
  getPotteryDrawAddress,
  getPredictionsV1Address,
  getRevenueSharingCakePoolAddress,
  getRevenueSharingPoolAddress,
  getRevenueSharingPoolGatewayAddress,
  getRevenueSharingVeCakeAddress,
  getStableSwapNativeHelperAddress,
  getTradingCompetitionAddressEaster,
  getTradingCompetitionAddressFanToken,
  getTradingCompetitionAddressMoD,
  getTradingCompetitionAddressMobox,
  getTradingRewardAddress,
  getTradingRewardTopTradesAddress,
  getV3AirdropAddress,
  getV3MigratorAddress,
  getVCakeAddress,
  getVeCakeAddress,
} from 'utils/addressHelpers'

// ABI
import { predictionsV1ABI, predictionsV2ABI, predictionsV3ABI } from '@pancakeswap/prediction'
import { crossFarmingProxyABI } from 'config/abi/crossFarmingProxy'
import { crossFarmingSenderABI } from 'config/abi/crossFarmingSender'
import { nftSaleABI } from 'config/abi/nftSale'
import { nonBscVaultABI } from 'config/abi/nonBscVault'
import { pointCenterIfoABI } from 'config/abi/pointCenterIfo'
import { stableSwapNativeHelperABI } from 'config/abi/stableSwapNativeHelper'

import { ChainId } from '@pancakeswap/chains'
import { bCakeFarmBoosterV3ABI } from '@pancakeswap/farms/constants/v3/abi/bCakeFarmBoosterV3'
import { bCakeFarmBoosterVeCakeABI } from '@pancakeswap/farms/constants/v3/abi/bCakeFarmBoosterVeCake'
import { bCakeFarmWrapperBoosterVeCakeABI } from '@pancakeswap/farms/constants/v3/abi/bCakeFarmWrapperBoosterVeCake'
import { calcGaugesVotingABI, gaugesVotingABI } from '@pancakeswap/gauges'
import { getIfoCreditAddressContract as getIfoCreditAddressContract_ } from '@pancakeswap/ifos'
import { cakeFlexibleSideVaultV2ABI, cakeVaultV2ABI } from '@pancakeswap/pools'
import {
  positionManagerAdapterABI,
  positionManagerVeBCakeWrapperABI,
  positionManagerWrapperABI,
} from '@pancakeswap/position-managers'
import { masterChefV3ABI } from '@pancakeswap/v3-sdk'
import { sidABI } from 'config/abi/SID'
import { SIDResolverABI } from 'config/abi/SIDResolver'
import { affiliateProgramABI } from 'config/abi/affiliateProgram'
import { anniversaryAchievementABI } from 'config/abi/anniversaryAchievement'
import { bCakeFarmBoosterABI } from 'config/abi/bCakeFarmBooster'
import { bCakeFarmBoosterProxyFactoryABI } from 'config/abi/bCakeFarmBoosterProxyFactory'
import { bCakeProxyABI } from 'config/abi/bCakeProxy'
import { bunnyFactoryABI } from 'config/abi/bunnyFactory'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { crossFarmingReceiverABI } from 'config/abi/crossFarmingReceiver'
import { farmAuctionABI } from 'config/abi/farmAuction'
import { fixedStakingABI } from 'config/abi/fixedStaking'
import { lotteryV2ABI } from 'config/abi/lotteryV2'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { nftMarketABI } from 'config/abi/nftMarket'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { pancakeSquadABI } from 'config/abi/pancakeSquad'
import { potteryDrawABI } from 'config/abi/potteryDrawAbi'
import { potteryVaultABI } from 'config/abi/potteryVaultAbi'
import { revenueSharingPoolABI } from 'config/abi/revenueSharingPool'
import { revenueSharingPoolGatewayABI } from 'config/abi/revenueSharingPoolGateway'
import { revenueSharingPoolProxyABI } from 'config/abi/revenueSharingPoolProxy'
import { tradingCompetitionEasterABI } from 'config/abi/tradingCompetitionEaster'
import { tradingCompetitionFanTokenABI } from 'config/abi/tradingCompetitionFanToken'
import { tradingCompetitionMoDABI } from 'config/abi/tradingCompetitionMoD'
import { tradingCompetitionMoboxABI } from 'config/abi/tradingCompetitionMobox'
import { tradingRewardABI } from 'config/abi/tradingReward'
import { v2BCakeWrapperABI } from 'config/abi/v2BCakeWrapper'
import { v3AirdropABI } from 'config/abi/v3Airdrop'
import { v3MigratorABI } from 'config/abi/v3Migrator'
import { vCakeABI } from 'config/abi/vCake'
import { veCakeABI } from 'config/abi/veCake'
import { getViemClients, viemClients } from 'utils/viem'
import { Abi, PublicClient, WalletClient, getContract as viemGetContract } from 'viem'
import { Address, erc20ABI, erc721ABI } from 'wagmi'

export const getContract = <TAbi extends Abi | unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BSC,
  publicClient,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    // TODO: Fix viem
    // @ts-ignore
    publicClient: publicClient ?? viemClients[chainId],
    // TODO: Fix viem
    // @ts-ignore
    walletClient: signer,
  })
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getBep20Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: erc20ABI, address, signer })
}

export const getErc721Contract = (address: Address, walletClient?: WalletClient) => {
  return getContract({
    abi: erc721ABI,
    address,
    signer: walletClient,
  })
}
export const getLpContract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: lpTokenABI, address, signer, chainId })
}

export const getPointCenterIfoContract = (signer?: WalletClient) => {
  return getContract({ abi: pointCenterIfoABI, address: getPointCenterIfoAddress(), signer })
}
export const getCakeContract = (chainId?: number) => {
  return getContract({
    abi: erc20ABI,
    address: chainId ? CAKE[chainId]?.address : CAKE[ChainId.BSC].address,
    chainId,
  })
}

export const getProfileContract = (signer?: WalletClient) => {
  return getContract({ abi: pancakeProfileABI, address: getPancakeProfileAddress(), signer })
}

export const getBunnyFactoryContract = (signer?: WalletClient) => {
  return getContract({ abi: bunnyFactoryABI, address: getBunnyFactoryAddress(), signer })
}
export const getLotteryV2Contract = (signer?: WalletClient) => {
  return getContract({ abi: lotteryV2ABI, address: getLotteryV2Address(), signer })
}

export const getTradingCompetitionContractEaster = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionEasterABI,
    address: getTradingCompetitionAddressEaster(),
    signer,
  })
}

export const getTradingCompetitionContractFanToken = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionFanTokenABI,
    address: getTradingCompetitionAddressFanToken(),
    signer,
  })
}
export const getTradingCompetitionContractMobox = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionMoboxABI,
    address: getTradingCompetitionAddressMobox(),
    signer,
  })
}

export const getTradingCompetitionContractMoD = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionMoDABI,
    address: getTradingCompetitionAddressMoD(),
    signer,
  })
}

export const getCakeVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: cakeVaultV2ABI, address: getCakeVaultAddress(chainId), signer, chainId })
}

export const getCakeFlexibleSideVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: cakeFlexibleSideVaultV2ABI,
    address: getCakeFlexibleSideVaultAddress(chainId),
    signer,
    chainId,
  })
}

export const getPredictionsV3Contract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: predictionsV3ABI, address, signer, chainId })
}

export const getPredictionsV2Contract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: predictionsV2ABI, address, signer, chainId })
}

export const getPredictionsV1Contract = (signer?: WalletClient) => {
  return getContract({ abi: predictionsV1ABI, address: getPredictionsV1Address(), signer })
}

export const getChainlinkOracleContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: chainlinkOracleABI, address, signer, chainId })
}

export const getFarmAuctionContract = (signer?: WalletClient) => {
  return getContract({ abi: farmAuctionABI, address: getFarmAuctionAddress(), signer })
}

export const getNftMarketContract = (signer?: WalletClient) => {
  return getContract({ abi: nftMarketABI, address: getNftMarketAddress(), signer })
}
export const getNftSaleContract = (signer?: WalletClient) => {
  return getContract({ abi: nftSaleABI, address: getNftSaleAddress(), signer })
}
export const getPancakeSquadContract = (signer?: WalletClient) => {
  return getContract({ abi: pancakeSquadABI, address: getPancakeSquadAddress(), signer })
}

export const getPotteryVaultContract = (address: Address, walletClient?: WalletClient) => {
  return getContract({ abi: potteryVaultABI, address, signer: walletClient })
}

export const getPotteryDrawContract = (walletClient?: WalletClient) => {
  return getContract({ abi: potteryDrawABI, address: getPotteryDrawAddress(), signer: walletClient })
}

export const getIfoCreditAddressContract = (signer?: WalletClient) => {
  return getIfoCreditAddressContract_(ChainId.BSC, getViemClients, signer)
}

export const getBCakeFarmBoosterContract = (signer?: WalletClient) => {
  return getContract({ abi: bCakeFarmBoosterABI, address: getBCakeFarmBoosterAddress(), signer })
}

export const getBCakeFarmBoosterV3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: bCakeFarmBoosterV3ABI, address: getBCakeFarmBoosterV3Address(chainId), signer, chainId })
}

export const getBCakeFarmBoosterVeCakeContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: bCakeFarmBoosterVeCakeABI,
    address: getBCakeFarmBoosterVeCakeAddress(chainId),
    signer,
    chainId,
  })
}

export const getBCakeFarmWrapperBoosterVeCakeContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: bCakeFarmWrapperBoosterVeCakeABI,
    address,
    signer,
    chainId,
  })
}

export const getPositionManagerWrapperContract = (address: `0x${string}`, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: positionManagerWrapperABI,
    address,
    signer,
    chainId,
  })
}

export const getPositionManagerBCakeWrapperContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: positionManagerVeBCakeWrapperABI,
    address,
    signer,
    chainId,
  })
}

export const getV2SSBCakeWrapperContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: v2BCakeWrapperABI,
    address,
    signer,
    chainId,
  })
}

export const getPositionManagerAdapterContract = (address: `0x${string}`, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: positionManagerAdapterABI,
    address,
    signer,
    chainId,
  })
}

export const getBCakeFarmBoosterProxyFactoryContract = (signer?: WalletClient) => {
  return getContract({
    abi: bCakeFarmBoosterProxyFactoryABI,
    address: getBCakeFarmBoosterProxyFactoryAddress(),
    signer,
  })
}

export const getBCakeProxyContract = (proxyContractAddress: Address, signer?: WalletClient) => {
  return getContract({ abi: bCakeProxyABI, address: proxyContractAddress, signer })
}

export const getNonBscVaultContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: nonBscVaultABI, address: getNonBscVaultAddress(chainId), chainId, signer })
}

export const getSidContract = (address: Address, chainId: number) => {
  return getContract({ abi: sidABI, address, chainId })
}

export const getUnsContract = (address: Address, chainId?: ChainId, publicClient?: PublicClient) => {
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
    publicClient,
  })
}

export const getSidResolverContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: SIDResolverABI, address, signer })
}

export const getCrossFarmingSenderContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingSenderABI,
    address: getCrossFarmingSenderAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingReceiverContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingReceiverABI,
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
  return getContract({ abi: crossFarmingProxyABI, address: proxyContractAddress, chainId, signer })
}

export const getStableSwapNativeHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stableSwapNativeHelperABI,
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
  const mcv3Address = getMasterChefV3Address(chainId)
  return mcv3Address
    ? getContract({
        abi: masterChefV3ABI,
        address: mcv3Address,
        chainId,
        signer,
      })
    : null
}

export const getV3MigratorContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: v3MigratorABI,
    address: getV3MigratorAddress(chainId),
    chainId,
    signer,
  })
}

export const getTradingRewardContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardAddress(chainId),
    signer,
    chainId,
  })
}

export const getV3AirdropContract = (walletClient?: WalletClient) => {
  return getContract({
    abi: v3AirdropABI,
    address: getV3AirdropAddress(),
    signer: walletClient,
  })
}

export const getAffiliateProgramContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: affiliateProgramABI,
    address: getAffiliateProgramAddress(chainId),
  })
}

export const getTradingRewardTopTradesContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardTopTradesAddress(chainId),
    signer,
    chainId,
  })
}

export const getVCakeContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: vCakeABI,
    address: getVCakeAddress(chainId),
    signer,
    chainId,
  })
}

export const getRevenueSharingPoolContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolABI,
    address: getRevenueSharingPoolAddress(chainId),
    signer,
    chainId,
  })
}

export const getAnniversaryAchievementContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: anniversaryAchievementABI,
    address: getAnniversaryAchievementAddress(chainId),
  })
}

export const getFixedStakingContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: fixedStakingABI,
    address: getFixedStakingAddress(chainId),
    signer,
    chainId,
  })
}

export const getVeCakeContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: veCakeABI,
    address: getVeCakeAddress(chainId) ?? getVeCakeAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getGaugesVotingContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: gaugesVotingABI,
    address: getGaugesVotingAddress(chainId) ?? getGaugesVotingAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getCalcGaugesVotingContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: calcGaugesVotingABI,
    address: getCalcGaugesVotingAddress(chainId) ?? getCalcGaugesVotingAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getRevenueSharingCakePoolContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingCakePoolAddress(chainId) ?? getRevenueSharingCakePoolAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getRevenueSharingVeCakeContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingVeCakeAddress(chainId) ?? getRevenueSharingVeCakeAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getRevenueSharingPoolGatewayContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolGatewayABI,
    address: getRevenueSharingPoolGatewayAddress(chainId) ?? getRevenueSharingPoolGatewayAddress(ChainId.BSC),
    signer,
    chainId,
  })
}
