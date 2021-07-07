import React from 'react'
import { Box, Button, Flex, Heading, ProposalIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import DesktopImage from './DesktopImage'

const StyledHero = styled(Box)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  padding-bottom: 32px;
  padding-top: 32px;
`

const Hero = () => {
  const { t } = useTranslation()

  return (
    <StyledHero>
      <Container>
        <Flex alignItems="center" justifyContent="space-between">
          <Box pr="32px">
            <Heading as="h1" scale="xxl" color="secondary" mb="16px">
              {t('Voting')}
            </Heading>
            <Heading as="h3" scale="lg" mb="16px">
              {t('Have your say in the future of the PancakeSwap Ecosystem')}
            </Heading>
            <Button
              startIcon={<ProposalIcon color="currentColor" width="24px" />}
              as={Link}
              to="/voting/proposal/create"
            >
              {t('Make a Proposal')}
            </Button>
          </Box>
          <DesktopImage src="/images/voting/voting-presents.png" width={361} height={214} />
        </Flex>
      </Container>
    </StyledHero>
  )
}

export default Hero
