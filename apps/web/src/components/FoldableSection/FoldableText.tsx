import { useState, ReactNode, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { ExpandableLabel, Flex, FlexProps, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface FoldableTextProps extends Omit<FlexProps, 'title'> {
  title?: ReactNode
  noBorder?: boolean
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

const StyledChildrenFlex = styled(Flex)<{ isExpanded?: boolean; noBorder?: boolean }>`
  overflow: hidden;
  height: ${({ isExpanded }) => (isExpanded ? '100%' : '0px')};
  padding-bottom: ${({ isExpanded }) => (isExpanded ? '16px' : '0px')};
  border-bottom: ${({ noBorder }) => (noBorder ? '' : `1px solid ${({ theme }) => theme.colors.inputSecondary}`)};
`

const FoldableText: React.FC<React.PropsWithChildren<FoldableTextProps>> = ({
  title,
  children,
  noBorder,
  ...props
}) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const handleClick = useCallback(() => setIsExpanded((s) => !s), [])
  const expandableText = useMemo(() => {
    return isExpanded ? t('Hide') : t('Details')
  }, [isExpanded, t])

  return (
    <Flex {...props} flexDirection="column">
      <Wrapper justifyContent="space-between" alignItems="center" pb="16px" onClick={handleClick}>
        <Text fontWeight="bold">{title}</Text>
        <StyledExpandableLabelWrapper>
          <ExpandableLabel expanded={isExpanded}>{expandableText}</ExpandableLabel>
        </StyledExpandableLabelWrapper>
      </Wrapper>
      <StyledChildrenFlex noBorder={noBorder} isExpanded={isExpanded} flexDirection="column">
        {children}
      </StyledChildrenFlex>
    </Flex>
  )
}

export default FoldableText
