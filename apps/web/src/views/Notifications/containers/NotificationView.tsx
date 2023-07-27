import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, CircleLoader, Flex, FlexGap, OptionProps, Text, useToast } from '@pancakeswap/uikit'
import Divider from 'components/Divider'
import Image from 'next/image'
import { useCallback, useMemo, useState } from 'react'
import NotificationsFilter from '../components/NotificationsFilter/NotificationaFilter'
import { NotificationContainer } from '../components/Settingsitem/SettingsItem'

const EmptyView = () => {
  const { t } = useTranslation()

  return (
    <>
      <Flex alignItems="center" justifyContent="center" height="140px" onClick={() => null}>
        <Image src="/Group883379635.png" alt="#" height={100} width={100} />
      </Flex>

      <FlexGap rowGap="16px" flexDirection="column" justifyContent="center" alignItems="center">
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

const SettingsModal = ({
  transactions,
  account,
  fetchTxs,
}: {
  transactions: any
  account: string
  fetchTxs: () => Promise<void>
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [sortOptionsType, setSortOptionsType] = useState<string>('All')
  const [notificationType, setNotificationType] = useState<string>('All')
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()

  const handleNotifyOptionChange = useCallback((option: OptionProps) => {
    setNotificationType(option.value)
  }, [])

  const handleSortOptionChange = useCallback((option: OptionProps) => {
    setSortOptionsType(option.value)
  }, [])

  const removeNotification = useCallback(
    async (ids: number[]) => {
      setLoading(true)
      try {
        if (ids.length > 0) {
          const unsubscribeRawRes = await fetch('http://localhost:8000/delete', {
            method: 'POST',
            body: JSON.stringify({
              account,
              ids,
            }),
            headers: {
              'content-type': 'application/json',
            },
          })
          const unsubscribeRes = await unsubscribeRawRes.json()
          const isSuccess = unsubscribeRes.success
          if (!isSuccess) {
            throw new Error('Failed to unsubscribe!')
          }
          await fetchTxs()

          setLoading(false)
          toastSuccess(`${t('Success')}!`, <Text>{t('Notification(s) have been cleared')}</Text>, 'left')
        } else setLoading(false)
      } catch (error) {
        setLoading(false)
        toastError(
          `${t('Something went wrong')}!`,
          <Text>{t('An unknown error occured while deleting your notification')}</Text>,
          'left',
        )
      }
    },
    [toastSuccess, toastError, account, t, fetchTxs],
  )

  const removeAllNotifications = useCallback(async () => {
    const ids = transactions.map((transaction) => {
      const extractedType = transaction.type.split(' ')[0]
      if (extractedType === notificationType || notificationType === 'All') return transaction.id
      return null
    })
    await removeNotification(ids)
  }, [notificationType, transactions, removeNotification])

  const filteredNotifications: any = useMemo(() => {
    const sortFarms = (notifications: any[]): any[] => {
      switch (notificationType) {
        case 'All':
          // @ts-ignore
          return notifications.filter(() => true)
        case 'Liquidity':
          return notifications.filter((notification: any) => {
            const extractedType = notification.type.split(' ')[0]
            return extractedType === 'Liquidity'
          })
        case 'Staking':
          return notifications.filter((notification: any) => {
            const extractedType = notification.type.split(' ')[0]
            return extractedType === 'Staking'
          })
        case 'Pools':
          return notifications.filter((notification: any) => {
            const extractedType = notification.type.split(' ')[0]
            return extractedType === 'Pools'
          })
        case 'Farms':
          return notifications.filter((notification: any) => {
            const extractedType = notification.type.split(' ')[0]
            return extractedType === 'Farms'
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
        <NotificationsFilter setNotifyFilterType={handleNotifyOptionChange} setSortType={handleSortOptionChange} />
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
      <Divider />
      <Box maxHeight="406px" overflowY="scroll" paddingX="16px">
        {filteredNotifications.length > 0 ? (
          <NotificationContainer
            transactions={filteredNotifications}
            sortOptionsType={sortOptionsType}
            removeNotification={removeNotification}
          />
        ) : (
          <EmptyView />
        )}
      </Box>
    </Box>
  )
}

export default SettingsModal
