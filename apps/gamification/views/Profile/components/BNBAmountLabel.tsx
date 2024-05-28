import { BinanceIcon, Flex, FlexProps, Text } from '@pancakeswap/uikit'

interface BNBAmountLabelProps extends FlexProps {
  amount: number
}

export const BNBAmountLabel: React.FC<React.PropsWithChildren<BNBAmountLabelProps>> = ({ amount, ...props }) => (
  <Flex alignItems="center" {...props}>
    <BinanceIcon width="16px" mx="4px" />
    <Text fontWeight="600">
      {amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 5,
      })}
    </Text>
  </Flex>
)
