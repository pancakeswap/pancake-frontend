import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import UnlockButton from '../../../components/UnlockButton'

const StyledCardBody = styled(CardBody)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const StyledHeading = styled(Heading)`
  margin: 16px 0;
`

const UnlockWalletCard = () => {
  const TranslateString = useI18n()

  return (
    <Card isActive>
      <StyledCardBody>
        {/* Lottery ticket SVG  */}
        <StyledHeading size="md">{TranslateString(999, 'Unlock wallet to access lottery')}</StyledHeading>
        <UnlockButton />
      </StyledCardBody>
    </Card>
  )
}

export default UnlockWalletCard
