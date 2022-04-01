import { memo } from 'react'
import { Text, Flex } from '@pancakeswap/uikit'
import { BalanceWithLoading } from 'components/Balance'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import CrossText from './CrossText'

interface DiffBalancePropsType {
  value: number
  newValue?: number
  decimals: number
  unit?: string
}

const DiffBalance: React.FC<DiffBalancePropsType> = ({ value, newValue, decimals, unit }) => {
  if (isUndefinedOrNull(newValue) || !value || value === newValue) {
    return <BalanceWithLoading bold fontSize="16px" value={value} decimals={decimals} unit={unit} />
  }

  return (
    <>
      <CrossText>
        <BalanceWithLoading bold fontSize="16px" mr="4px" value={value} decimals={decimals} unit={unit} />
      </CrossText>
      {`->`}
      <BalanceWithLoading bold fontSize="16px" ml="4px" value={newValue} decimals={decimals} unit={unit} />
    </>
  )
}

interface BalanceRowPropsType extends DiffBalancePropsType {
  title: string
  suffix?: React.ReactNode
}

const BalanceRow: React.FC<BalanceRowPropsType> = ({ title, value, newValue, unit, decimals, suffix }) => (
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

export default memo(BalanceRow)
