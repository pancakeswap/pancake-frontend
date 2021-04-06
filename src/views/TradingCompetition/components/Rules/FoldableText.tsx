import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, FlexProps, ExpandableLabel } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

interface FoldableTextProps extends FlexProps {
  title?: string
}

const Wrapper = styled(Flex)`
  cursor: pointer;
`

const StyledExpandableLabelWrapper = styled(Flex)`
  button {
    align-items: flex-start;
    justify-content: flex-start;
    padding-right: 0;
  }
`

const StyledChildrenFlex = styled(Flex)<{ isExpanded?: boolean }>`
  overflow: hidden;
  height: ${({ isExpanded }) => (isExpanded ? '100%' : '0px')};
  padding-bottom: ${({ isExpanded }) => (isExpanded ? '16px' : '0px')};
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
`

const FoldableText: React.FC<FoldableTextProps> = ({ title, children, ...props }) => {
  const TranslateString = useI18n()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Wrapper {...props} flexDirection="column" onClick={() => setIsExpanded(!isExpanded)}>
      <Flex justifyContent="space-between">
        <Text bold mb="16px">
          {title}
        </Text>
        <StyledExpandableLabelWrapper>
          <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? TranslateString(1066, 'Hide') : TranslateString(658, 'Details')}
          </ExpandableLabel>
        </StyledExpandableLabelWrapper>
      </Flex>
      <StyledChildrenFlex isExpanded={isExpanded} flexDirection="column">
        {children}
      </StyledChildrenFlex>
    </Wrapper>
  )
}

export default FoldableText
