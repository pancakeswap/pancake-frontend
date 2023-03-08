import { Currency } from '@pancakeswap/sdk'
import { Button, Flex, SyncAltIcon, Text } from '@pancakeswap/uikit'

export default function RateToggle({
  currencyA,
  handleRateToggle,
}: {
  currencyA: Currency
  handleRateToggle: () => void
}) {
  return currencyA ? (
    <Flex justifyContent="center" alignItems="center">
      <Text mr="8px" color="textSubtle">
        View prices in
      </Text>
      <Button variant="secondary" scale="sm" onClick={handleRateToggle} startIcon={<SyncAltIcon color="primary" />}>
        {currencyA?.symbol}
      </Button>
    </Flex>
  ) : null
}
