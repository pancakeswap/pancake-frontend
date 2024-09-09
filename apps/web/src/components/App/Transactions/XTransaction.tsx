import { ModalV2, useModalV2, ChevronRightIcon } from '@pancakeswap/uikit'

import { useTranslation } from '@pancakeswap/localization'
import { useToken } from 'hooks/Tokens'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { XSwapTransactionDetailModal } from 'views/Swap/x/XSwapTransactionDetail'
import { GetXOrderReceiptResponseOrder } from 'views/Swap/x/api'
import {
  TransactionListItem,
  TransactionListItemDesc,
  TransactionListItemTitle,
  TransactionStatus,
} from '@pancakeswap/widgets-internal'

export function XTransaction({ order }: { order: GetXOrderReceiptResponseOrder }) {
  const { t } = useTranslation()
  const modal = useModalV2()
  const status = useMemo(() => {
    if (order.status === 'OPEN' || order.status === 'PENDING') {
      return TransactionStatus.Pending
    }
    if (order.status === 'FILLED') {
      return TransactionStatus.Success
    }
    return TransactionStatus.Failed
  }, [order.status])

  const inputToken = useToken(order.input.token)
  const outputToken = useToken(order.outputs[0].token)

  const text = useMemo(() => {
    const isExactOut = order.input.endAmount !== order.input.startAmount

    if (isExactOut) {
      return 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol%'
    }
    return 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol%'
  }, [order])

  if (!inputToken || !outputToken) {
    return null
  }

  return (
    <>
      <TransactionListItem
        onClick={modal.onOpen}
        status={status}
        title={<TransactionListItemTitle>PancakeSwap X</TransactionListItemTitle>}
        action={<ChevronRightIcon style={{ cursor: 'pointer' }} fontSize="1.25rem" onClick={modal.onOpen} />}
      >
        <TransactionListItemDesc>
          {t(text, {
            inputAmount: formatUnits(BigInt(order.input.endAmount), inputToken?.decimals),
            inputSymbol: inputToken?.symbol,
            outputAmount: formatUnits(BigInt(order.outputs[0].endAmount), outputToken?.decimals),
            outputSymbol: outputToken?.symbol,
          })}
        </TransactionListItemDesc>
      </TransactionListItem>
      <ModalV2 {...modal}>
        <XSwapTransactionDetailModal order={order} />
      </ModalV2>
    </>
  )
}
