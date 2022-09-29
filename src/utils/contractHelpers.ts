import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { provider } from 'utils/wagmi'
import { Contract } from '@ethersproject/contracts'
import poolsConfig from 'config/constants/pools'
import { PoolCategory } from 'config/constants/types'
import { CAKE } from '@pancakeswap/tokens'

// Addresses
import {
  getAddress,
  getPancakeProfileAddress,
  getPancakeBunniesAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getLotteryV2Address,
  getMasterChefAddress,
  getMasterChefV1Address,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getTradingCompetitionAddressEaster,
  getEasterNftAddress,
  getCakeVaultAddress,
  getMulticallAddress,
  getBunnySpecialCakeVaultAddress,
  getBunnySpecialPredictionAddress,
  getBunnySpecialLotteryAddress,
  getFarmAuctionAddress,
  getAnniversaryAchievement,
  getNftMarketAddress,
  getNftSaleAddress,
  getPancakeSquadAddress,
  getTradingCompetitionAddressFanToken,
  getTradingCompetitionAddressMobox,
  getTradingCompetitionAddressMoD,
  getBunnySpecialXmasAddress,
  getICakeAddress,
  getPotteryDrawAddress,
  getZapAddress,
  getCakeFlexibleSideVaultAddress,
  getPredictionsV1Address,
  getBCakeFarmBoosterAddress,
  getBCakeFarmBoosterProxyFactoryAddress,
} from 'utils/addressHelpers'

// ABI
import profileABI from 'config/abi/pancakeProfile.json'
import pancakeBunniesAbi from 'config/abi/pancakeBunnies.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
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
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import tradingCompetitionEasterAbi from 'config/abi/tradingCompetitionEaster.json'
import tradingCompetitionFanTokenAbi from 'config/abi/tradingCompetitionFanToken.json'
import tradingCompetitionMoboxAbi from 'config/abi/tradingCompetitionMobox.json'
import tradingCompetitionMoDAbi from 'config/abi/tradingCompetitionMoD.json'
import easterNftAbi from 'config/abi/easterNft.json'
import cakeVaultV2Abi from 'config/abi/cakeVaultV2.json'
import cakeFlexibleSideVaultV2Abi from 'config/abi/cakeFlexibleSideVaultV2.json'
import predictionsAbi from 'config/abi/predictions.json'
import predictionsV1Abi from 'config/abi/predictionsV1.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import bunnySpecialCakeVaultAbi from 'config/abi/bunnySpecialCakeVault.json'
import bunnySpecialPredictionAbi from 'config/abi/bunnySpecialPrediction.json'
import bunnySpecialLotteryAbi from 'config/abi/bunnySpecialLottery.json'
import bunnySpecialXmasAbi from 'config/abi/bunnySpecialXmas.json'
import farmAuctionAbi from 'config/abi/farmAuction.json'
import anniversaryAchievementAbi from 'config/abi/anniversaryAchievement.json'
import nftMarketAbi from 'config/abi/nftMarket.json'
import nftSaleAbi from 'config/abi/nftSale.json'
import pancakeSquadAbi from 'config/abi/pancakeSquad.json'
import erc721CollectionAbi from 'config/abi/erc721collection.json'
import potteryVaultAbi from 'config/abi/potteryVaultAbi.json'
import potteryDrawAbi from 'config/abi/potteryDrawAbi.json'
import zapAbi from 'config/abi/zap.json'
import iCakeAbi from 'config/abi/iCake.json'
import ifoV3Abi from 'config/abi/ifoV3.json'
import cakePredictionsAbi from 'config/abi/cakePredictions.json'
import bCakeFarmBoosterAbi from 'config/abi/bCakeFarmBooster.json'
import bCakeFarmBoosterProxyFactoryAbi from 'config/abi/bCakeFarmBoosterProxyFactory.json'
import bCakeProxyAbi from 'config/abi/bCakeProxy.json'

// Types
import type {
  ChainlinkOracle,
  FarmAuction,
  Predictions,
  AnniversaryAchievement,
  IfoV1,
  IfoV2,
  Erc20,
  Erc721,
  Cake,
  BunnyFactory,
  PancakeBunnies,
  PancakeProfile,
  LotteryV2,
  Masterchef,
  MasterchefV1,
  SousChef,
  SousChefV2,
  BunnySpecial,
  LpToken,
  ClaimRefund,
  TradingCompetitionEaster,
  TradingCompetitionFanToken,
  EasterNft,
  Multicall,
  BunnySpecialCakeVault,
  BunnySpecialPrediction,
  BunnySpecialLottery,
  NftMarket,
  NftSale,
  PancakeSquad,
  Erc721collection,
  PointCenterIfo,
  CakeVaultV2,
  CakeFlexibleSideVaultV2,
  TradingCompetitionMobox,
  ICake,
  TradingCompetitionMoD,
  PotteryVaultAbi,
  PotteryDrawAbi,
  Zap,
  PredictionsV1,
  BCakeFarmBooster,
  BCakeFarmBoosterProxyFactory,
  BCakeProxy,
} from 'config/abi/types'
import { ChainId } from '@pancakeswap/sdk'

export const getContract = ({
  abi,
  address,
  chainId = ChainId.BSC,
  signer,
}: {
  abi: any
  address: string
  chainId?: ChainId
  signer?: Signer | Provider
}) => {
  const signerOrProvider = signer ?? provider({ chainId })
  return new Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: bep20Abi, address, signer }) as Erc20
}
export const getErc721Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: erc721Abi, address, signer }) as Erc721
}
export const getLpContract = (address: string, chainId?: number, signer?: Signer | Provider) => {
  return getContract({ abi: lpTokenAbi, address, signer, chainId }) as LpToken
}
export const getIfoV1Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV1Abi, address, signer }) as IfoV1
}
export const getIfoV2Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV2Abi, address, signer }) as IfoV2
}
export const getIfoV3Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV3Abi, address, signer })
}
export const getSouschefContract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  return getContract({ abi, address: getAddress(config.contractAddress), signer }) as SousChef
}
export const getSouschefV2Contract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract({ abi: sousChefV2, address: getAddress(config.contractAddress), signer }) as SousChefV2
}

export const getPointCenterIfoContract = (signer?: Signer | Provider) => {
  return getContract({ abi: pointCenterIfo, address: getPointCenterIfoAddress(), signer }) as PointCenterIfo
}
export const getCakeContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: cakeAbi,
    address: chainId ? CAKE[chainId].address : CAKE[ChainId.BSC].address,
    signer,
  }) as Cake
}
export const getProfileContract = (signer?: Signer | Provider) => {
  return getContract({ abi: profileABI, address: getPancakeProfileAddress(), signer }) as PancakeProfile
}
export const getPancakeBunniesContract = (signer?: Signer | Provider) => {
  return getContract({ abi: pancakeBunniesAbi, address: getPancakeBunniesAddress(), signer }) as PancakeBunnies
}
export const getBunnyFactoryContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bunnyFactoryAbi, address: getBunnyFactoryAddress(), signer }) as BunnyFactory
}
export const getBunnySpecialContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bunnySpecialAbi, address: getBunnySpecialAddress(), signer }) as BunnySpecial
}
export const getLotteryV2Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: lotteryV2Abi, address: getLotteryV2Address(), signer }) as LotteryV2
}
export const getMasterchefContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: masterChef, address: getMasterChefAddress(chainId), signer }) as Masterchef
}
export const getMasterchefV1Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: masterChefV1, address: getMasterChefV1Address(), signer }) as MasterchefV1
}
export const getClaimRefundContract = (signer?: Signer | Provider) => {
  return getContract({ abi: claimRefundAbi, address: getClaimRefundAddress(), signer }) as ClaimRefund
}
export const getTradingCompetitionContractEaster = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionEasterAbi,
    address: getTradingCompetitionAddressEaster(),
    signer,
  }) as TradingCompetitionEaster
}

export const getTradingCompetitionContractFanToken = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionFanTokenAbi,
    address: getTradingCompetitionAddressFanToken(),
    signer,
  }) as TradingCompetitionFanToken
}
export const getTradingCompetitionContractMobox = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionMoboxAbi,
    address: getTradingCompetitionAddressMobox(),
    signer,
  }) as TradingCompetitionMobox
}

export const getTradingCompetitionContractMoD = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionMoDAbi,
    address: getTradingCompetitionAddressMoD(),
    signer,
  }) as TradingCompetitionMoD
}

export const getEasterNftContract = (signer?: Signer | Provider) => {
  return getContract({ abi: easterNftAbi, address: getEasterNftAddress(), signer }) as EasterNft
}
export const getCakeVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: cakeVaultV2Abi, address: getCakeVaultAddress(), signer }) as CakeVaultV2
}

export const getCakeFlexibleSideVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: cakeFlexibleSideVaultV2Abi,
    address: getCakeFlexibleSideVaultAddress(),
    signer,
  }) as CakeFlexibleSideVaultV2
}

export const getPredictionsContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: predictionsAbi, address, signer }) as Predictions
}

export const getPredictionsV1Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: predictionsV1Abi, address: getPredictionsV1Address(), signer }) as PredictionsV1
}

export const getCakePredictionsContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: cakePredictionsAbi, address, signer }) as Predictions
}

export const getChainlinkOracleContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: chainlinkOracleAbi, address, signer }) as ChainlinkOracle
}
export const getMulticallContract = (chainId: ChainId) => {
  return getContract({ abi: MultiCallAbi, address: getMulticallAddress(chainId), chainId }) as Multicall
}
export const getBunnySpecialCakeVaultContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bunnySpecialCakeVaultAbi,
    address: getBunnySpecialCakeVaultAddress(),
    signer,
  }) as BunnySpecialCakeVault
}
export const getBunnySpecialPredictionContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bunnySpecialPredictionAbi,
    address: getBunnySpecialPredictionAddress(),
    signer,
  }) as BunnySpecialPrediction
}
export const getBunnySpecialLotteryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bunnySpecialLotteryAbi,
    address: getBunnySpecialLotteryAddress(),
    signer,
  }) as BunnySpecialLottery
}
export const getBunnySpecialXmasContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bunnySpecialXmasAbi, address: getBunnySpecialXmasAddress(), signer })
}
export const getFarmAuctionContract = (signer?: Signer | Provider) => {
  return getContract({ abi: farmAuctionAbi, address: getFarmAuctionAddress(), signer }) as unknown as FarmAuction
}
export const getAnniversaryAchievementContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: anniversaryAchievementAbi,
    address: getAnniversaryAchievement(),
    signer,
  }) as AnniversaryAchievement
}

export const getNftMarketContract = (signer?: Signer | Provider) => {
  return getContract({ abi: nftMarketAbi, address: getNftMarketAddress(), signer }) as NftMarket
}
export const getNftSaleContract = (signer?: Signer | Provider) => {
  return getContract({ abi: nftSaleAbi, address: getNftSaleAddress(), signer }) as NftSale
}
export const getPancakeSquadContract = (signer?: Signer | Provider) => {
  return getContract({ abi: pancakeSquadAbi, address: getPancakeSquadAddress(), signer }) as PancakeSquad
}
export const getErc721CollectionContract = (signer?: Signer | Provider, address?: string) => {
  return getContract({ abi: erc721CollectionAbi, address, signer }) as Erc721collection
}

export const getPotteryVaultContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: potteryVaultAbi, address, signer }) as PotteryVaultAbi
}

export const getPotteryDrawContract = (signer?: Signer | Provider) => {
  return getContract({ abi: potteryDrawAbi, address: getPotteryDrawAddress(), signer }) as PotteryDrawAbi
}

export const getZapContract = (signer?: Signer | Provider) => {
  return getContract({ abi: zapAbi, address: getZapAddress(), signer }) as Zap
}

export const getIfoCreditAddressContract = (signer?: Signer | Provider) => {
  return getContract({ abi: iCakeAbi, address: getICakeAddress(), signer }) as ICake
}

export const getBCakeFarmBoosterContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bCakeFarmBoosterAbi, address: getBCakeFarmBoosterAddress(), signer }) as BCakeFarmBooster
}

export const getBCakeFarmBoosterProxyFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bCakeFarmBoosterProxyFactoryAbi,
    address: getBCakeFarmBoosterProxyFactoryAddress(),
    signer,
  }) as BCakeFarmBoosterProxyFactory
}

export const getBCakeProxyContract = (proxyContractAddress: string, signer?: Signer | Provider) => {
  return getContract({ abi: bCakeProxyAbi, address: proxyContractAddress, signer }) as BCakeProxy
}
