import React from 'react'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { CheckmarkCircleIcon, Tag, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { formatBnbv2 } from '../../helpers'

interface EnteredTagProps {
  amount?: ethers.BigNumber
  hasClaimed?: boolean
}

const StyledEnteredTag = styled(Tag)`
  font-weight: bold;
  text-transform: uppercase;
`

const EnteredTag: React.FC<EnteredTagProps> = ({ amount, hasClaimed = false }) => {
  const { t } = useTranslation()
  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <div style={{ whiteSpace: 'nowrap' }}>{`${formatBnbv2(amount)} BNB`}</div>,
    { placement: 'bottom' },
  )

  return (
    <>
      <span ref={targetRef}>
        <StyledEnteredTag
          variant={hasClaimed ? 'success' : 'secondary'}
          startIcon={<CheckmarkCircleIcon width="18px" />}
        >
          {hasClaimed ? t('Claimed') : t('Entered')}
        </StyledEnteredTag>{' '}
      </span>{' '}
      {tooltipVisible && tooltip}
    </>
  )
}

export default EnteredTag
