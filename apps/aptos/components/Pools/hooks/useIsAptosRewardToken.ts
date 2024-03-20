import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { useCheckIsUserIpPass } from 'components/Farms/hooks/useCheckIsUserIpPass'
import { APT } from 'config/coins'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'

export const useIsAptosRewardToken = ({ isFinished, earningToken }: { isFinished?: boolean; earningToken: Coin }) => {
  const { account } = useActiveWeb3React()
  const isUserIpPass = useCheckIsUserIpPass()

  const isAptosRewardToken = useMemo(
    () =>
      Boolean(
        account &&
          !isUserIpPass &&
          !isFinished &&
          earningToken.address.toLowerCase() === APT[earningToken.chainId].address.toLowerCase(),
      ),
    [account, isUserIpPass, isFinished, earningToken],
  )

  return isAptosRewardToken
}
