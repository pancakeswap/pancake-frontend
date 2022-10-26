import useSWR from 'swr'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getCrossFarmingSenderContract } from 'utils/contractHelpers'

export const useFirstTimeCrossFarming = (vaultPid: number) => {
  const { account, chainId } = useActiveWeb3React()
  const crossFarmingAddress = getCrossFarmingSenderContract(null, chainId)

  const { data } = useSWR(account && vaultPid && chainId && ['isFirstTimeCrossFarming'], async () => {
    const firstTimeDeposit = await crossFarmingAddress.is1st(account)
    return !firstTimeDeposit
  })

  return { isFirstTime: data }
}
