import React from 'react'
import styled from 'styled-components'
import { CheckmarkCircleIcon, Tag, useTooltip } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { formatBnb } from '../../helpers'

interface EnteredTagProps {
  amount?: number
}

const StyledEnteredTag = styled(Tag).attrs({
  variant: 'secondary',
  startIcon: <CheckmarkCircleIcon width="18px" />,
})`
  font-weight: bold;
  text-transform: uppercase;
`

const EnteredTag: React.FC<EnteredTagProps> = ({ amount }) => {
  const { t } = useTranslation()
  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <div style={{ whiteSpace: 'nowrap' }}>{`${formatBnb(amount)} BNB`}</div>,
    'bottom',
    'hover',
  )

  return (
    <>
      <span ref={targetRef}>
        <StyledEnteredTag>{t('Entered')}</StyledEnteredTag>{' '}
      </span>{' '}
      {tooltipVisible && tooltip}
    </>
  )
}

export default EnteredTag
