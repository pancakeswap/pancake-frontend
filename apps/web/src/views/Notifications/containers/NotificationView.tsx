import { useTranslation } from '@pancakeswap/localization'
import {
  AutoRow,
  Box,
  Button,
  CircleLoader,
  Flex,
  FlexGap,
  OptionProps,
  Select,
  Text,
  useToast,
} from '@pancakeswap/uikit'
import { PushClientTypes } from '@walletconnect/push-client'
import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NotificationFilterTypes, NotificationSortTypes } from 'views/Notifications/constants'
import { FilterContainer, LabelWrapper, NotificationContainerStyled } from 'views/Notifications/styles'
import NotificationItem from '../components/NotificationItem/NotificationItem'

const EmptyView = () => {
  const { t } = useTranslation()

  return (
    <>
      <Flex paddingX="26px" alignItems="center" justifyContent="center" height="140px" onClick={() => null}>
        <Image src="/Group883379635.png" alt="#" height={100} width={100} />
      </Flex>

      <FlexGap paddingX="26px" rowGap="16px" flexDirection="column" justifyContent="center" alignItems="center">
        <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
          {t('All Set')}
        </Text>
        <Text fontSize="16px" textAlign="center" color="textSubtle">
          {t(
            'Any notifications that you recieve will appear here. you willl also recieve moblile notification on your mobile wallet.',
          )}
        </Text>
      </FlexGap>
    </>
  )
}

const SettingsModal = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [sortOptionsType, setSortOptionsType] = useState<string>('All')
  const [notificationType, setNotificationType] = useState<string>('All')
  const { toastSuccess } = useToast()
  const [transactions, setTransactions] = useState<PushClientTypes.PushMessageRecord[]>([])
  const { pushClient, activeSubscriptions, getMessageHistory, currentSubscription } = useWalletConnectPushClient()

  const { t } = useTranslation()
  // console.log(currentSubscription)
  const updateMessages = useCallback(async () => {
    if (pushClient && currentSubscription?.topic) {
      try {
        const messageHistory = await getMessageHistory({ topic: currentSubscription?.topic })
        setTransactions(Object.values(messageHistory))
      } catch (error) {
        //
      }
    } else setTransactions([])
  }, [setTransactions, pushClient, getMessageHistory, currentSubscription?.topic])

  useEffect(() => {
    if (!pushClient || !currentSubscription?.topic) return
    updateMessages()
  }, [updateMessages, pushClient, currentSubscription?.topic, activeSubscriptions])

  const handleNotifyOptionChange = useCallback((option: OptionProps) => {
    setNotificationType(option.value)
  }, [])

  const handleSortOptionChange = useCallback((option: OptionProps) => {
    setSortOptionsType(option.value)
  }, [])

  const removeNotification = useCallback(
    async (id: number) => {
      setLoading(true)
      pushClient?.deletePushMessage?.({ id: Number(id) })
      updateMessages()
      setLoading(false)
      toastSuccess(`${t('Success')}!`, <Text>{t('Notification(s) have been cleared')}</Text>)
    },
    [toastSuccess, t, pushClient, updateMessages],
  )

  const removeAllNotifications = useCallback(async () => {
    transactions.forEach((transaction) => {
      removeNotification(transaction.id)
    })
  }, [transactions, removeNotification])

  const filteredNotifications: any = useMemo(() => {
    const sortFarms = (notifications: any[]): any[] => {
      switch (notificationType) {
        case 'All':
          // @ts-ignore
          return notifications.filter(() => true)
        case 'Liquidity':
          return notifications.filter((notification: PushClientTypes.PushMessageRecord) => {
            const extractedType = notification.message.type
            return extractedType === 'Liquidity'
          })
        case 'Staking':
          return notifications.filter((notification: PushClientTypes.PushMessageRecord) => {
            const extractedType = notification.message.type
            return extractedType === 'Staking'
          })
        case 'Pools':
          return notifications.filter((notification: PushClientTypes.PushMessageRecord) => {
            const extractedType = notification.message.type
            return extractedType === 'Pools'
          })
        case 'Farms':
          return notifications.filter((notification: PushClientTypes.PushMessageRecord) => {
            const extractedType = notification.message.type
            return extractedType === 'Farms'
          })
        case 'alerts':
          return notifications.filter((notification: PushClientTypes.PushMessageRecord) => {
            const extractedType = notification.message.type
            return extractedType === 'alerts'
          })
        default:
          return notifications
      }
    }
    return sortFarms(transactions)
  }, [transactions, notificationType])

  return (
    <Box paddingBottom="24px">
      <Flex alignItems="center" paddingX="24px">
        <AutoRow gap="12px" marginTop="8px" marginBottom="16px" marginRight="8px">
          <FilterContainer>
            <LabelWrapper style={{ width: '120px' }}>
              <Text textTransform="uppercase" mb="4px" ml="4px">
                {t('Filter by type')}
              </Text>
              <Select onOptionChange={handleNotifyOptionChange} options={NotificationFilterTypes} />
            </LabelWrapper>
          </FilterContainer>
          <FilterContainer>
            <LabelWrapper style={{ width: '100px' }}>
              <Text textTransform="uppercase" mb="4px" ml="4px">
                {t('Sort by date')}
              </Text>
              <Select onOptionChange={handleSortOptionChange} options={NotificationSortTypes} />
            </LabelWrapper>
          </FilterContainer>
        </AutoRow>
        <Button
          marginTop="13px"
          height="40px"
          maxWidth="95px"
          variant="primary"
          onClick={removeAllNotifications}
          disabled={loading}
          isLoading={loading}
        >
          <Flex alignItems="center">
            <Text px="4px" fontWeight="bold" color="white">
              {t('Clear')}
            </Text>
            {loading ? <CircleLoader stroke="white" /> : null}
          </Flex>
        </Button>
      </Flex>
      <Box maxHeight="360px" overflowY="scroll">
        <NotificationContainerStyled>
          {filteredNotifications.length > 0 ? (
            <NotificationItem
              transactions={filteredNotifications}
              sortOptionsType={sortOptionsType}
              removeNotification={removeNotification}
            />
          ) : (
            <EmptyView />
          )}
        </NotificationContainerStyled>
      </Box>
    </Box>
  )
}

export default SettingsModal
