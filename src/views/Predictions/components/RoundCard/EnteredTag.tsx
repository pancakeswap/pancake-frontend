import React from 'react'
import styled from 'styled-components'
import { CheckmarkCircleIcon, Tag, useTooltip } from '@pancakeswap/uikit'
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
`

const EnteredTag: React.FC<EnteredTagProps> = ({ amount }) => {
  const { t, currentLanguage } = useTranslation()
  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <div style={{ whiteSpace: 'nowrap' }}>{`${formatBnb(amount)} BNB`}</div>,
    { placement: 'bottom' },
  )

  return (
    <>
      <span ref={targetRef}>
        <StyledEnteredTag>{t('Entered').toLocaleUpperCase(currentLanguage.locale)}</StyledEnteredTag>{' '}
      </span>{' '}
      {tooltipVisible && tooltip}
    </>
  )
}

export default EnteredTag
