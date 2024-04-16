import { useTranslation } from '@pancakeswap/localization'
import { Message, MessageText, Text } from '@pancakeswap/uikit'

export const SuccessMessage = () => {
  const { t } = useTranslation()

  return (
    <Message variant="success">
      <MessageText>
        <Text bold>{t('Congratulations, you won!')}</Text>
        <Text mt="4px" fontSize={['14px']} lineHeight={['20px']}>
          Please claim the reward until: 00:00, DD Month, YYYY, UTC+0
        </Text>
      </MessageText>
      {/* <MessageText>
        <Text bold>{t("You're eligible to participate!")}</Text>
        <Text mt="4px" fontSize={['14px']} lineHeight={['20px']}>
          Please wait until the {Distribution} starts
        </Text>
      </MessageText> */}
    </Message>
  )
}
