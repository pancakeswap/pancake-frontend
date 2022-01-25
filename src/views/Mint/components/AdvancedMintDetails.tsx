import React from 'react'
import { Mint } from 'peronio-sdk'
import { Text } from 'peronio-uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { RowBetween, RowFixed } from 'components/Layout/Row'

function TradeSummary({ mint }: { mint: Mint }) {
  const { t } = useTranslation()
  const markupRate = 5
  const markupAmount = 2.33
  const isExactIn = true
  // const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <AutoColumn style={{ padding: '0 16px' }}>
      <RowBetween>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            {isExactIn ? t('Minimum received') : t('Maximum sold')}
          </Text>
        </RowFixed>
        <RowFixed>
          <Text fontSize="14px">
            {isExactIn
              ? `${mint?.outputAmount.toSignificant(4)} ${mint.outputAmount.currency.symbol}` ?? '-'
              : `${mint?.inputAmount.toSignificant(4)} ${mint.inputAmount.currency.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            {t('Markup (%markup%%)', { markup: markupRate })}
          </Text>
          <QuestionHelper
            text={
              <>
                <Text mb="12px">{t('The vault charges a fee for minting')}</Text>
                <Text>- {t('The markup is %amount% from the USDT amount', { amount: '5%' })}</Text>
                <Text>- {t('This is already included in total USDT input above')}</Text>
                <Text>- {t('This additional fee will increase the total Peronio collateral')}</Text>
              </>
            }
            ml="4px"
            placement="top-start"
          />
        </RowFixed>
        <Text fontSize="14px">USDT {markupAmount.toFixed(2)}</Text>
      </RowBetween>
    </AutoColumn>
  )
}

export interface AdvancedMintDetailsProps {
  mint?: Mint
}

export function AdvancedMintDetails({ mint }: AdvancedMintDetailsProps) {
  return <AutoColumn gap="0px">{mint && <TradeSummary mint={mint} />}</AutoColumn>
}
