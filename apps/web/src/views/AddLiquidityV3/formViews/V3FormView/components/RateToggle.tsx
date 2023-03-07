import { Button, Flex, SyncAltIcon, Text } from '@pancakeswap/uikit'

export default function RateToggle({ currencyA, handleRateToggle }) {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Text mr="8px" color="textSubtle">
        View prices in
      </Text>
      {currencyA && (
        <Button variant="secondary" scale="sm" onClick={handleRateToggle} startIcon={<SyncAltIcon color="primary" />}>
          {currencyA?.symbol}
        </Button>
      )}
    </Flex>
  )
}
