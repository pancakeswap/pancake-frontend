import { Text, Flex } from '@pancakeswap/uikit'
import { BalanceWithLoading } from 'components/Balance'

// TODO: Add type and optimize

const DiffBalance = ({ value, newValue = null, decimals, unit }) => {
  if (newValue === null || value === newValue) {
    return <BalanceWithLoading bold fontSize="16px" value={value} decimals={decimals} unit={unit} />
  }

  return (
    <>
      <BalanceWithLoading
        style={{
          textDecoration: 'line-through',
        }}
        bold
        fontSize="16px"
        mr="4px"
        value={value}
        decimals={decimals}
        unit={unit}
      />
      {`->`}
      <BalanceWithLoading bold fontSize="16px" ml="4px" value={newValue} decimals={decimals} unit={unit} />
    </>
  )
}

const BalanceRow = ({ title, value, newValue = null, unit = '', decimals, suffix = null }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Flex alignItems="center">
      <DiffBalance newValue={newValue} value={value} decimals={decimals} unit={unit} />
      {suffix}
    </Flex>
  </Flex>
)

export default BalanceRow
