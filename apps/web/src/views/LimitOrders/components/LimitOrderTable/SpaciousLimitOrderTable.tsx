import { memo } from 'react'
import { Table, Th, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import FullRow from './FullRow'

const SpaciousLimitOrderTable = ({ orders }) => {
  const { t } = useTranslation()

  return (
    <Table>
      <>
        <thead>
          <tr>
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                {t('From')}
              </Text>
            </Th>
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                {t('To')}
              </Text>
            </Th>
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                {t('Limit Price')}
              </Text>
            </Th>
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                {t('Status')}
              </Text>
            </Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <FullRow key={order.id} order={order} />
          ))}
        </tbody>
      </>
    </Table>
  )
}

export default memo(SpaciousLimitOrderTable)
