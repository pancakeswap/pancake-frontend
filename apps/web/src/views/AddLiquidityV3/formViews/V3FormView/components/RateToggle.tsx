import { Button, Flex, Text } from '@pancakeswap/uikit'

export default function RateToggle({ currencyA, handleRateToggle }) {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Text mr="8px">View prices in</Text>
      <Button variant="secondary" scale="sm" onClick={handleRateToggle}>
        {currencyA?.symbol}
      </Button>
    </Flex>
  )
}
