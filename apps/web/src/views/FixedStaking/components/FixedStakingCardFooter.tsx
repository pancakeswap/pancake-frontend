import { useTranslation } from '@pancakeswap/localization'
import { ExpandableLabel, Flex } from '@pancakeswap/uikit'
import { ReactNode, useState } from 'react'
import { styled } from 'styled-components'

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`

const ExpandedWrapper = styled(Flex)`
  width: 100%;
  $ > svg {
    height: 14px;
    width: 14px;
  }
`

export function FixedStakingCardFooter({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Flex flexDirection="column" alignItems="center">
      <ExpandableButtonWrapper>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Info')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && <ExpandedWrapper flexDirection="column">{children}</ExpandedWrapper>}
    </Flex>
  )
}
