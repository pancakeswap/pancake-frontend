import { Text, Box } from '@pancakeswap/uikit'

const DetailSection = ({ title, value, detail }) => (
  <Box>
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Text color="text" textTransform="uppercase" bold fontSize="16px">
      {value}
    </Text>
    <Text color="text" fontSize="12px">
      {detail}
    </Text>
  </Box>
)

export default DetailSection
