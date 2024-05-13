import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, TradeType } from '@pancakeswap/sdk'
import { LegacyPair as Pair } from '@pancakeswap/smart-router/legacy-router'
import { AutoColumn, Flex, Link, Modal, ModalV2, QuestionHelper, SearchIcon, Text } from '@pancakeswap/uikit'
import { formatAmount, formatFraction } from '@pancakeswap/utils/formatFractions'
import { memo, useState } from 'react'

import { NumberDisplay } from '@pancakeswap/widgets-internal'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { RoutingSettingsButton } from 'components/Menu/GlobalSettings/SettingsModal'
import { Field } from 'state/swap/actions'
import { SlippageAdjustedAmounts } from '../V3Swap/utils/exchange'
import { useFeeSaved } from '../hooks/useFeeSaved'
import FormattedPriceImpact from './FormattedPriceImpact'
import { RouterViewer } from './RouterViewer'
import SwapRoute from './SwapRoute'

export const TradeSummary = memo(function TradeSummary({
  inputAmount,
  outputAmount,
  tradeType,
  slippageAdjustedAmounts,
  priceImpactWithoutFee,
  realizedLPFee,
  isMM = false,
}: {
  hasStablePair?: boolean
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeType?: TradeType
  slippageAdjustedAmounts: SlippageAdjustedAmounts
  priceImpactWithoutFee?: Percent | null
  realizedLPFee?: CurrencyAmount<Currency> | null
  isMM?: boolean
}) {
  const { t } = useTranslation()
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const { feeSavedAmount, feeSavedUsdValue } = useFeeSaved(inputAmount, outputAmount)

  return (
    <AutoColumn style={{ padding: '0 24px' }}>
      <RowBetween>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            {isExactIn ? t('Minimum received') : t('Maximum sold')}
          </Text>
          <QuestionHelper
            text={t(
              'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
            )}
            ml="4px"
            placement="top"
          />
        </RowFixed>
        <RowFixed>
          <Text fontSize="14px">
            {isExactIn
              ? `${formatAmount(slippageAdjustedAmounts[Field.OUTPUT], 4)} ${outputAmount?.currency?.symbol}` ?? '-'
              : `${formatAmount(slippageAdjustedAmounts[Field.INPUT], 4)} ${inputAmount?.currency?.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      {feeSavedAmount ? (
        <RowBetween align="flex-start">
          <RowFixed>
            <Text fontSize="14px" color="textSubtle">
              {t('Fee saved')}
            </Text>
            <QuestionHelper
              text={
                <>
                  <Text>{t('Fees saved on PancakeSwap compared to major DEXs charging interface fees')}</Text>
                </>
              }
              ml="4px"
              placement="top"
            />
          </RowFixed>
          <RowFixed>
            <NumberDisplay
              as="span"
              fontSize={14}
              value={formatAmount(feeSavedAmount, 2)}
              suffix={` ${outputAmount?.currency?.symbol}`}
              color="success"
            />
            <NumberDisplay
              as="span"
              fontSize={14}
              color="success"
              value={formatFraction(feeSavedUsdValue, 2)}
              prefix="(~$"
              suffix=")"
              ml={1}
            />
          </RowFixed>
        </RowBetween>
      ) : null}
      {priceImpactWithoutFee && (
        <RowBetween style={{ padding: '4px 0 0 0' }}>
          <RowFixed>
            <Text fontSize="14px" color="textSubtle">
              {t('Price Impact')}
            </Text>
            <QuestionHelper
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
                      {t('MM')}
                    </Text>
                    {`: ${t('No slippage against quote from market maker')}`}
                  </Text>
                </>
              }
              ml="4px"
              placement="top"
            />
          </RowFixed>

          {isMM ? <Text color="textSubtle">--</Text> : <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />}
        </RowBetween>
      )}

      {realizedLPFee && (
        <RowBetween style={{ padding: '4px 0 0 0' }}>
          <RowFixed>
            <Text fontSize="14px" color="textSubtle">
              {t('Trading Fee')}
            </Text>
            <QuestionHelper
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
                      href={
                        isMM
                          ? 'https://docs.pancakeswap.finance/products/pancakeswap-exchange/market-maker-integration#fees'
                          : 'https://docs.pancakeswap.finance/products/pancakeswap-exchange/faq#what-will-be-the-trading-fee-breakdown-for-v3-exchange'
                      }
                    >
                      {t('Fee Breakdown and Tokenomics')}
                    </Link>
                  </Text>
                  <Text mt="10px">
                    <Text bold display="inline-block">
                      {t('MM')}
                    </Text>
                    :{' '}
                    {t(
                      'PancakeSwap does not charge any fees for trades. However, the market makers charge an implied fee of 0.05% - 0.25% (non-stablecoin) / 0.01% (stablecoin) factored into the quotes provided by them.',
                    )}
                  </Text>
                </>
              }
              ml="4px"
              placement="top"
            />
          </RowFixed>
          <Text fontSize="14px">{`${formatAmount(realizedLPFee, 4)} ${inputAmount?.currency?.symbol}`}</Text>
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
  isMM?: boolean
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
  isMM = false,
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
            isMM={isMM}
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
                      isMM={isMM}
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
