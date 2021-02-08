import React, { useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { AutoRenewIcon, Button, Flex, InjectedModalProps, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useCake } from 'hooks/useContract'
import { useProfile, useToast } from 'state/hooks'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import useGetProfileCosts from '../../hooks/useGetProfileCosts'
import { UseEditProfileResponse } from './reducer'

interface ApproveCakePageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
}

const ApproveCakePage: React.FC<ApproveCakePageProps> = ({ goToChange, onDismiss }) => {
  const [isApproving, setIsApproving] = useState(false)
  const { profile } = useProfile()
  const TranslateString = useI18n()
  const { account } = useWallet()
  const { numberCakeToUpdate } = useGetProfileCosts()
  const cakeContract = useCake()
  const { toastError } = useToast()

  const handleApprove = () => {
    cakeContract.methods
      .approve(getPancakeProfileAddress(), numberCakeToUpdate.times(2).toJSON())
      .send({ from: account })
      .on('sending', () => {
        setIsApproving(true)
      })
      .on('receipt', () => {
        goToChange()
      })
      .on('error', (error) => {
        toastError('Error', error?.message)
        setIsApproving(false)
      })
  }

  if (!profile) {
    return null
  }

  return (
    <Flex flexDirection="column">
      <Text as="p" color="textSubtle" mb="24px">
        {TranslateString(
          999,
          "The collectible you've chosen will be locked in a smart contract while it’s being used as your profile picture. Don't worry - you'll be able to get it back at any time.",
        )}
      </Text>
      <Button
        disabled={isApproving}
        isLoading={isApproving}
        endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : null}
        fullWidth
        mb="8px"
        onClick={handleApprove}
      >
        {TranslateString(999, 'Approve')}
      </Button>
      <Button variant="text" fullWidth onClick={onDismiss}>
        {TranslateString(999, 'Close Window')}
      </Button>
    </Flex>
  )
}

export default ApproveCakePage
