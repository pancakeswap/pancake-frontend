import { useTranslation } from '@pancakeswap/localization'
import { InfoFilledIcon, Message, MessageText, Text } from '@pancakeswap/uikit'

export const NetWorkUpdateToDateDisplay = () => {
  const { t } = useTranslation()
  return (
    <Message variant="success" icon={<InfoFilledIcon color="#129E7D" />} style={{ padding: '8px' }}>
      <MessageText>
        <Text bold fontSize="14px" color="#129E7D">
          {t('The network selected is already up-to-date.')}
        </Text>
        <Text mt="4px" fontSize="14px" color="#129E7D">
          {t('Click “Sync” to proceed with syncing but please mind that gas cost is needed to sync.')}
        </Text>
      </MessageText>
    </Message>
  )
}
