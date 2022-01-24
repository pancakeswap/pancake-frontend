import React, { useState } from 'react'
import { AutoRenewIcon, Button, Flex, InjectedModalProps, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCake } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useProfile } from 'state/profile/hooks'
import { ToastDescriptionWithTx } from 'components/Toast'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { formatBigNumber } from 'utils/formatBalance'
import { logError } from 'utils/sentry'
import useGetProfileCosts from 'views/Nft/market/Profile/hooks/useGetProfileCosts'
import { UseEditProfileResponse } from './reducer'

interface ApproveCakePageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
}

const ApproveCakePage: React.FC<ApproveCakePageProps> = ({ goToChange, onDismiss }) => {
  const [isApproving, setIsApproving] = useState(false)
  const { profile } = useProfile()
  const { t } = useTranslation()
  const {
    costs: { numberCakeToUpdate, numberCakeToReactivate },
  } = useGetProfileCosts()
  const cakeContract = useCake()
  const { toastSuccess, toastError } = useToast()
  const cost = profile.isActive ? numberCakeToUpdate : numberCakeToReactivate

  const handleApprove = async () => {
    try {
      const tx = await cakeContract.approve(getPancakeProfileAddress(), cost.mul(2).toString())
      toastSuccess(`${t('Transaction Submitted')}!`, <ToastDescriptionWithTx txHash={tx.hash} />)
      setIsApproving(true)
      const receipt = await tx.wait()
      if (receipt.status) {
        goToChange()
      } else {
        toastError(
          t('Error'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Please try again. Confirm the transaction and make sure you are paying enough gas!')}
          </ToastDescriptionWithTx>,
        )
      }
    } catch (error) {
      logError(error)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsApproving(false)
    }
  }

  if (!profile) {
    return null
  }

  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text>{profile.isActive ? t('Cost to update:') : t('Cost to reactivate:')}</Text>
        <Text>{formatBigNumber(cost)} CAKE</Text>
      </Flex>
      <Button
        disabled={isApproving}
        isLoading={isApproving}
        endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : null}
        width="100%"
        mb="8px"
        onClick={handleApprove}
      >
        {t('Enable')}
      </Button>
      <Button variant="text" width="100%" onClick={onDismiss} disabled={isApproving}>
        {t('Close Window')}
      </Button>
    </Flex>
  )
}

export default ApproveCakePage
