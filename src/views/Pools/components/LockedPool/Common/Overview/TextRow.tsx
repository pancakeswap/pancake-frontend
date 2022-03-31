import { Text, Flex } from '@pancakeswap/uikit'

// TODO: Add Type and Optimize

const DiffText = ({ value, newValue = null }) => {
  if (!newValue || !value || value === newValue) {
    return (
      <Text bold fontSize="16px">
        {value || '-'}
      </Text>
    )
  }

  return (
    <>
      <Text
        style={{
          textDecoration: 'line-through',
        }}
        bold
        fontSize="16px"
        mr="4px"
      >
        {value}
      </Text>
      {`->`}
      <Text bold color="textSubtle" ml="4px" fontSize="16px">
        {newValue}
      </Text>
    </>
  )
}

const TextRow = ({ title, value, newValue = null }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Flex alignItems="center">
      <DiffText value={value} newValue={newValue} />
    </Flex>
  </Flex>
)

export default TextRow
