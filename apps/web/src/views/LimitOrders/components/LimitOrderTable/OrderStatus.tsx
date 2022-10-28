import { Tag, Text, TagVariant } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import React from 'react'
import { FormattedOrderData } from 'views/LimitOrders/hooks/useFormattedOrderData'

export enum StatusElementType {
  TAG = 'Tag',
  TEXT = 'Text',
}

const StatusElement: React.FC<
  React.PropsWithChildren<{ element: StatusElementType; text: string; color: TagVariant }>
> = ({ element, text, color }) => {
  if (element === StatusElementType.TAG) {
    return (
      <Tag outline scale="sm" variant={color} ml="auto">
        {text}
      </Tag>
    )
  }
  return <Text color={color}>{text}</Text>
}

const OrderStatus: React.FC<
  React.PropsWithChildren<{
    formattedOrder: FormattedOrderData
    showOpenTag?: boolean
    element?: StatusElementType
  }>
> = ({ formattedOrder, showOpenTag = false, element = StatusElementType.TAG }) => {
  const { t } = useTranslation()
  const { isOpen, isSubmissionPending, isCancelled, isCancellationPending, isExecuted } = formattedOrder
  if (isOpen && !isSubmissionPending && showOpenTag) {
    return <StatusElement element={element} text={t('Open')} color="success" />
  }
  if (isOpen && isSubmissionPending) {
    return <StatusElement element={element} text={t('Pending')} color="warning" />
  }
  if (isCancelled && !isCancellationPending) {
    return <StatusElement element={element} text={t('Cancelled')} color="failure" />
  }
  if (isCancellationPending) {
    return <StatusElement element={element} text={t('Cancelling')} color="warning" />
  }
  if (isExecuted) {
    return <StatusElement element={element} text={t('Filled')} color="success" />
  }
  return null
}

export default OrderStatus
