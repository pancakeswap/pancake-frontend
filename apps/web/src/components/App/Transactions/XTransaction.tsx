import { ModalV2, useModalV2, ChevronRightIcon, Text, FlexGap } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'
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
import { useCountdown } from '@pancakeswap/hooks'
import dayjs from 'dayjs'

export function XTransaction({ order }: { order: GetXOrderReceiptResponseOrder }) {
  const { t } = useTranslation()
  const modal = useModalV2()
  const status = useMemo(() => {
    if (order.status === 'OPEN') {
      return TransactionStatus.Pending
    }
    if ((order.status === 'PENDING' && order.transactionHash) || order.status === 'FILLED') {
      return TransactionStatus.Success
    }
    return TransactionStatus.Failed
  }, [order.status, order.transactionHash])

  const inputToken = useCurrency(order.input.token)
  const outputToken = useCurrency(order.outputs[0].token)

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
        action={
          <FlexGap gap="0.25rem" justifyContent="flex-end">
            {status === TransactionStatus.Pending ? <Countdown to={order.deadline} /> : null}
            <ChevronRightIcon style={{ cursor: 'pointer' }} fontSize="1.25rem" onClick={modal.onOpen} />
          </FlexGap>
        }
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

function Countdown({ to }: { to?: number | string }) {
  const countdown = useCountdown(dayjs(to).unix())

  if (!countdown) {
    return null
  }
  return (
    <Text mr="0.25rem">
      {String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
    </Text>
  )
}
