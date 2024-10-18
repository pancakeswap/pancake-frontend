import { Flex, LogoIcon, Tag, TagProps, Text } from '@pancakeswap/uikit'

interface PancakeSwapXTagProps extends TagProps {
  width?: string
  fontSize?: string
}

export const PancakeSwapXTag = ({ width, fontSize, ...props }: PancakeSwapXTagProps) => {
  return (
    <Tag variant="success" style={{ width: 'fit-content' }} {...props}>
      <Flex>
        <LogoIcon width={width} />
        <Text ml="6px" color="white" fontSize={fontSize} bold>
          PancakeSwap X
        </Text>
      </Flex>
    </Tag>
  )
}
