import { useTranslation } from '@pancakeswap/localization'
import { Message, MessageText, Text } from '@pancakeswap/uikit'
import { GetMerkleProofResponse } from 'views/Quest/components/Reward'

interface MessageInfoProps {
  ableToClaimReward: boolean
  isQuestFinished: boolean
  isTasksCompleted: boolean
  proofData: null | GetMerkleProofResponse
}

export const MessageInfo: React.FC<MessageInfoProps> = ({
  proofData,
  ableToClaimReward,
  isTasksCompleted,
  isQuestFinished,
}) => {
  const { t } = useTranslation()
  const isReachClaimTime = isQuestFinished

  if (isReachClaimTime && !isTasksCompleted) {
    return null
  }

  return (
    <>
      {!isQuestFinished && !isTasksCompleted && (
        <Message variant="success">
          <MessageText>
            <Text bold>{t("Let's go!")}</Text>
            <Text mt="4px" fontSize={['14px']} lineHeight={['20px']}>
              {t('Complete all tasks and stand a change to win the above reward in a lucky draw.')}
            </Text>
          </MessageText>
        </Message>
      )}

      {!isQuestFinished && isTasksCompleted && (
        <Message variant="success">
          <MessageText>
            <Text bold>{t("You're eligible to participate!")}</Text>
            <Text mt="4px" fontSize={['14px']} lineHeight={['20px']}>
              {t('Please wait until the lucky draw starts')}
            </Text>
          </MessageText>
        </Message>
      )}

      {isQuestFinished && isTasksCompleted && !ableToClaimReward && proofData !== null && (
        <Message variant="success">
          <MessageText>
            <Text bold>{t('Quest is over')}</Text>
            <Text mt="4px" fontSize={['14px']} lineHeight={['20px']}>
              {t('Rewards have been distributed to the winners')}
            </Text>
          </MessageText>
        </Message>
      )}

      {isQuestFinished && ableToClaimReward && proofData !== null && (
        <Message variant="success">
          <MessageText>
            <Text bold>{t('Congratulations, you won!')}</Text>
            <Text mt="4px" fontSize={['14px']} lineHeight={['20px']}>
              {t('Please claim the reward')}
            </Text>
          </MessageText>
        </Message>
      )}
    </>
  )
}
