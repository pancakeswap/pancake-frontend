import React from 'react'
import { Text, Flex, Image, FlexProps } from '@pancakeswap-libs/uikit'

interface Props extends FlexProps {
  img: string
  label: string
  amount: number | string
}

const TokenSection: React.FC<Props> = ({ img, label, amount, ...props }) => {
  return (
    <Flex {...props}>
      <Image src={img} alt={label} width={32} height={32} mr="16px" />
      <div>
        <Text bold fontSize="12px" color="secondary">
          {label}
        </Text>
        <Text bold fontSize="20px">
          {amount}
        </Text>
      </div>
    </Flex>
  )
}

export default TokenSection
