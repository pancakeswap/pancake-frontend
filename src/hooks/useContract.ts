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
  getLotteryContract,
  getLotteryTicketContract,
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
} from 'utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
  const web3 = useWeb3Provider()
  return useMemo(() => getIfoV1Contract(address, web3), [address, web3])
}

export const useIfoV2Contract = (address: string) => {
  const web3 = useWeb3Provider()
  return useMemo(() => getIfoV2Contract(address, web3), [address, web3])
}

export const useERC20 = (address: string) => {
  const web3 = useWeb3Provider()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const web3 = useWeb3Provider()
  return useMemo(() => getErc721Contract(address, web3), [address, web3])
}

export const useCake = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getCakeContract(web3), [web3])
}

export const useBunnyFactory = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getBunnyFactoryContract(web3), [web3])
}

export const usePancakeRabbits = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getPancakeRabbitContract(web3), [web3])
}

export const useProfile = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getProfileContract(web3), [web3])
}

export const useLottery = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getLotteryContract(web3), [web3])
}

export const useLotteryTicket = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getLotteryTicketContract(web3), [web3])
}

export const useLotteryV2Contract = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getLotteryV2Contract(web3), [web3])
}

export const useMasterchef = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getMasterchefContract(web3), [web3])
}

export const useSousChef = (id) => {
  const web3 = useWeb3Provider()
  return useMemo(() => getSouschefContract(id, web3), [id, web3])
}

export const useSousChefV2 = (id) => {
  const web3 = useWeb3Provider()
  return useMemo(() => getSouschefV2Contract(id, web3), [id, web3])
}

export const usePointCenterIfoContract = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getPointCenterIfoContract(web3), [web3])
}

export const useBunnySpecialContract = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getBunnySpecialContract(web3), [web3])
}

export const useClaimRefundContract = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getClaimRefundContract(web3), [web3])
}

export const useTradingCompetitionContract = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getTradingCompetitionContract(web3), [web3])
}

export const useEasterNftContract = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getEasterNftContract(web3), [web3])
}

export const useCakeVaultContract = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getCakeVaultContract(web3), [web3])
}

export const usePredictionsContract = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getPredictionsContract(web3), [web3])
}

export const useChainlinkOracleContract = () => {
  const web3 = useWeb3Provider()
  return useMemo(() => getChainlinkOracleContract(web3), [web3])
}
