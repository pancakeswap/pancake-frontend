// @ts-nocheck
import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text as UIKitText } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Container from 'components/layout/Container'

const StyledHowItWorks = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.textSubtle};
  padding: 24px 0;
`

const Section = styled.div`
  margin-bottom: 24px;
`

const Icon = styled.div`
  text-align: center;
`

const Text = styled(UIKitText)`
  flex: 1;
  padding: 0 8px;
`

const Row = styled.div`
  align-items: start;
  display: flex;
  margin-bottom: 16px;
`

// TODO: use the one from the UI Kit
const ArrowForward = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 13.0022H16.17L11.29 17.8822C10.9 18.2722 10.9 18.9122 11.29 19.3022C11.68 19.6922 12.31 19.6922 12.7 19.3022L19.29 12.7122C19.68 12.3222 19.68 11.6922 19.29 11.3022L12.71 4.70217C12.32 4.31217 11.69 4.31217 11.3 4.70217C10.91 5.09217 10.91 5.72217 11.3 6.11217L16.17 11.0022H5C4.45 11.0022 4 11.4522 4 12.0022C4 12.5522 4.45 13.0022 5 13.0022Z"
      fill="#7645D9"
    />
  </svg>
)

const HowItWorks = () => {
  const TranslateString = useI18n()

  return (
    <Container>
      <StyledHowItWorks>
        <Section>
          <Heading id="how-it-works" color="secondary" size="lg" mb="16px">
            {TranslateString(999, 'How it works')}
          </Heading>
          <Row>
            <Icon>
              <ArrowForward />
            </Icon>
            <Text>
              {TranslateString(
                999,
                'Winners will be able to claim an NFT on this page once the claiming period starts.',
              )}
            </Text>
          </Row>
          <Row>
            <Icon>
              <ArrowForward />
            </Icon>
            <Text>
              {TranslateString(999, 'If you’re not selected, you won’t be able to claim. Better luck next time!')}
            </Text>
          </Row>
          <Row>
            <Icon>
              <ArrowForward />
            </Icon>
            <Text>
              {TranslateString(
                999,
                "Winners can trade in their NFTs for a CAKE value until the expiry date written below. If you don't trade in your NFT by then, don’t worry: you’ll still keep it in your wallet!",
              )}
            </Text>
          </Row>
        </Section>
        <Section>
          <Heading color="secondary" size="lg" mb="16px">
            {TranslateString(999, 'How are winners selected?')}
          </Heading>
          <Row>
            <Icon>
              <ArrowForward />
            </Icon>
            <Text>{TranslateString(999, 'Winners are selected at random! Good luck!')}</Text>
          </Row>
        </Section>
        <div>
          <Button
            as="a"
            href="https://docs.google.com/forms/d/e/1FAIpQLSfToBNlovtMvTZFSwOhk0TBiDPMGasLxqG0RB-kJN85HR_avA/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            {TranslateString(999, 'Register for a chance to win')}
          </Button>
        </div>
      </StyledHowItWorks>
    </Container>
  )
}

export default HowItWorks
