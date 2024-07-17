// Addresses
import {
  getBunnyFactoryAddress,
  getNftMarketAddress,
  getPancakeProfileAddress,
  getPointCenterIfoAddress,
  getQuestRewardAddress,
} from 'utils/addressHelpers'

// ABI
import { ChainId } from '@pancakeswap/chains'
import { bunnyFactoryABI } from 'config/abi/bunnyFactory'
import { nftMarketABI } from 'config/abi/nftMarket'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { pointCenterIfoABI } from 'config/abi/pointCenterIfo'
import { questRewardAbi } from 'config/abi/questRewardAbi'
import { viemClients } from 'utils/viem'
import {
  Abi,
  Address,
  GetContractReturnType,
  PublicClient,
  WalletClient,
  erc20Abi,
  erc721Abi,
  getContract as viemGetContract,
} from 'viem'

export const getContract = <TAbi extends Abi | readonly unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BSC,
  publicClient,
  signer,
}: {
  abi: TAbi | readonly unknown[]
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    client: {
      public: publicClient ?? viemClients[chainId],
      wallet: signer,
    },
  }) as unknown as GetContractReturnType<TAbi, PublicClient, Address>

  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getBep20Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: erc20Abi, address, signer })
}

export const getErc721Contract = (address: Address, walletClient?: WalletClient) => {
  return getContract({
    abi: erc721Abi,
    address,
    signer: walletClient,
  })
}

export const getBunnyFactoryContract = (signer?: WalletClient) => {
  return getContract({ abi: bunnyFactoryABI, address: getBunnyFactoryAddress(), signer })
}

export const getProfileContract = (signer?: WalletClient) => {
  return getContract({ abi: pancakeProfileABI, address: getPancakeProfileAddress(), signer })
}

export const getNftMarketContract = (signer?: WalletClient) => {
  return getContract({ abi: nftMarketABI, address: getNftMarketAddress(), signer })
}

export const getPointCenterIfoContract = (signer?: WalletClient) => {
  return getContract({ abi: pointCenterIfoABI, address: getPointCenterIfoAddress(), signer })
}

export const getQuestRewardContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract({ abi: questRewardAbi, address: getQuestRewardAddress(chainId), signer })
}
