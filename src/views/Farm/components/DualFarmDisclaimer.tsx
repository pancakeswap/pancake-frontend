import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'

const StyledDualFarmDisclaimer = styled.p`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`
const BlockNumber = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  margin-left: 4px;
`

const DualFarmDisclaimer: React.FC<{ tokenName: string; endBlock: number }> = ({ tokenName, endBlock }) => {
  const TranslateString = useI18n()

  return (
    <StyledDualFarmDisclaimer>
      {`${tokenName} `}
      {TranslateString(518, `will be distributed weekly until block`)}
      <BlockNumber>{endBlock}</BlockNumber>
    </StyledDualFarmDisclaimer>
  )
}

export default DualFarmDisclaimer
