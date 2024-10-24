import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, TradeType } from '@pancakeswap/sdk'
import { LegacyPair as Pair } from '@pancakeswap/smart-router/legacy-router'
import {
  AutoColumn,
  Flex,
  Link,
  Modal,
  ModalV2,
  QuestionHelper,
  QuestionHelperV2,
  SearchIcon,
  SkeletonV2,
  Text,
} from '@pancakeswap/uikit'
import { formatAmount, formatFraction } from '@pancakeswap/utils/formatFractions'
import { useUserSlippage } from '@pancakeswap/utils/user'
import React, { memo, useState } from 'react'

import { NumberDisplay } from '@pancakeswap/widgets-internal'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { RoutingSettingsButton } from 'components/Menu/GlobalSettings/SettingsModalV2'
import { Field } from 'state/swap/actions'
import { styled } from 'styled-components'
import FormattedPriceImpact from '../../Swap/components/FormattedPriceImpact'
import { RouterViewer } from '../../Swap/components/RouterViewer'
import SwapRoute from '../../Swap/components/SwapRoute'
import { useFeeSaved } from '../../Swap/hooks/useFeeSaved'
import { SlippageButton } from '../../Swap/V3Swap/components/SlippageButton'
import { SlippageAdjustedAmounts } from '../../Swap/V3Swap/utils/exchange'

const DetailsTitle = styled(Text)`
  text-decoration: underline dotted;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  line-height: 150%;
  cursor: help;
`

export const TradeSummary = memo(function TradeSummary({
  inputAmount,
  outputAmount,
  tradeType,
  slippageAdjustedAmounts,
  priceImpactWithoutFee,
  realizedLPFee,
  gasTokenSelector,
  isX = false,
  loading = false,
}: {
  hasStablePair?: boolean
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeType?: TradeType
  slippageAdjustedAmounts: SlippageAdjustedAmounts
  priceImpactWithoutFee?: Percent | null
  realizedLPFee?: CurrencyAmount<Currency> | null
  gasTokenSelector?: React.ReactNode
  isX?: boolean
  loading?: boolean
}) {
  const { t } = useTranslation()
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const { feeSavedAmount, feeSavedUsdValue } = useFeeSaved(inputAmount, outputAmount)
  const [allowedSlippage] = useUserSlippage()

  return (
    <AutoColumn px="4px">
      {gasTokenSelector}
      <RowBetween>
        <RowFixed>
          <QuestionHelperV2
            text={t(
              'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
            )}
            placement="top"
          >
            <DetailsTitle>{isExactIn ? t('Minimum received') : t('Maximum sold')}</DetailsTitle>
          </QuestionHelperV2>
        </RowFixed>
        <RowFixed>
          <SkeletonV2 width="80px" height="16px" borderRadius="8px" minHeight="auto" isDataReady={!loading}>
            <Text fontSize="14px">
              {isExactIn
                ? `${formatAmount(slippageAdjustedAmounts[Field.OUTPUT], 4) ?? '-'} ${outputAmount?.currency?.symbol}`
                : `${formatAmount(slippageAdjustedAmounts[Field.INPUT], 4) ?? '-'} ${inputAmount?.currency?.symbol}`}
            </Text>
          </SkeletonV2>
        </RowFixed>
      </RowBetween>
      {feeSavedAmount ? (
        <RowBetween align="flex-start" mt="10px">
          <RowFixed>
            <QuestionHelperV2
              text={
                <>
                  <Text>{t('Fees saved on PancakeSwap compared to major DEXs charging interface fees')}</Text>
                </>
              }
              placement="top"
            >
              <DetailsTitle>{t('Fee saved')}</DetailsTitle>
            </QuestionHelperV2>
          </RowFixed>
          <SkeletonV2 width="100px" height="16px" borderRadius="8px" minHeight="auto" isDataReady={!loading}>
            <RowFixed>
              <NumberDisplay
                as="span"
                fontSize={14}
                value={formatAmount(feeSavedAmount, 2)}
                suffix={` ${outputAmount?.currency?.symbol}`}
                color="positive60"
              />
              <NumberDisplay
                as="span"
                fontSize={14}
                color="positive60"
                value={formatFraction(feeSavedUsdValue, 2)}
                prefix="(~$"
                suffix=")"
                ml={1}
              />
            </RowFixed>
          </SkeletonV2>
        </RowBetween>
      ) : null}
      {priceImpactWithoutFee && (
        <RowBetween mt="10px">
          <RowFixed>
            <QuestionHelperV2
              text={
                <>
                  <Text>
                    <Text bold display="inline-block">
                      {t('AMM')}
                    </Text>
                    {`: ${t('The difference between the market price and estimated price due to trade size.')}`}
                  </Text>
                  <Text mt="10px">
                    <Text bold display="inline-block">
                      {t('X')}
                    </Text>
                    {`: ${t(
                      'The difference between the latest quoted price and the minimum receiving amount set in the trade order.',
                    )}`}
                  </Text>
                </>
              }
              placement="top"
            >
              <DetailsTitle>{t('Price Impact')}</DetailsTitle>
            </QuestionHelperV2>
          </RowFixed>
          <SkeletonV2 width="50px" height="16px" borderRadius="8px" minHeight="auto" isDataReady={!loading}>
            {isX ? <Text color="primary">0%</Text> : <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />}
          </SkeletonV2>
        </RowBetween>
      )}
      <RowBetween mt="8px">
        <RowFixed>
          <QuestionHelperV2
            text={
              <>
                <Text>
                  <Text bold display="inline-block">
                    {t('AMM')}
                  </Text>
                  {`: ${t('The difference between the market price and estimated price due to trade size.')}`}
                </Text>
                <Text mt="10px">
                  <Text bold display="inline-block">
                    {t('X')}
                  </Text>
                  {`: ${t(
                    'The difference between the latest quoted price and the minimum receiving amount set in the trade order.',
                  )}`}
                </Text>
              </>
            }
            placement="top"
          >
            <DetailsTitle>{t('Slippage Tolerance')}</DetailsTitle>
          </QuestionHelperV2>
        </RowFixed>
        <SlippageButton slippage={allowedSlippage} />
      </RowBetween>

      {(realizedLPFee || isX) && (
        <RowBetween mt="10px">
          <RowFixed>
            <QuestionHelperV2
              text={
                <>
                  <Text mb="12px">
                    <Text bold display="inline-block">
                      {t('AMM')}
                    </Text>
                    :{' '}
                    {t(
                      'Fee ranging from 0.1% to 0.01% depending on the pool fee tier. You can check the fee tier by clicking the magnifier icon under the “Route” section.',
                    )}
                  </Text>
                  <Text mt="12px">
                    <Link
                      style={{ display: 'inline' }}
                      ml="4px"
                      external
                      href="https://docs.pancakeswap.finance/products/pancakeswap-exchange/faq#what-will-be-the-trading-fee-breakdown-for-v3-exchange"
                    >
                      {t('Fee Breakdown and Tokenomics')}
                    </Link>
                  </Text>
                  <Text mt="10px">
                    <Text bold display="inline-block">
                      {t('X')}
                    </Text>
                    : {t('No fee when trade is going through PancakeSwap X. Subject to change in the future.')}
                  </Text>
                </>
              }
              placement="top"
            >
              <DetailsTitle fontSize="14px" color="textSubtle">
                {t('Trading Fee')}
              </DetailsTitle>
            </QuestionHelperV2>
          </RowFixed>
          <SkeletonV2 width="70px" height="16px" borderRadius="8px" minHeight="auto" isDataReady={!loading}>
            {isX ? (
              <Text color="primary" fontSize="14px">
                0 {inputAmount?.currency?.symbol}
              </Text>
            ) : (
              <Text fontSize="14px">{`${formatAmount(realizedLPFee, 4)} ${inputAmount?.currency?.symbol}`}</Text>
            )}
          </SkeletonV2>
        </RowBetween>
      )}
    </AutoColumn>
  )
})

export interface AdvancedSwapDetailsProps {
  hasStablePair?: boolean
  pairs?: Pair[]
  path?: Currency[]
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency> | null
  slippageAdjustedAmounts: SlippageAdjustedAmounts
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeType?: TradeType
}

export const AdvancedSwapDetails = memo(function AdvancedSwapDetails({
  pairs,
  path,
  priceImpactWithoutFee,
  realizedLPFee,
  slippageAdjustedAmounts,
  inputAmount,
  outputAmount,
  tradeType,
  hasStablePair,
}: AdvancedSwapDetailsProps) {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showRoute = Boolean(path && path.length > 1)
  return (
    <AutoColumn gap="0px">
      {inputAmount && (
        <>
          <TradeSummary
            inputAmount={inputAmount}
            outputAmount={outputAmount}
            tradeType={tradeType}
            slippageAdjustedAmounts={slippageAdjustedAmounts ?? {}}
            priceImpactWithoutFee={priceImpactWithoutFee}
            realizedLPFee={realizedLPFee}
            hasStablePair={hasStablePair}
          />
          {showRoute && (
            <>
              <RowBetween style={{ padding: '0 24px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Text fontSize="14px" color="textSubtle">
                    {t('MM Route')}
                  </Text>
                  <QuestionHelper
                    text={t(
                      'The Market Maker (MM) route is automatically selected for your trade to achieve the best price for your trade.',
                    )}
                    ml="4px"
                    placement="top"
                  />
                </span>
                {path ? <SwapRoute path={path} /> : null}
                <SearchIcon style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(true)} />
                <ModalV2 closeOnOverlayClick isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)}>
                  <Modal
                    title={
                      <Flex justifyContent="center">
                        {t('Route')}{' '}
                        <QuestionHelper
                          text={t(
                            'Route is automatically calculated based on your routing preference to achieve the best price for your trade.',
                          )}
                          ml="4px"
                          placement="top"
                        />
                      </Flex>
                    }
                    onDismiss={() => setIsModalOpen(false)}
                  >
                    <RouterViewer
                      inputCurrency={inputAmount?.currency}
                      pairs={pairs}
                      path={path}
                      outputCurrency={outputAmount?.currency}
                    />
                    <Flex mt="3em" width="100%" justifyContent="center">
                      <RoutingSettingsButton />
                    </Flex>
                  </Modal>
                </ModalV2>
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
})
