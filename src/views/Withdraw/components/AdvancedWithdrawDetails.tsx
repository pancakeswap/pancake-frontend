import React from 'react'
import { Withdraw } from 'peronio-sdk'
import { Text } from 'peronio-uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from 'components/Layout/Column'
import { RowBetween, RowFixed } from 'components/Layout/Row'

function TradeSummary({ withdraw }: { withdraw: Withdraw }) {
  const { t } = useTranslation()
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
              ? `${withdraw?.outputAmount.toSignificant(4)} ${withdraw.outputAmount.currency.symbol}` ?? '-'
              : `${withdraw?.inputAmount.toSignificant(4)} ${withdraw.inputAmount.currency.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      {/* <RowBetween>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            {t('Markup (%markup%%)', { markup: markupRate })}
          </Text>
          <QuestionHelper
            text={
              <>
                <Text mb="12px">{t('The vault charges a fee for withdrawing')}</Text>
                <Text>
                  -{' '}
                  {t('The markup is %amount%% from the %symbol% amount', {
                    amount: markupRate,
                    symbol: withdraw.inputAmount.currency.symbol,
                  })}
                </Text>
                <Text>
                  -{' '}
                  {t('This is already included in total %symbol% input above', {
                    symbol: withdraw.inputAmount.currency.symbol,
                  })}
                </Text>
                <Text>
                  -{' '}
                  {t('This additional fee will increase the total %token_name% collateral', {
                    token_name: withdraw.outputAmount.currency.name,
                  })}
                </Text>
              </>
            }
            ml="4px"
            placement="top-start"
          />
        </RowFixed>
        <Text fontSize="14px">USDT {markupAmount.toFixed(2)}</Text>
      </RowBetween> */}
    </AutoColumn>
  )
}

export interface AdvancedWithdrawDetailsProps {
  withdraw?: Withdraw
}

export function AdvancedWithdrawDetails({ withdraw }: AdvancedWithdrawDetailsProps) {
  return <AutoColumn gap="0px">{withdraw && <TradeSummary withdraw={withdraw} />}</AutoColumn>
}
