import { AutoColumn, CircleLoader, Flex, Text } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import { ReactNode } from 'react'
import { useTranslation } from '@pancakeswap/localization'

interface PushSubButtonProps {
  isSubscribing: boolean
  isUnsubscribing: boolean
  isSubscribed: boolean
  handleSubscriptionAction: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function PushSubscriptionButton({
  isSubscribing,
  isUnsubscribing,
  isSubscribed,
  handleSubscriptionAction,
}: PushSubButtonProps) {
  const { t } = useTranslation()

  let buttonText: ReactNode | string = t('Enable (Subscribe in wallet)')
  if (isSubscribing) {
    buttonText = (
      <>
        <Flex alignItems="center">
          <Text px="4px" fontWeight="bold" color="white">
            {t('Subscribing')}
          </Text>
          <CircleLoader stroke="white" />
        </Flex>
      </>
    )
  }
  if (isUnsubscribing) {
    buttonText = (
      <>
        <Flex alignItems="center">
          <Text px="4px" fontWeight="bold" color="white">
            {t('unSubscribing')}
          </Text>
          <CircleLoader stroke="white" />
        </Flex>
      </>
    )
  }
  if (isSubscribed) {
    buttonText = (
      <>
        <Flex alignItems="center">
          <Text px="4px" fontWeight="bold" color="white">
            {t('Unsubscribe')}
          </Text>
        </Flex>
      </>
    )
  }
  return (
    <AutoColumn gap="md" marginTop="6px">
      <CommitButton
        variant="primary"
        onClick={handleSubscriptionAction}
        //   disabled={Boolean(errorText)}
        isLoading={isSubscribing || isUnsubscribing}
        height="55px"
      >
        {buttonText}
      </CommitButton>
    </AutoColumn>
  )
}
