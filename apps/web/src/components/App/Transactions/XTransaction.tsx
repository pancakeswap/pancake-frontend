import { AutoColumn, InfoFilledIcon, ModalV2, Text, useModalV2 } from '@pancakeswap/uikit'

import { useTranslation } from '@pancakeswap/localization'
import { useToken } from 'hooks/Tokens'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { XSwapTransactionDetailModal } from 'views/Swap/x/XSwapTransactionDetail'
import { GetXOrderReceiptResponseOrder } from 'views/Swap/x/api'
import { TransactionWrapper } from './Transaction'

export function XTransaction({ order }: { order: GetXOrderReceiptResponseOrder }) {
  const { t } = useTranslation()
  const modal = useModalV2()
  const pending = order.status === 'OPEN' || order.status === 'PENDING'
  const success = order.status === 'FILLED'

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
      <TransactionWrapper pending={pending} success={success}>
        <AutoColumn width="100%" role="button" onClick={modal.onOpen}>
          <Text>
            {t(text, {
              inputAmount: formatUnits(BigInt(order.input.endAmount), inputToken?.decimals),
              inputSymbol: inputToken?.symbol,
              outputAmount: formatUnits(BigInt(order.outputs[0].endAmount), outputToken?.decimals),
              outputSymbol: outputToken?.symbol,
            })}
          </Text>
          <Text bold color="primary">
            PancakeSwap X
          </Text>
        </AutoColumn>
        <InfoFilledIcon color="primary" />
      </TransactionWrapper>
      <ModalV2 {...modal}>
        <XSwapTransactionDetailModal order={order} />
      </ModalV2>
    </>
  )
}
