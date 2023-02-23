import { Route, SmartRouter } from '@pancakeswap/smart-router/evm'
import { useTranslation } from '@pancakeswap/localization'
import { Modal, ModalV2, QuestionHelper, Text, Flex, useTooltip } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'

import { CurrencyLogo } from 'components/Logo'
import { RouterBox, RouterPoolBox, RouterTypeText, CurrencyLogoWrapper } from 'views/Swap/components/RouterViewer'
import { useMemo } from 'react'
import { v3FeeToPercent } from '../utils/exchange'

type Pair = [Currency, Currency]

interface Props {
  open?: boolean
  onClose?: () => void
  route: Route
}

export function RouteDisplayModal({
  open = false,
  onClose = () => {
    // default
  },
  route,
}: Props) {
  const { t } = useTranslation()
  return (
    <ModalV2 closeOnOverlayClick isOpen={open} onDismiss={onClose} minHeight="0">
      <Modal
        title={
          <Flex justifyContent="center">
            {t('Route')}{' '}
            <QuestionHelper
              text={t('Routing through these tokens resulted in the best price for your trade.')}
              ml="4px"
              placement="top-start"
            />
          </Flex>
        }
        onDismiss={onClose}
        style={{ minHeight: '0' }}
        bodyPadding="24px 24px 48px"
      >
        <RouteDisplay route={route} />
      </Modal>
    </ModalV2>
  )
}

interface RouteDisplayProps {
  route: Route
}

export function RouteDisplay({ route }: RouteDisplayProps) {
  const { t } = useTranslation()
  const { path, pools, inputAmount, outputAmount } = route
  const { currency: inputCurrency } = inputAmount
  const { currency: outputCurrency } = outputAmount
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<Text>{inputCurrency.symbol}</Text>, {
    placement: 'right',
  })
  const {
    targetRef: outputTargetRef,
    tooltip: outputTooltip,
    tooltipVisible: outputTooltipVisible,
  } = useTooltip(<Text>{outputCurrency.symbol}</Text>, {
    placement: 'right',
  })

  const pairs = useMemo<Pair[]>(() => {
    if (path.length <= 1) {
      return []
    }

    const currencyPairs: Pair[] = []
    for (let i = 0; i < path.length - 1; i += 1) {
      currencyPairs.push([path[i], path[i + 1]])
    }
    return currencyPairs
  }, [path])

  const pairNodes =
    pairs.length > 0
      ? pairs.map((p, index) => {
          const [input, output] = p
          const pool = pools[index]
          const isV3Pool = SmartRouter.isV3Pool(pool)
          const isV2Pool = SmartRouter.isV2Pool(pool)
          const key = isV2Pool ? `v2_${pool.reserve0.currency.symbol}_${pool.reserve1.currency.symbol}` : pool.address
          const text = isV2Pool
            ? t('V2')
            : isV3Pool
            ? `${t('V3')} (${v3FeeToPercent(pool.fee).toSignificant(6)}%)`
            : t('StableSwap')
          return (
            <RouterPoolBox key={key} className={isV3Pool && 'highlight'}>
              <CurrencyLogo size="32px" currency={input} />
              <CurrencyLogo size="32px" currency={output} />
              <RouterTypeText>{text}</RouterTypeText>
            </RouterPoolBox>
          )
        })
      : null

  return (
    <RouterBox justifyContent="space-between" alignItems="center">
      <CurrencyLogoWrapper ref={targetRef}>
        <CurrencyLogo size="44px" currency={inputCurrency} />
      </CurrencyLogoWrapper>
      {tooltipVisible && tooltip}
      {pairNodes}
      <CurrencyLogoWrapper ref={outputTargetRef}>
        <CurrencyLogo size="44px" currency={outputCurrency} />
      </CurrencyLogoWrapper>
      {outputTooltipVisible && outputTooltip}
    </RouterBox>
  )
}
