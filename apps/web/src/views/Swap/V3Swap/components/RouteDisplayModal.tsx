import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Route, SmartRouter } from '@pancakeswap/smart-router'
import {
  AtomBox,
  AutoColumn,
  Flex,
  Modal,
  ModalV2,
  QuestionHelper,
  Text,
  UseModalV2Props,
  useTooltip,
} from '@pancakeswap/uikit'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { memo, useMemo } from 'react'

import { RoutingSettingsButton } from 'components/Menu/GlobalSettings/SettingsModalV2'
import { CurrencyLogoWrapper, RouterBox, RouterPoolBox, RouterTypeText } from 'views/Swap/components/RouterViewer'
import { v3FeeToPercent } from '../utils/exchange'

type Pair = [Currency, Currency]

export type RouteDisplayEssentials = Pick<Route, 'path' | 'pools' | 'inputAmount' | 'outputAmount' | 'percent'>

interface Props extends UseModalV2Props {
  routes: RouteDisplayEssentials[]
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
  route: RouteDisplayEssentials
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
          const isV4ClPool = SmartRouter.isV4ClPool(pool)
          const isV4BinPool = SmartRouter.isV4BinPool(pool)
          const isV4Pool = isV4BinPool || isV4ClPool
          const isV3Pool = SmartRouter.isV3Pool(pool)
          const isV2Pool = SmartRouter.isV2Pool(pool)
          const key = isV2Pool
            ? `v2_${pool.reserve0.currency.symbol}_${pool.reserve1.currency.symbol}`
            : SmartRouter.isStablePool(pool) || isV3Pool
            ? pool.address
            : isV4Pool
            ? pool.id
            : undefined
          if (!key) return null
          const feeDisplay = isV3Pool || isV4Pool ? v3FeeToPercent(pool.fee).toSignificant(6) : ''
          const text = isV2Pool
            ? 'V2'
            : isV3Pool
            ? `V3 (${feeDisplay}%)`
            : isV4ClPool
            ? `V4CL (${feeDisplay}%)`
            : isV4BinPool
            ? `V4Bin (${feeDisplay}%)`
            : t('StableSwap')
          const tooltipText = `${input.symbol}/${output.symbol}${isV3Pool || isV4Pool ? ` (${feeDisplay}%)` : ''}`
          return (
            <PairNode
              pair={p}
              key={key}
              text={text}
              className={isV4Pool || isV3Pool ? 'highlight' : ''}
              tooltipText={tooltipText}
            />
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
          <RouterTypeText fontWeight="bold">{Math.round(route.percent)}%</RouterTypeText>
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
