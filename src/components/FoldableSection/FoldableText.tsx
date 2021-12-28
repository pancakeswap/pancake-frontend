import React, { useState, ReactNode } from 'react'
import styled from 'styled-components'
import { ExpandableLabel, Flex, FlexProps, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface FoldableTextProps extends Omit<FlexProps, 'title'> {
  title?: ReactNode
}

const Wrapper = styled(Flex)`
  cursor: pointer;
`

const StyledExpandableLabelWrapper = styled(Flex)`
  button {
    align-items: center;
    justify-content: flex-start;
  }
`

const StyledChildrenFlex = styled(Flex)<{ isExpanded?: boolean }>`
  overflow: hidden;
  height: ${({ isExpanded }) => (isExpanded ? '100%' : '0px')};
  padding-bottom: ${({ isExpanded }) => (isExpanded ? '16px' : '0px')};
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
`

const FoldableText: React.FC<FoldableTextProps> = ({ title, children, ...props }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Flex {...props} flexDirection="column">
      <Wrapper justifyContent="space-between" alignItems="center" pb="16px" onClick={() => setIsExpanded((s) => !s)}>
        <Text fontWeight="bold">{title}</Text>
        <StyledExpandableLabelWrapper>
          <ExpandableLabel expanded={isExpanded}>{isExpanded ? t('Hide') : t('Details')}</ExpandableLabel>
        </StyledExpandableLabelWrapper>
      </Wrapper>
      <StyledChildrenFlex isExpanded={isExpanded} flexDirection="column">
        {children}
      </StyledChildrenFlex>
    </Flex>
  )
}

export default FoldableText
