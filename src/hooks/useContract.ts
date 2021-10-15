import { useMemo } from 'react'
import useWeb3 from 'hooks/useWeb3'
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
  getZombieContract,
  getDrFrankensteinContract,
  getMausoleumContract,
  getSpawningPoolContract,
  getNftConverterContract,
  getNftOwnership,
  getZombieBalanceCheckerContract,
  getMulticallContract,
  getCatacombsContract,
  getInstaBuyContract,
} from 'utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getErc721Contract(address, web3), [address, web3])
}

export const useCake = () => {
  const web3 = useWeb3()
  return useMemo(() => getCakeContract(web3), [web3])
}

export const useZombie = () => {
  const web3 = useWeb3()
  return useMemo(() => getZombieContract(web3), [web3])
}

export const useMausoleum = (version?: string) => {
  const web3 = useWeb3()
  return useMemo(() =>  getMausoleumContract(version, web3), [version, web3])
}

export const useBunnyFactory = () => {
  const web3 = useWeb3()
  return useMemo(() => getBunnyFactoryContract(web3), [web3])
}

export const useZombieBalanceChecker = () => {
  const web3 = useWeb3()
  return useMemo(() => getZombieBalanceCheckerContract(web3), [web3])
}
export const useProfile = () => {
  const web3 = useWeb3()
  return useMemo(() => getProfileContract(web3), [web3])
}

export const useLottery = () => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryContract(web3), [web3])
}

export const useLotteryTicket = () => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryTicketContract(web3), [web3])
}

export const useMasterchef = () => {
  const web3 = useWeb3()
  return useMemo(() => getMasterchefContract(web3), [web3])
}

export const useDrFrankenstein = () => {
  const web3 = useWeb3()
  return useMemo(() => getDrFrankensteinContract(web3), [web3])
}

export const useSpawningPool = (id: number) => {
  const web3 = useWeb3()
  return useMemo(() => getSpawningPoolContract(id, web3), [id, web3])
}

export const useNftConverter = () => {
  const web3 = useWeb3()
  return useMemo(() => getNftConverterContract(web3), [web3])
}

export const useMultiCall = () => {
  const web3 = useWeb3()
  return useMemo(() => getMulticallContract(web3), [web3])
}

export const useNftOwnership = () => {
  const web3 = useWeb3()
  return useMemo(() => getNftOwnership(web3), [web3])
}

export const useSousChef = (id) => {
  const web3 = useWeb3()
  return useMemo(() => getSouschefContract(id, web3), [id, web3])
}

export const usePointCenterIfoContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getPointCenterIfoContract(web3), [web3])
}

export const useBunnySpecialContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getBunnySpecialContract(web3), [web3])
}

export const useClaimRefundContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getClaimRefundContract(web3), [web3])
}

export const useTradingCompetitionContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getTradingCompetitionContract(web3), [web3])
}

export const useEasterNftContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getEasterNftContract(web3), [web3])
}

export const useCakeVaultContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getCakeVaultContract(web3), [web3])
}

export const usePredictionsContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getPredictionsContract(web3), [web3])
}

export const useCatacombsContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getCatacombsContract(web3), [web3])
}

export const useInstaBuyContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getInstaBuyContract(web3), [web3])
}
