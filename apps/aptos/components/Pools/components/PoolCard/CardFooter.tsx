import { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, useTooltip, Farm as FarmUI } from '@pancakeswap/uikit'

interface FooterProps {
  defaultExpanded?: boolean
}

const { ManualPoolTag } = FarmUI.Tags

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`
const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const Footer: React.FC<React.PropsWithChildren<FooterProps>> = ({ defaultExpanded, children }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || false)

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(manualTooltipText, {
    placement: 'bottom',
  })

  return (
    <CardFooter>
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          <ManualPoolTag />
          {tooltipVisible && tooltip}
          <Flex ref={targetRef}>
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && <ExpandedWrapper flexDirection="column">{children}</ExpandedWrapper>}
    </CardFooter>
  )
}

export default Footer
