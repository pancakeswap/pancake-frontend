import React, { ElementType, ReactNode } from 'react'
import { Flex, Heading, Text, TextProps } from '@pancakeswap-libs/uikit'
import SecondaryCard from './SecondaryCard'

interface StatBoxProps extends TextProps {
  icon: ElementType
  title: ReactNode
  subtitle: ReactNode
  isDisabled?: boolean
}

const StatBox: React.FC<StatBoxProps> = ({ icon: Icon, title, subtitle, isDisabled = false, ...props }) => {
  return (
    <SecondaryCard {...props}>
      <Flex alignItems="start">
        <Icon width="44px" mr="24px" color={isDisabled ? 'textDisabled' : 'currentColor'} />
        <div>
          <Heading as="h3" size="xl" color={isDisabled ? 'textDisabled' : 'text'}>
            {title}
          </Heading>
          <Text textTransform="uppercase" color={isDisabled ? 'textDisabled' : 'textSubtle'} fontSize="12px" bold>
            {subtitle}
          </Text>
        </div>
      </Flex>
    </SecondaryCard>
  )
}

export default StatBox
