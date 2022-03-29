import { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import _noop from 'lodash/noop'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useVaultPoolContract } from 'hooks/useContract'
import BigNumber from 'bignumber.js'
import { getDecimalAmount } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { fetchCakeVaultUserData } from 'state/pools'

import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useLockedPool = ({ lockedAmount, stakingToken, onDismiss }) => {
  const dispatch = useAppDispatch()

  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const [duration, setDuration] = useState(1)
  const usdValueStaked = useBUSDCakeAmount(lockedAmount)

  // TODO: Add proper gasLimit
  const callOptions = {
    gasLimit: 500000,
  }

  const convertWeekToSeconds = (week) => week * 7 * 24 * 60 * 60

  const handleDeposit = async (convertedStakeAmount: BigNumber, lockDuration = 0) => {
    const receipt = await fetchWithCatchTxError(() => {
      // .toString() being called to fix a BigNumber error in prod
      // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      const methodArgs = [convertedStakeAmount.toString(), lockDuration.toString()]
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
      dispatch(fetchCakeVaultUserData({ account }))
    }
  }

  const handleConfirmClick = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(lockedAmount), stakingToken.decimals)

    handleDeposit(convertedStakeAmount, convertWeekToSeconds(duration))
  }

  return { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick }
}

export default useLockedPool
