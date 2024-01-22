import { BoxProps, Flex, Text } from '@pancakeswap/uikit'

interface VeCakePreviewTextInfoProps extends BoxProps {
  title: string
  value: string
  bold?: boolean
}

export const VeCakePreviewTextInfo: React.FC<React.PropsWithChildren<VeCakePreviewTextInfoProps>> = (props) => {
  const { title, value, bold } = props
  return (
    <Flex justifyContent="space-between" {...props}>
      <Text maxWidth={170} lineHeight="120%" color="textSubtle" fontSize="14px">
        {title}
      </Text>
      <Text bold={bold}>{value}</Text>
    </Flex>
  )
}
