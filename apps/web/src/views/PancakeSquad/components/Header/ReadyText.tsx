import { CheckmarkIcon, Flex, FlexProps, Text } from '@pancakeswap/uikit'

type ReadyTextProps = {
  text: string
} & FlexProps

const ReadyText: React.FC<ReadyTextProps> = ({ text, ...props }) => {
  return (
    <Flex alignItems="center" {...props}>
      <Text fontSize="16px" color="success" mr="4px" bold>
        {text}
      </Text>
      <CheckmarkIcon color="success" width="17px" />
    </Flex>
  )
}

export default ReadyText
