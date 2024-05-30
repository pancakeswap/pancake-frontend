import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePositionManagerWrapperContract } from 'hooks/useContract'
import React from 'react'
import { Address } from 'viem'

export interface UnStakeButtonProps {
  userStakedLp?: bigint
  wrapperAddress?: Address
  onDone: () => void
}

const UnstakeButton: React.FC<React.PropsWithChildren<UnStakeButtonProps>> = ({
  userStakedLp,
  wrapperAddress,
  onDone,
}) => {
  const { t } = useTranslation()

  const { account, chain } = useWeb3React()

  const { toastSuccess } = useToast()

  const { loading: pendingTx, fetchWithCatchTxError } = useCatchTxError()
  const isNeedUnstake = (userStakedLp ?? 0n) > 0n

  const [isLoading, setIsLoading] = React.useState(false)

  const wrapperContract = usePositionManagerWrapperContract(wrapperAddress ?? '0x')

  // eslint-disable-next-line consistent-return
  const handleUnstake = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    if (wrapperContract) {
      setIsLoading(true)

      const receipt = await fetchWithCatchTxError(() => {
        return wrapperContract.write.withdraw([userStakedLp ?? 0n], {
          account: account ?? '0x',
          chain,
        })
      })

      if (receipt?.status) {
        onDone()
        toastSuccess(
          `${t('Unstaked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been unstaked in position manager.')}
          </ToastDescriptionWithTx>,
        )
      }
    }
  }

  return (
    <>
      {pendingTx ? (
        <Button
          width="138px"
          marginLeft="auto"
          isLoading={pendingTx || isLoading}
          endIcon={<AutoRenewIcon spin color="currentColor" />}
        >
          {t('Confirming')}
        </Button>
      ) : (
        <Button width="138px" marginLeft="auto" disabled={!isNeedUnstake} onClick={handleUnstake}>
          {isNeedUnstake ? t('Unstake All') : t('Unstaked')}
        </Button>
      )}
    </>
  )
}

export default UnstakeButton
