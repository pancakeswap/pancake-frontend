import React from 'react'
import styled from 'styled-components'
import { Text, Button, HelpIcon, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const ButtonText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.xs} {
    display: block;
  }
`

const Container = styled.div`
  margin-right: 16px;
  display: flex;
  justify-content: flex-end;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1;
  }
`

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`

const HelpButton = () => {
  const { t } = useTranslation()
  return (
    <Container>
      <StyledLink external href="https://docs.pancakeswap.finance/products/syrup-pool/syrup-pool-faq">
        <Button px={['14px', null, null, null, '20px']} variant="subtle">
          <ButtonText color="backgroundAlt" bold fontSize="16px">
            {t('Help')}
          </ButtonText>
          <HelpIcon color="backgroundAlt" ml={[null, null, null, 0, '6px']} />
        </Button>
      </StyledLink>
    </Container>
  )
}

export default HelpButton
