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
