import React, { useState } from 'react'
import { AutoRenewIcon, Button, Checkbox, Flex, InjectedModalProps, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useDispatch } from 'react-redux'
import { useProfile, useToast } from 'state/hooks'
import { fetchProfile } from 'state/profile'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import { getBalanceNumber } from 'utils/formatBalance'
import { useProfile as useProfileContract } from 'hooks/useContract'
import { useWallet } from '@binance-chain/bsc-use-wallet'

type PauseProfilePageProps = InjectedModalProps

const PauseProfilePage: React.FC<PauseProfilePageProps> = ({ onDismiss }) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const { profile } = useProfile()
  const { numberCakeToReactivate } = useGetProfileCosts()
  const TranslateString = useI18n()
  const pancakeProfileContract = useProfileContract()
  const { account } = useWallet()
  const { toastSuccess, toastError } = useToast()
  const dispatch = useDispatch()

  const handleChange = () => setIsAcknowledged(!isAcknowledged)

  const handleDeactivateProfile = () => {
    pancakeProfileContract.methods
      .pauseProfile()
      .send({ from: account })
      .on('sending', () => {
        setIsConfirming(true)
      })
      .on('receipt', async () => {
        // Re-fetch profile
        await dispatch(fetchProfile(account))
        toastSuccess('Profile Paused!')

        onDismiss()
      })
      .on('error', (error) => {
        toastError('Error', error?.message)
        setIsConfirming(false)
      })
  }

  if (!profile) {
    return null
  }

  return (
    <>
      <Text as="p" color="failure" mb="24px">
        {TranslateString(999, 'This will suspend your profile and send your Collectible back to your wallet')}
      </Text>
      <Text as="p" color="textSubtle" mb="24px">
        {TranslateString(
          999,
          "While your profile is suspended, you won't be able to earn points, but your achievements and points will stay associated with your profile",
        )}
      </Text>
      <Text as="p" color="textSubtle" mb="24px">
        {TranslateString(999, `Cost to reactivate in future: ${getBalanceNumber(numberCakeToReactivate)} CAKE`)}
      </Text>
      <label htmlFor="acknowledgement" style={{ cursor: 'pointer', display: 'block', marginBottom: '24px' }}>
        <Flex alignItems="center">
          <Checkbox id="acknowledgement" checked={isAcknowledged} onChange={handleChange} scale="sm" />
          <Text ml="8px">{TranslateString(999, 'I understand')}</Text>
        </Flex>
      </label>
      <Button
        fullWidth
        isLoading={isConfirming}
        endIcon={isConfirming ? <AutoRenewIcon spin color="currentColor" /> : null}
        disabled={!isAcknowledged || isConfirming}
        onClick={handleDeactivateProfile}
        mb="8px"
      >
        {TranslateString(999, 'Confirm')}
      </Button>
      <Button variant="text" fullWidth onClick={onDismiss}>
        {TranslateString(999, 'Close Window')}
      </Button>
    </>
  )
}

export default PauseProfilePage
