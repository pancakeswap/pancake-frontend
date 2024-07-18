import { useTranslation } from '@pancakeswap/localization'
import { Message, MessageText, Text } from '@pancakeswap/uikit'

interface MessageInfoProps {
  ableToClaimReward: boolean
  isQuestFinished: boolean
}

export const MessageInfo: React.FC<MessageInfoProps> = ({ ableToClaimReward, isQuestFinished }) => {
  const { t } = useTranslation()
  const isReachClaimTime = isQuestFinished

  if (isReachClaimTime && !ableToClaimReward) {
    return null
  }

  return (
    <>
      {!ableToClaimReward ? (
        <Message variant="primary">
          <MessageText>
            <Text bold>{t('Keep it going!')}</Text>
            <Text mt="4px" fontSize={['14px']} lineHeight={['20px']}>
              {t('Complete all the tasks to participate in Lucky Draw')}
            </Text>
          </MessageText>
        </Message>
      ) : (
        <Message variant="success">
          {isReachClaimTime ? (
            <MessageText>
              <Text bold>{t('Congratulations, you won!')}</Text>
              <Text mt="4px" fontSize={['14px']} lineHeight={['20px']}>
                {t('Please claim the reward until: %date%', { date: 'fake text 00:00, DD Month, YYYY, UTC+0' })}
              </Text>
            </MessageText>
          ) : (
            <MessageText>
              <Text bold>{t("You're eligible to participate!")}</Text>
              <Text mt="4px" fontSize={['14px']} lineHeight={['20px']}>
                {t('Please wait until the Quest starts')}
              </Text>
            </MessageText>
          )}
        </Message>
      )}
    </>
  )
}
