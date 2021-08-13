import React, { useState } from 'react'
import { Button, AutoRenewIcon, Skeleton } from '@rug-zombie-libs/uikit'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useCake, useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { Pool } from 'state/types'
import { GraveConfig } from '../../../../../config/constants/types'
import tokens from '../../../../../config/constants/tokens'
import { getAddress } from '../../../../../utils/addressHelpers'

interface ApprovalActionProps {
  grave: GraveConfig
  account: string
  setLastUpdated: () => void
  isLoading?: boolean
  web3
}

const UnlockingAction: React.FC<ApprovalActionProps> = ({ grave, account, isLoading = false, setLastUpdated, web3 }) => {
  const cakeContract = useCake()
  const { t } = useTranslation()
  const [graveUnlocked, setGraveUnlocked] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const handleUnlock = () => {
    // restorationChef.methods
    //   .unlock(grave.gid)
    //   .send({ from: account })
    //   .on('sending', () => {
    //     setGraveUnlocked(true)
    //   })
    //   .on('receipt', () => {
    //     toastSuccess(
    //       `${t('Grave Unlocked')}`,
    //       `${t(`You can now stake in the %symbol %vault!`, { symbol: tokens.zmbe.symbol })}`,
    //     )
    //     setLastUpdated()
    //     setGraveUnlocked(false)
    //   })
    //   .on('error', (error) => {
    //     console.error(error)
    //     toastError(
    //       `${t('Error')}`,
    //       `${t(`Please try again. Confirm the transaction and make sure you are paying enough gas!`)}`,
    //     )
    //     setGraveUnlocked(false)
    //   })
  }

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button
          isLoading={graveUnlocked}
          endIcon={graveUnlocked ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={graveUnlocked}
          onClick={handleUnlock}
          width="100%"
        >
          {t('Unlock Grave ($10)')}
        </Button>
      )}
    </>
  )
}

export default UnlockingAction
