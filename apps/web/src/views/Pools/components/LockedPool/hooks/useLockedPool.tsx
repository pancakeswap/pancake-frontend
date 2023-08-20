import { useState, useCallback, Dispatch, SetStateAction, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useSWRConfig } from 'swr'
import { useTranslation } from '@pancakeswap/localization'
import { ONE_WEEK_DEFAULT } from '@pancakeswap/pools'
import { useAppDispatch } from 'state'
import { useVaultPoolContract } from 'hooks/useContract'
import BigNumber from 'bignumber.js'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { fetchCakeVaultUserData } from 'state/pools'
import { Token } from '@pancakeswap/sdk'
import { vaultPoolConfig } from 'config/constants/pools'
import { VaultKey } from 'state/types'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { PrepConfirmArg } from '../types'

interface HookArgs {
  lockedAmount: BigNumber
  stakingToken: Token
  stakingTokenPrice: number
  onDismiss: () => void
  prepConfirmArg: PrepConfirmArg
  defaultDuration?: number
}

interface HookReturn {
  usdValueStaked: number
  duration: number
  setDuration: Dispatch<SetStateAction<number>>
  pendingTx: boolean
  handleConfirmClick: () => Promise<void>
}

export default function useLockedPool(hookArgs: HookArgs): HookReturn {
  const {
    lockedAmount,
    stakingToken,
    stakingTokenPrice,
    onDismiss,
    prepConfirmArg,
    defaultDuration = ONE_WEEK_DEFAULT,
  } = hookArgs

  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  const { address: account } = useAccount()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract(VaultKey.CakeVault)
  const { callWithGasPrice } = useCallWithGasPrice()
  const usdValueStaked = useMemo(
    () =>
      getBalanceNumber(
        getDecimalAmount(lockedAmount, stakingToken.decimals).multipliedBy(stakingTokenPrice),
        stakingToken.decimals,
      ),
    [lockedAmount, stakingTokenPrice, stakingToken.decimals],
  )

  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const { toastSuccess } = useToast()
  const [duration, setDuration] = useState(() => defaultDuration)

  const handleDeposit = useCallback(
    async (convertedStakeAmount: BigNumber, lockDuration: number) => {
      const callOptions = {
        gas: vaultPoolConfig[VaultKey.CakeVault].gasLimit,
      }

      const receipt = await fetchWithCatchTxError(() => {
        const methodArgs = [BigInt(convertedStakeAmount.toString()), BigInt(lockDuration)] as const
        return callWithGasPrice(vaultPoolContract, 'deposit', methodArgs, callOptions)
      })

      if (receipt?.status) {
        toastSuccess(
          t('Staked!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been staked in the pool')}
          </ToastDescriptionWithTx>,
        )
        onDismiss?.()
        dispatch(fetchCakeVaultUserData({ account, chainId }))
        mutate(['userCakeLockStatus', account])
      }
    },
    [
      fetchWithCatchTxError,
      toastSuccess,
      dispatch,
      onDismiss,
      account,
      vaultPoolContract,
      t,
      callWithGasPrice,
      mutate,
      chainId,
    ],
  )

  const handleConfirmClick = useCallback(async () => {
    const { finalLockedAmount = lockedAmount, finalDuration = duration } =
      typeof prepConfirmArg === 'function' ? prepConfirmArg({ duration }) : {}

    const convertedStakeAmount: BigNumber = getDecimalAmount(new BigNumber(finalLockedAmount), stakingToken.decimals)

    handleDeposit(convertedStakeAmount, finalDuration)
  }, [prepConfirmArg, stakingToken, handleDeposit, duration, lockedAmount])

  return { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick }
}
