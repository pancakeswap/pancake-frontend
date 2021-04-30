import React, { useState } from 'react'
import { Button, AutoRenewIcon, Skeleton } from '@pancakeswap-libs/uikit'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useCake, useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { Pool } from 'state/types'

interface ApprovalActionProps {
  pool: Pool
  account: string
  setLastUpdated: () => void
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ pool, account, isLoading = false, setLastUpdated }) => {
  const { stakingToken } = pool
  const cakeVaultContract = useCakeVaultContract()
  const cakeContract = useCake()
  const { t } = useTranslation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const handleApprove = () => {
    cakeContract.methods
      .approve(cakeVaultContract.options.address, ethers.constants.MaxUint256)
      .send({ from: account })
      .on('sending', () => {
        setRequestedApproval(true)
      })
      .on('receipt', () => {
        toastSuccess(
          `${t('Contract Enabled')}`,
          `${t(`You can now stake in the %symbol %vault!`, { symbol: stakingToken.symbol })}`,
        )
        setLastUpdated()
        setRequestedApproval(false)
      })
      .on('error', (error) => {
        console.error(error)
        toastError(
          `${t('Error')}`,
          `${t(`Please try again. Confirm the transaction and make sure you are paying enough gas!`)}`,
        )
        setRequestedApproval(false)
      })
  }

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button
          isLoading={requestedApproval}
          endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={requestedApproval}
          onClick={handleApprove}
          width="100%"
        >
          {t('Enable')}
        </Button>
      )}
    </>
  )
}

export default ApprovalAction
