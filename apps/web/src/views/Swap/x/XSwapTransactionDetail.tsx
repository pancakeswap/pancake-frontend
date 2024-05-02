import { useCountdown } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { CheckmarkCircleIcon, CircleLoader, Column, ErrorIcon, Flex, Modal, RowBetween, Text } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import dayjs from 'dayjs'
import { useToken } from 'hooks/Tokens'
import { formatUnits } from 'viem'
import { GetXOrderReceiptResponseOrder } from './api'

export function XSwapTransactionDetailModal({ order }: { order: GetXOrderReceiptResponseOrder }) {
  const { t } = useTranslation()

  const inputToken = useToken(order.input.token)
  const outputToken = useToken(order.outputs[0].token)

  const pending = order.status === 'OPEN' || order.status === 'PENDING'
  const filled = order.status === 'FILLED'
  const expired = order.status === 'EXPIRED'
  const isExactOut = order.input.endAmount !== order.input.startAmount

  return (
    <Modal title={t('PancakeSwap X Order')}>
      <Column justifyContent="center" textAlign="center" gap="24px">
        <Column justifyContent="center" textAlign="center" gap="12px">
          <Flex justifyContent="center">
            {filled && <CheckmarkCircleIcon width={50} height={50} color="success" />}
            {pending && <CircleLoader size="50px" />}
            {expired && <ErrorIcon width={50} height={50} color="failure" />}
          </Flex>
          {filled && (
            <Text bold fontSize="16px">
              {t('Order Filled')}
            </Text>
          )}
          {pending && (
            <Text bold fontSize="16px">
              {t('Order pending to filled')}
            </Text>
          )}
          {expired && (
            <Text bold fontSize="16px">
              {t('Failed to fill the order')}
            </Text>
          )}
          {pending && (
            <Column>
              <Text color="textSubtle" fontSize="12px">
                <RemainingTime deadline={order.deadline} />
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {t('Unfilled orders will automatically expires after the countdown.')}
              </Text>
            </Column>
          )}
          {filled && (
            <Column>
              <Text color="textSubtle" fontSize="12px">
                {t('Order has been successfully filled.')}
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {t('Output tokens have been sent to your wallet.')}
              </Text>
            </Column>
          )}
          {expired && (
            <Text color="textSubtle" fontSize="12px">
              {t(
                'We are having some trouble filling your order. Please retry.No gas cost or fee will be charged on failed orders.',
              )}
            </Text>
          )}
        </Column>
        {inputToken && outputToken && (
          <LightGreyCard>
            <RowBetween alignItems="center" mb="8px">
              <Text fontSize="14px">{t('Input')}</Text>
              <Text fontSize="14px">{inputToken?.symbol}</Text>
            </RowBetween>
            <RowBetween alignItems="center" mb="8px">
              <Text fontSize="14px">{t('Output')}</Text>
              <Text fontSize="14px">{outputToken?.symbol}</Text>
            </RowBetween>
            <RowBetween alignItems="center" mb="8px">
              <Text fontSize="14px">{!isExactOut ? t('Minimum received') : t('Maximum sold')}</Text>
              <Text fontSize="14px">
                {!isExactOut
                  ? formatUnits(BigInt(order.outputs[0].endAmount), outputToken?.decimals)
                  : formatUnits(BigInt(order.input.endAmount), inputToken?.decimals)}
                {isExactOut ? inputToken?.symbol : outputToken?.symbol}
              </Text>
            </RowBetween>
          </LightGreyCard>
        )}
      </Column>
    </Modal>
  )
}

function RemainingTime({ deadline }: { deadline: string }) {
  const { t } = useTranslation()
  const countdown = useCountdown(dayjs(deadline).unix())

  if (!countdown) {
    return null
  }

  return t('%time% remaining', { time: `${countdown.minutes}:${countdown.seconds}` })
}
