import { Text, Flex } from '@pancakeswap/uikit'
import { format } from 'date-fns'

// TODO: Add Type

const DateRow = ({ title, value }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Text bold color="text">
      {value ? format(value, 'MMM do, yyyy HH:mm') : '-'}
    </Text>
  </Flex>
)

export default DateRow
