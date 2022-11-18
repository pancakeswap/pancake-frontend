import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, TradeType } from '@pancakeswap/sdk'
import { Pair } from '@pancakeswap/smart-router/evm'
import { Modal, ModalV2, QuestionHelper, SearchIcon, Text } from '@pancakeswap/uikit'

import { AutoColumn } from 'components/Layout/Column'
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
}: {
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeType?: TradeType
  slippageAdjustedAmounts: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency>
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
            placement="top-start"
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
              text={t('The difference between the market price and estimated price due to trade size.')}
              ml="4px"
              placement="top-start"
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
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
                  <Text mb="12px">{t('For each trade a %amount% fee is paid', { amount: totalFeePercent })}</Text>
                  <Text>- {t('%amount% to LP token holders', { amount: lpHoldersFeePercent })}</Text>
                  <Text>- {t('%amount% to the Treasury', { amount: treasuryFeePercent })}</Text>
                  <Text>- {t('%amount% towards CAKE buyback and burn', { amount: buyBackFeePercent })}</Text>
                </>
              }
              ml="4px"
              placement="top-start"
            />
          </RowFixed>
          <Text fontSize="14px">{`${realizedLPFee.toSignificant(4)} ${inputAmount.currency.symbol}`}</Text>
        </RowBetween>
      )}
    </AutoColumn>
  )
}

export interface AdvancedSwapDetailsProps {
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
}: AdvancedSwapDetailsProps) {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(() => false)
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
                <SearchIcon onClick={() => setIsModalOpen(true)} />
                <ModalV2 closeOnOverlayClick isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)}>
                  <Modal title={t('Route')} onDismiss={() => setIsModalOpen(false)}>
                    <RouterViewer
                      inputCurrency={inputAmount.currency}
                      pairs={pairs}
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
