import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { DUAL_FARM_ENDING_BLOCK } from 'config'

const StyledDualFarmDisclaimer = styled.p`
  color: ${({ theme }) => theme.colors.text2};
  text-align: center;
`
const BlockNumber = styled.span`
  color: ${({ theme }) => theme.colors.primary2};
  margin-left: 4px;
`

const DualFarmDisclaimer = () => {
  const TranslateString = useI18n()

  return (
    <StyledDualFarmDisclaimer>
      {TranslateString(999, `HARD will be distributed weekly until block`)}
      <BlockNumber>{DUAL_FARM_ENDING_BLOCK}</BlockNumber>
    </StyledDualFarmDisclaimer>
  )
}

export default DualFarmDisclaimer
