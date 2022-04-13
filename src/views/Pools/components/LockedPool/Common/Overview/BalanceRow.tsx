import { memo } from 'react'
import { Text, Flex } from '@pancakeswap/uikit'
import { BalanceWithLoading } from 'components/Balance'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import _toNumber from 'lodash/toNumber'
import CrossText from './CrossText'

interface DiffBalancePropsType {
  value: number | string
  newValue?: number | string
  decimals: number
  unit?: string
  prefix?: string
}

const DiffBalance: React.FC<DiffBalancePropsType> = ({ value, newValue, decimals, unit, prefix }) => {
  if (isUndefinedOrNull(newValue) || !value || value === newValue || _toNumber(newValue) === 0) {
    return <BalanceWithLoading bold fontSize="16px" value={value} decimals={decimals} unit={unit} prefix={prefix} />
  }

  return (
    <>
      <CrossText>
        <BalanceWithLoading
          bold
          fontSize="16px"
          mr="4px"
          value={value}
          decimals={decimals}
          unit={unit}
          prefix={prefix}
        />
      </CrossText>
      {`->`}
      <BalanceWithLoading
        bold
        color="failure"
        fontSize="16px"
        ml="4px"
        value={newValue}
        decimals={decimals}
        unit={unit}
        prefix={prefix}
      />
    </>
  )
}

interface BalanceRowPropsType extends DiffBalancePropsType {
  title: string
  suffix?: React.ReactNode
}

const BalanceRow: React.FC<BalanceRowPropsType> = ({ title, value, newValue, unit, decimals, prefix, suffix }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Flex alignItems="center">
      <DiffBalance newValue={newValue} value={value} decimals={decimals} unit={unit} prefix={prefix} />
      {suffix}
    </Flex>
  </Flex>
)

export default memo(BalanceRow)
