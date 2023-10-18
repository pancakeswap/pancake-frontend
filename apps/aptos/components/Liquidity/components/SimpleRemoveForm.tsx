import { useTranslation } from '@pancakeswap/localization'
import { AtomBox, Text, ArrowDownIcon, AutoColumn, ColumnCenter } from '@pancakeswap/uikit'
import { Liquidity } from '@pancakeswap/widgets-internal'
import { LightGreyCard } from 'components/Card'
import { CurrencyLogo } from 'components/Logo'
import { useDeferredValue, useEffect } from 'react'
import { styled } from 'styled-components'
import { useBurnActionHandlers } from '../state/remove'
import { Field } from '../type'

const BorderCard = styled.div`
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 16px;
`

const { PercentSlider } = Liquidity

const SimpleRemoveForm = ({ currencyA, currencyB, formattedAmounts }) => {
  const { t } = useTranslation()
  const { onUserInput: _onUserInput } = useBurnActionHandlers()

  const innerLiquidityPercentage = useDeferredValue(Number.parseInt(formattedAmounts[Field.LIQUIDITY_PERCENT]))

  useEffect(() => {
    return () => _onUserInput(Field.LIQUIDITY_PERCENT, '0')
  }, [_onUserInput])

  return (
    <>
      <BorderCard>
        <Text fontSize="40px" bold mb="16px" style={{ lineHeight: 1 }}>
          {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
        </Text>
        <PercentSlider
          onValueChanged={(value) => _onUserInput(Field.LIQUIDITY_PERCENT, value)}
          currentValue={innerLiquidityPercentage}
        />
      </BorderCard>
      <>
        <ColumnCenter>
          <ArrowDownIcon color="textSubtle" width="24px" my="16px" />
        </ColumnCenter>
        <AutoColumn gap="8px">
          <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
            {t('Receive')}
          </Text>
          <LightGreyCard padding="24px" borderRadius="20px">
            <AtomBox display="flex" justifyContent="space-between" mb="8px" as="label" alignItems="center">
              <AtomBox display="flex" alignItems="center">
                <CurrencyLogo currency={currencyA} />
                <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                  {currencyA?.symbol}
                </Text>
              </AtomBox>
              <AtomBox display="flex">
                <Text small bold>
                  {formattedAmounts[Field.CURRENCY_A] || '0'}
                </Text>
                <Text small ml="4px">
                  (50%)
                </Text>
              </AtomBox>
            </AtomBox>
            <AtomBox display="flex" justifyContent="space-between" as="label" alignItems="center">
              <AtomBox display="flex" alignItems="center">
                <CurrencyLogo currency={currencyB} />
                <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                  {currencyB?.symbol}
                </Text>
              </AtomBox>
              <AtomBox display="flex">
                <Text bold small>
                  {formattedAmounts[Field.CURRENCY_B] || '0'}
                </Text>
                <Text small ml="4px">
                  (50%)
                </Text>
              </AtomBox>
            </AtomBox>
            {/* {chainId && (oneCurrencyIsWNative || oneCurrencyIsNative) ? (
              <RowBetween style={{ justifyContent: 'flex-end', fontSize: '14px' }}>
                {oneCurrencyIsNative ? (
                  <StyledInternalLink
                    href={`/remove/${currencyA?.isNative ? WNATIVE[chainId]?.address : currencyIdA}/${
                      currencyB?.isNative ? WNATIVE[chainId]?.address : currencyIdB
                    }`}
                  >
                    {t('Receive %currency%', { currency: WNATIVE[chainId]?.symbol })}
                  </StyledInternalLink>
                ) : oneCurrencyIsWNative ? (
                  <StyledInternalLink
                    href={`/remove/${currencyA && currencyA.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdA}/${
                      currencyB && currencyB.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdB
                    }`}
                  >
                    {t('Receive %currency%', { currency: native?.symbol })}
                  </StyledInternalLink>
                ) : null}
              </RowBetween>
            ) : null} */}
          </LightGreyCard>
        </AutoColumn>
      </>
    </>
  )
}

export default SimpleRemoveForm
