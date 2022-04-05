import { Text, Flex } from '@pancakeswap/uikit'
import { format } from 'date-fns'

interface PropsType {
  title: React.ReactNode
  value: Date
  color: string
}

const DateRow: React.FC<PropsType> = ({ title, value, color }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Text bold color={color}>
      {value ? format(value, 'MMM do, yyyy HH:mm') : '-'}
    </Text>
  </Flex>
)

export default DateRow
