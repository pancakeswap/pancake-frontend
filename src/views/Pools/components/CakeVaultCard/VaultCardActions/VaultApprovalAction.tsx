import React, { useState } from 'react'
import { Button, AutoRenewIcon, Skeleton } from '@pancakeswap-libs/uikit'
import { ethers } from 'ethers'
import useI18n from 'hooks/useI18n'
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
  const TranslateString = useI18n()
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
          `${TranslateString(999, 'Contract Enabled')}`,
          `${TranslateString(999, `You can now stake in the ${stakingToken.symbol} vault!`)}`,
        )
        setLastUpdated()
        setRequestedApproval(false)
      })
      .on('error', (error) => {
        console.error(error)
        toastError(
          `${TranslateString(999, 'Error')}`,
          `${TranslateString(
            999,
            `Please try again. Confirm the transaction and make sure you are paying enough gas!`,
          )}`,
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
          {TranslateString(999, 'Enable')}
        </Button>
      )}
    </>
  )
}

export default ApprovalAction
