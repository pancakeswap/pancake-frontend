import { Route, SmartRouter } from '@pancakeswap/smart-router/evm'
import { useTranslation } from '@pancakeswap/localization'
import {
  Modal,
  ModalV2,
  QuestionHelper,
  Text,
  Flex,
  useTooltip,
  AutoColumn,
  UseModalV2Props,
  CurrencyLogo,
} from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { AtomBox } from '@pancakeswap/ui'
import { useMemo, memo } from 'react'

import { RoutingSettingsButton } from 'components/Menu/GlobalSettings/SettingsModal'
import { RouterBox, RouterPoolBox, RouterTypeText, CurrencyLogoWrapper } from 'views/Swap/components/RouterViewer'
import { v3FeeToPercent } from '../utils/exchange'

type Pair = [Currency, Currency]

interface Props extends UseModalV2Props {
  routes: Route[]
}

export const RouteDisplayModal = memo(function RouteDisplayModal({ isOpen, onDismiss, routes }: Props) {
  const { t } = useTranslation()
  return (
    <ModalV2 closeOnOverlayClick isOpen={isOpen} onDismiss={onDismiss} minHeight="0">
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
        style={{ minHeight: '0' }}
        bodyPadding="24px"
      >
        <AutoColumn gap="48px">
          {routes.map((route, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <RouteDisplay key={i} route={route} />
          ))}
          <RoutingSettingsButton />
        </AutoColumn>
      </Modal>
    </ModalV2>
  )
})

interface RouteDisplayProps {
  route: Route
}

export const RouteDisplay = memo(function RouteDisplay({ route }: RouteDisplayProps) {
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
            ? 'V2'
            : isV3Pool
            ? `V3 (${v3FeeToPercent(pool.fee).toSignificant(6)}%)`
            : t('StableSwap')
          const tooltipText = `${input.symbol}/${output.symbol}${
            isV3Pool ? ` (${v3FeeToPercent(pool.fee).toSignificant(6)}%)` : ''
          }`
          return (
            <PairNode pair={p} key={key} text={text} className={isV3Pool && 'highlight'} tooltipText={tooltipText} />
          )
        })
      : null

  return (
    <AutoColumn gap="24px">
      <RouterBox justifyContent="space-between" alignItems="center">
        <CurrencyLogoWrapper
          size={{
            xs: '32px',
            md: '48px',
          }}
          ref={targetRef}
        >
          <CurrencyLogo size="100%" currency={inputCurrency} />
          <RouterTypeText fontWeight="bold">{route.percent}%</RouterTypeText>
        </CurrencyLogoWrapper>
        {tooltipVisible && tooltip}
        {pairNodes}
        <CurrencyLogoWrapper
          size={{
            xs: '32px',
            md: '48px',
          }}
          ref={outputTargetRef}
        >
          <CurrencyLogo size="100%" currency={outputCurrency} />
        </CurrencyLogoWrapper>
        {outputTooltipVisible && outputTooltip}
      </RouterBox>
    </AutoColumn>
  )
})

function PairNode({
  pair,
  text,
  className,
  tooltipText,
}: {
  pair: Pair
  text: string
  className: string
  tooltipText: string
}) {
  const [input, output] = pair

  const tooltip = useTooltip(tooltipText)

  return (
    <RouterPoolBox className={className} ref={tooltip.targetRef}>
      {tooltip.tooltipVisible && tooltip.tooltip}
      <AtomBox
        size={{
          xs: '24px',
          md: '32px',
        }}
      >
        <CurrencyLogo size="100%" currency={input} />
      </AtomBox>
      <AtomBox
        size={{
          xs: '24px',
          md: '32px',
        }}
      >
        <CurrencyLogo size="100%" currency={output} />
      </AtomBox>
      <RouterTypeText>{text}</RouterTypeText>
    </RouterPoolBox>
  )
}
