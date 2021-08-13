import React, { useState } from 'react'
import { Button, AutoRenewIcon, Skeleton } from '@rug-zombie-libs/uikit'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useCake, useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { Pool } from 'state/types'
import Web3 from 'web3'
import { GraveConfig } from '../../../../../config/constants/types'
import tokens from '../../../../../config/constants/tokens'
import { getAddress } from '../../../../../utils/addressHelpers'
import { getBep20Contract } from '../../../../../utils/contractHelpers'

interface ApprovalActionProps {
  grave: GraveConfig
  account: string
  setLastUpdated: () => void
  isLoading?: boolean
  web3: Web3
}

const RuggedTokenApprovalAction: React.FC<ApprovalActionProps> = ({ grave, account, isLoading = false, setLastUpdated, web3 }) => {
  const cakeVaultContract = useCakeVaultContract()
  const ruggedTokenContract = getBep20Contract(getAddress(grave.ruggedToken.address), web3)
  const { t } = useTranslation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const handleApprove = () => {
    // ruggedTokenContract.methods
    //   .approve(getRestorationChefAddress(), ethers.constants.MaxUint256)
    //   .send({ from: account })
    //   .on('sending', () => {
    //     setRequestedApproval(true)
    //   })
    //   .on('receipt', () => {
    //     toastSuccess(
    //       `${t('Contract Enabled')}`,
    //       `${t(`You can now stake in the %symbol %vault!`, { symbol: grave.ruggedToken.symbol })}`,
    //     )
    //     setLastUpdated()
    //     setRequestedApproval(false)
    //   })
    //   .on('error', (error) => {
    //     console.error(error)
    //     toastError(
    //       `${t('Error')}`,
    //       `${t(`Please try again. Confirm the transaction and make sure you are paying enough gas!`)}`,
    //     )
    //     setRequestedApproval(false)
    //   })
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
          {`Approve ${grave.ruggedToken.symbol}`}
        </Button>
      )}
    </>
  )
}

export default RuggedTokenApprovalAction
