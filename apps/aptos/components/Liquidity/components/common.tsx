import React from 'react'
import { Percent, CurrencyAmount, Price } from '@pancakeswap/aptos-swap-sdk'
import { Currency } from '@pancakeswap/swap-sdk-core'

import {
  Text,
  useTooltip,
  TooltipText,
  Box,
  Flex,
  Svg,
  SvgProps,
  AutoColumn,
  RowBetween,
  AutoRow,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { getLPSymbol } from 'utils/getLpSymbol'
import styled from 'styled-components'
import { GreyCard } from 'components/Card'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { useUserSlippage } from 'state/user'
import formatAmountDisplay from 'utils/formatAmountDisplay'

import { CurrencySelectorValue } from '../hooks/useCurrencySelectRoute'

const Dot = styled(Box)<{ scale?: 'sm' | 'md' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`

const CircleSvg = ({ percent = 1, ...props }: SvgProps & { percent?: number }) => (
  <Svg width="60px" height="60px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#filter0_i_1147_113741)">
      <circle r="10" cx="10" cy="10" fill="#7645D9" />
      <circle
        r="5"
        cx="10"
        cy="10"
        fill="transparent"
        stroke="#1FC7D4"
        strokeWidth="10"
        strokeDasharray={`calc(${percent * 100}px * 31.4 / 100) 31.4`}
        transform="rotate(-90) translate(-20)"
      />
    </g>
    <defs>
      <filter
        id="filter0_i_1147_113741"
        x={0}
        y={0}
        width={60}
        height={60}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy={-2} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_1147_113741" />
      </filter>
    </defs>
  </Svg>
)

const Subtitle: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Text fontSize="12px" textTransform="uppercase" bold color="secondary">
      {children}
    </Text>
  )
}

export const PairDistribution = ({
  title,
  percent,
  currencyAValue,
  currencyBValue,
  tooltipTargetRef,
  currencies,
}: {
  title: React.ReactNode
  percent?: number
  currencyAValue?: string
  currencyBValue?: string
  tooltipTargetRef?: any
  currencies: CurrencySelectorValue
}) => {
  const { currencyA, currencyB } = currencies

  return (
    <AutoColumn gap="8px">
      <Subtitle>{title}</Subtitle>
      <Flex>
        {typeof percent !== 'undefined' && (
          <div ref={tooltipTargetRef}>
            <CircleSvg percent={percent} mr="34px" />
          </div>
        )}
        <AutoColumn style={{ width: '100%' }}>
          {currencyA && (
            <RowBetween>
              <AutoRow width="auto" gap="8px">
                <Dot bg="primary" />
                <CurrencyLogo currency={currencyA} />
                <Text>{currencyA?.symbol}</Text>
              </AutoRow>
              <Text>{currencyAValue}</Text>
            </RowBetween>
          )}

          {currencyB && (
            <RowBetween>
              <AutoRow width="auto" gap="8px">
                <Dot bg="secondary" />
                <CurrencyLogo currency={currencyB} />
                <Text>{currencyB?.symbol}</Text>
              </AutoRow>
              <Text>{currencyBValue}</Text>
            </RowBetween>
          )}
        </AutoColumn>
      </Flex>
    </AutoColumn>
  )
}

interface AddLiquidityModalHeaderProps {
  poolTokenPercentage?: Percent
  liquidityMinted: CurrencyAmount<Currency> | undefined
  price: Price<Currency, Currency> | undefined
  children: React.ReactNode
  noLiquidity?: boolean
  currencies: CurrencySelectorValue
}

export const AddLiquidityModalHeader = ({
  poolTokenPercentage,
  liquidityMinted,
  price,
  noLiquidity,
  children,
  currencies,
}: AddLiquidityModalHeaderProps) => {
  const [allowedSlippage] = useUserSlippage() // custom from users

  const { currencyA, currencyB } = currencies

  const { t } = useTranslation()

  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
      slippage: allowedSlippage / 100,
    }),
  )

  return (
    <AutoColumn gap="24px">
      <AutoColumn gap="8px">
        <Subtitle>{t('You will receive')}</Subtitle>
        <GreyCard padding="24px" borderRadius="20px">
          <RowBetween>
            <AutoRow gap="4px" width="auto">
              <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={24} />
              <Text color="textSubtle">
                {currencyA?.symbol && currencyB?.symbol && getLPSymbol(currencyA.symbol, currencyB.symbol)}
              </Text>
            </AutoRow>
            <Text ml="8px">{formatAmountDisplay(liquidityMinted)}</Text>
          </RowBetween>
        </GreyCard>
      </AutoColumn>
      <RowBetween>
        <Subtitle>{t('Your share in the pair')}</Subtitle>
        <Text>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Text>
      </RowBetween>
      <AutoColumn gap="8px">{children}</AutoColumn>
      <AutoColumn>
        <RowBetween>
          <Subtitle>{t('Rates')}</Subtitle>
          <Text>{`1 ${currencyA?.symbol} = ${formatAmountDisplay(price)} ${currencyB?.symbol}`}</Text>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end' }}>
          <Text>{`1 ${currencyB?.symbol} = ${formatAmountDisplay(price?.invert())} ${currencyA?.symbol}`}</Text>
        </RowBetween>
      </AutoColumn>
      {!noLiquidity && (
        <RowBetween>
          <Subtitle>{t('Slippage Tolerance')}</Subtitle>
          <TooltipText ref={targetRef}>{allowedSlippage / 100}%</TooltipText>
          {tooltipVisible && tooltip}
        </RowBetween>
      )}
    </AutoColumn>
  )
}
