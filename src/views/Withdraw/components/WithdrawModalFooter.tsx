import React, { useState } from 'react'
import styled from 'styled-components'
import { Withdraw } from 'peronio-sdk'
import { Button, Text, AutoRenewIcon } from 'peronio-uikit'
import { useTranslation } from 'contexts/Localization'
import { formatExecutionPrice } from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { StyledBalanceMaxMini, WithdrawCallbackError } from './styleds'

const WithdrawModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

export default function WithdrawModalFooter({
  withdraw,
  onConfirm,
  withdrawErrorMessage,
  disabledConfirm = false,
}: {
  withdraw: Withdraw
  onConfirm: () => void
  withdrawErrorMessage: string | undefined
  disabledConfirm?: boolean
}) {
  const { t } = useTranslation()
  const [showInverted, setShowInverted] = useState<boolean>(false)

  return (
    <>
      <WithdrawModalFooterContainer>
        <RowBetween align="center">
          <Text fontSize="14px">{t('Price')}</Text>
          <Text
            fontSize="14px"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {formatExecutionPrice(withdraw, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Minimum received')}</Text>
            <QuestionHelper
              text={t(
                'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
              )}
              ml="4px"
            />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px">{withdraw?.outputAmount.toSignificant(4)}</Text>
            <Text fontSize="14px" marginLeft="4px">
              {withdraw.outputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        {/* <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Price Impact')}</Text>
            <QuestionHelper
              text={t('The difference between the market price and your price due to trade size.')}
              ml="4px"
            />
          </RowFixed>
        </RowBetween> */}
        {/* <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Liquidity Provider Fee')}</Text>
            <QuestionHelper
              text={
                <>
                  <Text mb="12px">{t('The vault charges a fee for withdrawing')}</Text>
                  <Text>- {t('The markup is %amount% from the USDT amount', { amount: '5%' })}</Text>
                  <Text>- {t('This is already included in total USDT input above')}</Text>
                  <Text>- {t('This additional fee will increase the total Peronio collateral')}</Text>
                </>
              }
              ml="4px"
            />
          </RowFixed>
          <Text fontSize="14px">{`${withdraw.feeAmount} ${withdraw.inputAmount.currency.symbol}`}</Text>
        </RowBetween> */}
      </WithdrawModalFooterContainer>

      <AutoRow>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {t('Confirm Withdraw')}
        </Button>

        {withdrawErrorMessage ? <WithdrawCallbackError error={withdrawErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
