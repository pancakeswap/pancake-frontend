import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Ticket } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'

const StyledCardBody = styled(CardBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  max-height: 196px;
`

const StyledHeading = styled(Heading)`
  margin: 16px 0;
`

const IconWrapper = styled.div`
  svg {
    width: 80px;
    height: 80px;
  }
`

const UnlockWalletCard = () => {
  const { t } = useTranslation()

  return (
    <Card isActive>
      <StyledCardBody>
        <IconWrapper>
          <Ticket />
        </IconWrapper>
        <div>
          <StyledHeading scale="md">{t('Unlock wallet to access lottery')}</StyledHeading>
          <UnlockButton />
        </div>
      </StyledCardBody>
    </Card>
  )
}

export default UnlockWalletCard
