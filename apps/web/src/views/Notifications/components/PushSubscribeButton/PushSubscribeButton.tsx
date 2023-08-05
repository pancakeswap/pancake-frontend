import { AutoColumn, CircleLoader, Flex, Text } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import { useTranslation } from '@pancakeswap/localization'

interface PushSubButtonProps {
  isUnsubscribing: boolean
  handleSubscriptionAction: (e: React.MouseEvent<HTMLButtonElement>) => void
  objectsAreEqual: boolean
}

export default function PushSubscriptionButton({
  isUnsubscribing,
  handleSubscriptionAction,
  objectsAreEqual
}: PushSubButtonProps) {
  const { t } = useTranslation()
  return (
    <AutoColumn gap="md" marginTop="6px">
      <CommitButton
        variant="primary"
        onClick={handleSubscriptionAction}
        isLoading={isUnsubscribing}
        height="55px"
      >
        { objectsAreEqual ? (<Flex alignItems="center">
          <Text px="4px" fontWeight="bold" color="white">
            {isUnsubscribing ?  t('unSubscribing'): t('Unsubscribe')}
          </Text>
          {isUnsubscribing ?  <CircleLoader stroke="white" /> : null}
        </Flex>) :
        (
          <Flex alignItems="center">
          <Text px="4px" fontWeight="bold" color="white">
            {isUnsubscribing ?  t('Updating'): t('Update Preferences')}
          </Text>
          {isUnsubscribing ?  <CircleLoader stroke="white" /> : null}
        </Flex>
        )}
      </CommitButton>
    </AutoColumn>
  )
}
