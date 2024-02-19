import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Button, Flex, SyncAltIcon, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const RateToggleButton = styled(Button)`
  border-radius: 8px;
  padding-left: 4px;
  padding-right: 4px;
`

export default function RateToggle({
  currencyA,
  handleRateToggle,
}: {
  currencyA?: Currency | null
  handleRateToggle: () => void
}) {
  const { t } = useTranslation()

  return currencyA ? (
    <Flex justifyContent="center" alignItems="center">
      <Text mr="4px" color="textSubtle">
        {t('View prices in')}
      </Text>
      <RateToggleButton
        variant="secondary"
        scale="sm"
        onClick={handleRateToggle}
        startIcon={<SyncAltIcon color="primary" />}
      >
        {currencyA?.symbol}
      </RateToggleButton>
    </Flex>
  ) : null
}
