import React from 'react'
import { Box, Button, Text, Heading } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/layout/Container'

const StyledFooter = styled(Box)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  padding-bottom: 32px;
  padding-top: 32px;
`

const Footer = () => {
  const { t } = useTranslation()

  return (
    <StyledFooter>
      <Container>
        <Box>
          <Heading as="h2" scale="lg" mb="16px">
            {t('Got a suggestion?')}
          </Heading>
          <Text as="p">
            {t('Community proposals are a great way to see how the community feels about your ideas.')}
          </Text>
          <Text as="p" mb="16px">
            {t(
              "They won't necessarily be implemented if the community votes successful, but suggestions with a lot of community support may be made into Core proposals.",
            )}
          </Text>

          <Button>{t('Make a Proposal')}</Button>
        </Box>
      </Container>
    </StyledFooter>
  )
}

export default Footer
