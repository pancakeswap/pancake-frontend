import { useTranslation } from '@pancakeswap/localization'
import { Flex, InfoFilledIcon, Text } from '@pancakeswap/uikit'
import { useSubscription } from '@web3inbox/react'
import { useInitializeNotifications } from 'hooks/useInitializeNotifications'
import { useCallback, useMemo } from 'react'
import BuyCryptoTooltip from '../Tooltip/Tooltip'

interface EnableNotificationsProps {
  setShowNotificationsPopOver: (s: boolean) => void
  showNotificationsPopOver: boolean
}
const EnableNotificationsTooltip = ({
  setShowNotificationsPopOver,
  showNotificationsPopOver,
}: EnableNotificationsProps) => {
  const { t } = useTranslation()
  const { isReady } = useInitializeNotifications()
  const { data: subscription } = useSubscription()

  const isSubscribed = useMemo(() => Boolean(subscription && isReady), [subscription, isReady])

  const toggleNotificationsMenu = useCallback(() => {
    setShowNotificationsPopOver(true)
  }, [setShowNotificationsPopOver])

  if (isSubscribed && !showNotificationsPopOver) return null

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
              'By Subscribing to PancakeSwap Notifications you will be able to receive updates on your buy crypto purchases',
            )}
          </Text>
        }
        tooltipBody={<InfoFilledIcon pl="4px" pt="2px" width={17} opacity={0.6} />}
      />
    </Flex>
  )
}

export default EnableNotificationsTooltip
