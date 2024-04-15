import { useTranslation } from '@pancakeswap/localization'
import { Message, MessageText, Text } from '@pancakeswap/uikit'

export const RemainMessage = () => {
  const { t } = useTranslation()

  return (
    <Message variant="primary">
      <MessageText>
        <Text bold>{t('Keep it going!')}</Text>
        <Text mt="4px" fontSize={['14px']} lineHeight={['20px']}>
          {t('Complete all the tasks to participate in Lucky Draw')}
        </Text>
      </MessageText>
    </Message>
  )
}
