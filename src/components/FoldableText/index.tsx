import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, ChevronDownIcon, ChevronUpIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const Wrapper = styled(Flex)`
  cursor: pointer;
`

const StyledExpandButton = styled(Flex)`
  svg {
    margin-top: 2px;
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const StyledChildrenFlex = styled(Flex)<{ isExpanded?: boolean }>`
  overflow: hidden;
  height: ${({ isExpanded }) => (isExpanded ? '100%' : '0px')};
  padding-bottom: ${({ isExpanded }) => (isExpanded ? '16px' : '0px')};
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
`

const FoldableText: React.FC<{ title?: string }> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const TranslateString = useI18n()

  return (
    <Wrapper flexDirection="column" onClick={() => setIsExpanded(!isExpanded)} mt="24px">
      <Flex justifyContent="space-between">
        <Text fontWeight="bold" mb="16px">
          {title}
        </Text>
        <StyledExpandButton justifyContent="flex-start" alignItems="flex-start">
          <Text fontWeight="bold" color="primary">
            {isExpanded ? TranslateString(1066, 'Hide') : TranslateString(658, 'Details')}
          </Text>
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </StyledExpandButton>
      </Flex>
      <StyledChildrenFlex isExpanded={isExpanded} flexDirection="column">
        {children}
      </StyledChildrenFlex>
    </Wrapper>
  )
}

export default FoldableText
