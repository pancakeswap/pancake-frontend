import { memo, useMemo, useState } from 'react'
import { ModalV2, RowBetween, Text, Flex, Button, CurrencyLogo, Box } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { BaseAssets } from '@pancakeswap/position-managers'
import type { AtomBoxProps } from '@pancakeswap/ui'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { SpaceProps } from 'styled-system'

import { StyledModal } from './StyledModal'
import { FeeTag } from './Tags'
import { InnerCard } from './InnerCard'
import { PercentSlider } from './PercentSlider'

interface Props {
  isOpen?: boolean
  onDismiss?: () => void

  assets: BaseAssets
  vaultName: string
  feeTier: FeeAmount
  currencyA: Currency
  currencyB: Currency

  // TODO: return data
  onRemove?: (params: {
    amountA: CurrencyAmount<Currency>
    amountB: CurrencyAmount<Currency>
    liquidity: bigint
  }) => Promise<void>
}

export const RemoveLiquidity = memo(function RemoveLiquidity({
  isOpen,
  // assets,
  vaultName,
  onDismiss,
  currencyA,
  currencyB,
  feeTier,
}: // onRemove,
Props) {
  const { t } = useTranslation()
  const [percent, setPercent] = useState(0)
  const tokenPairName = useMemo(() => `${currencyA.symbol}-${currencyB.symbol}`, [currencyA, currencyB])

  return (
    <ModalV2 onDismiss={onDismiss} isOpen={isOpen}>
      <StyledModal title={t('Remove Liquidity')}>
        <RowBetween>
          <Text color="textSubtle">{t('Removing')}:</Text>
          <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
            <Text color="text" bold>
              {tokenPairName}
            </Text>
            <Text color="text" ml="0.25em">
              {vaultName}
            </Text>
            <FeeTag feeAmount={feeTier} ml="0.25em" />
          </Flex>
        </RowBetween>
        <InnerCard>
          <CurrencyAmountDisplay currency={currencyA} />
          <CurrencyAmountDisplay currency={currencyB} mt="8px" />
        </InnerCard>
        <PercentSlider percent={percent} onChange={setPercent} mt="1em" />
        <RemoveLiquidityButton mt="1.5em" />
      </StyledModal>
    </ModalV2>
  )
})

interface CurrencyAmountDisplayProps extends AtomBoxProps {
  amount?: CurrencyAmount<Currency>
  currency: Currency
}

const CurrencyAmountDisplay = memo(function CurrencyAmountDisplay({
  amount,
  currency,
  ...rest
}: CurrencyAmountDisplayProps) {
  const currencyDisplay = amount?.currency || currency
  const amountDisplay = useMemo(() => formatAmount(amount) || '0', [amount])
  // TODO: mock
  const amountInUsd = 214.23

  return (
    <RowBetween {...rest}>
      <Flex flexDirection="row" justifyContent="flex-start">
        <CurrencyLogo currency={currencyDisplay} />
        <Text color="textSubtle" ml="0.5em" fontSize="0.875em">
          {currencyDisplay.symbol}
        </Text>
      </Flex>
      <Flex flexDirection="row" alignItems="flex-end">
        <Text color="text" bold fontSize="0.875em">
          {amountDisplay}
        </Text>
        <Text color="text" fontSize="0.875em" ml="0.5em">
          (~${amountInUsd})
        </Text>
      </Flex>
    </RowBetween>
  )
})

interface RemoveLiquidityButtonProps extends SpaceProps {
  onClick?: () => void
}

export const RemoveLiquidityButton = memo(function RemoveLiquidityButton({
  onClick,
  ...rest
}: RemoveLiquidityButtonProps) {
  const { t } = useTranslation()
  return (
    <Box {...rest}>
      <Button variant="primary" width="100%">
        {t('Approve')}
      </Button>
      <Button mt="0.5em" variant="primary" width="100%" onClick={onClick}>
        {t('Confirm')}
      </Button>
    </Box>
  )
})
