import React from 'react'
import { styled } from 'styled-components'
import { Text, ChevronDownIcon } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'

interface ExpandActionCellProps {
  expanded: boolean
  showExpandedText: boolean
}

const StyledCell = styled(Pool.BaseCell)`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 12px 0px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 24px 0 0;
  }
`

const ArrowIcon = styled(ChevronDownIcon)<{ $toggled: boolean }>`
  transform: ${({ $toggled }) => ($toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const ExpandActionCell: React.FC<React.PropsWithChildren<ExpandActionCellProps>> = ({ expanded, showExpandedText }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      {showExpandedText && (
        <Text color="primary" mr="10px" bold>
          {expanded ? t('Hide') : t('Details')}
        </Text>
      )}
      <ArrowIcon color="primary" $toggled={expanded} />
    </StyledCell>
  )
}

export default ExpandActionCell
