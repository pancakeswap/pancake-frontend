import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, TradeType } from '@pancakeswap/sdk'
import { Pair } from '@pancakeswap/smart-router/evm'
import { Modal, ModalV2, QuestionHelper, SearchIcon, Text, Flex, Link, AutoColumn } from '@pancakeswap/uikit'

import { RowBetween, RowFixed } from 'components/Layout/Row'
import { BUYBACK_FEE, LP_HOLDERS_FEE, TOTAL_FEE, TREASURY_FEE } from 'config/constants/info'
import { useState } from 'react'
import { Field } from 'state/swap/actions'
import FormattedPriceImpact from './FormattedPriceImpact'
import { RouterViewer } from './RouterViewer'
import SwapRoute from './SwapRoute'

function TradeSummary({
  inputAmount,
  outputAmount,
  tradeType,
  slippageAdjustedAmounts,
  priceImpactWithoutFee,
  realizedLPFee,
  hasStablePair = false,
  isMM = false,
}: {
  hasStablePair?: boolean
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeType?: TradeType
  slippageAdjustedAmounts: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency>
  isMM?: boolean
}) {
  const { t } = useTranslation()
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const totalFeePercent = `${(TOTAL_FEE * 100).toFixed(2)}%`
  const lpHoldersFeePercent = `${(LP_HOLDERS_FEE * 100).toFixed(2)}%`
  const treasuryFeePercent = `${(TREASURY_FEE * 100).toFixed(4)}%`
  const buyBackFeePercent = `${(BUYBACK_FEE * 100).toFixed(4)}%`

  return (
    <AutoColumn style={{ padding: '0 16px' }}>
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
              ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${outputAmount.currency.symbol}` ?? '-'
              : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${inputAmount.currency.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      {priceImpactWithoutFee && (
        <RowBetween>
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
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px" color="textSubtle">
              {t('Liquidity Provider Fee')}
            </Text>
            <QuestionHelper
              text={
                <>
                  <Text mb="12px">
                    <Text bold display="inline-block">
                      {t('AMM')}
                    </Text>
                    :{' '}
                    {hasStablePair
                      ? t('For each non-stableswap trade, a %amount% fee is paid', { amount: totalFeePercent })
                      : t('For each trade a %amount% fee is paid', { amount: totalFeePercent })}
                  </Text>
                  <Text>- {t('%amount% to LP token holders', { amount: lpHoldersFeePercent })}</Text>
                  <Text>- {t('%amount% to the Treasury', { amount: treasuryFeePercent })}</Text>
                  <Text>- {t('%amount% towards CAKE buyback and burn', { amount: buyBackFeePercent })}</Text>
                  {hasStablePair && (
                    <>
                      <Text mt="12px">
                        {t('For each stableswap trade, refer to the fee table')}
                        <Link
                          style={{ display: 'inline' }}
                          ml="4px"
                          external
                          href="https://docs.pancakeswap.finance/products/stableswap#stableswap-fees"
                        >
                          {t('here.')}
                        </Link>
                      </Text>
                    </>
                  )}
                  <Text mt="10px">
                    <Text bold display="inline-block">
                      {t('MM')}
                    </Text>
                    :{' '}
                    {t(
                      'PancakeSwap does not charge any fees for trades. However, the market makers charge an implied fee of 0.05% (non-stablecoin) / 0.01% (stablecoin) factored into the quotes provided by them.',
                    )}
                  </Text>
                </>
              }
              ml="4px"
              placement="top"
            />
          </RowFixed>
          <Text fontSize="14px">{`${realizedLPFee.toSignificant(4)} ${inputAmount.currency.symbol}`}</Text>
        </RowBetween>
      )}
    </AutoColumn>
  )
}

export interface AdvancedSwapDetailsProps {
  hasStablePair?: boolean
  pairs?: Pair[]
  path?: Currency[]
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency>
  slippageAdjustedAmounts?: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeType?: TradeType
  isMM?: boolean
}

export function AdvancedSwapDetails({
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
            slippageAdjustedAmounts={slippageAdjustedAmounts}
            priceImpactWithoutFee={priceImpactWithoutFee}
            realizedLPFee={realizedLPFee}
            hasStablePair={hasStablePair}
            isMM={isMM}
          />
          {showRoute && (
            <>
              <RowBetween style={{ padding: '0 16px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Text fontSize="14px" color="textSubtle">
                    {t('Route')}
                  </Text>
                  <QuestionHelper
                    text={t('Routing through these tokens resulted in the best price for your trade.')}
                    ml="4px"
                    placement="top-start"
                  />
                </span>
                <SwapRoute path={path} />
                <SearchIcon style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(true)} />
                <ModalV2 closeOnOverlayClick isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)}>
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
                    onDismiss={() => setIsModalOpen(false)}
                  >
                    <RouterViewer
                      isMM={isMM}
                      inputCurrency={inputAmount.currency}
                      pairs={pairs}
                      path={path}
                      outputCurrency={outputAmount.currency}
                    />
                  </Modal>
                </ModalV2>
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
