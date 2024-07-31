import { useTranslation } from '@pancakeswap/localization'
import { Flex, InfoFilledIcon, Text } from '@pancakeswap/uikit'
import { useWebNotificationsToggle } from 'components/Menu/GlobalSettings/WebNotiToggle'
import { useCallback } from 'react'
import { useNotificationMenuToggle } from 'state/notifications/hooks'
import BuyCryptoTooltip from '../Tooltip/Tooltip'

const EnableNotificationsTooltip = () => {
  const { t } = useTranslation()

  const { globalToggle, setGlobalToggle } = useNotificationMenuToggle()
  const { allowNotifications, isSubscribed, toggle } = useWebNotificationsToggle()

  console.log(globalToggle)
  const toggleNotificationsMenu = useCallback(() => {
    if (!allowNotifications) toggle()
    console.log('hhhhmmm')
    setGlobalToggle(true)
  }, [setGlobalToggle, allowNotifications, toggle])

  if (isSubscribed) return null
  return (
    <Flex alignItems="center" justifyContent="center" mb="2px">
      <Text
        bold
        as="span"
        fontSize="15px"
        color="primary"
        style={{ cursor: 'pointer' }}
        onClick={toggleNotificationsMenu}
      >
        {t('Click here')}
      </Text>
      <Text as="span" pl="4px" color="textSubtle" fontSize="15px">
        {t('to enable update notifications')}
      </Text>

      <BuyCryptoTooltip
        tooltipContent={
          <Text as="p">
            {t(
              'By Subscribing to PancakeSwap Notifications you will be able to recieve updates on your buy crypto purchases',
            )}
          </Text>
        }
        tooltipBody={<InfoFilledIcon pl="4px" pt="2px" width={17} opacity={0.6} />}
      />
    </Flex>
  )
}

export default EnableNotificationsTooltip
