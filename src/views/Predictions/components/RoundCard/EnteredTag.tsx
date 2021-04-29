import React from 'react'
import styled from 'styled-components'
import { CheckmarkCircleIcon, Tag, useTooltip } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
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
  const TranslateString = useI18n()
  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <div style={{ whiteSpace: 'nowrap' }}>{`${formatBnb(amount)} BNB`}</div>,
    'bottom',
    'hover',
  )

  return (
    <>
      <span ref={targetRef}>
        <StyledEnteredTag>{TranslateString(999, 'Entered')}</StyledEnteredTag>{' '}
      </span>{' '}
      {tooltipVisible && tooltip}
    </>
  )
}

export default EnteredTag
