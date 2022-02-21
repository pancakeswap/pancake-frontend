import { Text } from '@pancakeswap/uikit'

export default function HeaderCellStyle({ children }) {
  return (
    <Text bold textTransform="uppercase" color="textSubtle" textAlign="left">
      {children}
    </Text>
  )
}
