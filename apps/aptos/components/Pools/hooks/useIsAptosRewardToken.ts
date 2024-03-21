import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { useCheckIsUserIpPass } from 'components/Farms/hooks/useCheckIsUserIpPass'
import { APT } from 'config/coins'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'

export const useIsAptosRewardToken = ({ isFinished, earningToken }: { isFinished?: boolean; earningToken: Coin }) => {
  const { account } = useActiveWeb3React()
  const isUserIpPass = useCheckIsUserIpPass()

  const isTokenValid = useMemo(
    () => earningToken.address.toLowerCase() === APT[earningToken.chainId].address.toLowerCase(),
    [earningToken],
  )

  const isAptosRewardToken = useMemo(() => Boolean(!isFinished && isTokenValid), [isFinished, isTokenValid])

  const isUSUserWithAptosReward = useMemo(
    () => Boolean(account && isTokenValid && !isUserIpPass),
    [account, isTokenValid, isUserIpPass],
  )

  return {
    isAptosRewardToken,
    isUSUserWithAptosReward,
  }
}
