import React, { ElementType, ReactNode } from 'react'
import { Flex, Heading, Text, TextProps } from '@tovaswapui/uikit'
import styled from 'styled-components'

const SecondaryCard = styled(Text)`
  border: 2px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 16px;
`

SecondaryCard.defaultProps = {
  p: '24px',
}

interface IconStatBoxProps extends TextProps {
  icon: ElementType
  title: ReactNode
  subtitle: ReactNode
  isDisabled?: boolean
}

const IconStatBox: React.FC<IconStatBoxProps> = ({ icon: Icon, title, subtitle, isDisabled = false, ...props }) => {
  return (
    <SecondaryCard {...props}>
      <Flex alignItems="start">
        <Icon width="44px" mr="24px" color={isDisabled ? 'textDisabled' : 'currentColor'} />
        <div>
          <Heading as="h3" scale="xl" color={isDisabled ? 'textDisabled' : 'text'}>
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

export default IconStatBox
