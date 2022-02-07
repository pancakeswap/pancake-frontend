import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Text, Heading, useMatchBreakpoints, Link, Image } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { BallWithNumber, MatchExampleA, MatchExampleB, PoolAllocationChart } from '../svgs'

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBorder};
  height: 1px;
  margin: 40px 0;
  width: 100%;
`

const BulletList = styled.ul`
  list-style-type: none;
  margin-left: 8px;
  padding: 0;
  li {
    margin: 0;
    padding: 0;
  }
  li::before {
    content: '•';
    margin-right: 4px;
    color: ${({ theme }) => theme.colors.textSubtle};
  }
  li::marker {
    font-size: 12px;
  }
`

const StepContainer = styled(Flex)`
  gap: 24px;
  width: 100%;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const StyledStepCard = styled(Box)`
  display: flex;
  align-self: baseline;
  position: relative;
  background: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  border-radius: ${({ theme }) => theme.radii.card};
`

const StepCardInner = styled(Box)`
  width: 100%;
  padding: 24px;
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
`

type Step = { title: string; subtitle: string; label: string }

const StepCard: React.FC<{ step: Step }> = ({ step }) => {
  return (
    <StyledStepCard width="100%">
      <StepCardInner height={['200px', '180px', null, '200px']}>
        <Text mb="16px" fontSize="12px" bold textAlign="right" textTransform="uppercase">
          {step.label}
        </Text>
        <Heading mb="16px" scale="lg" color="secondary">
          {step.title}
        </Heading>
        <Text color="textSubtle">{step.subtitle}</Text>
      </StepCardInner>
    </StyledStepCard>
  )
}

const BallsContainer = styled(Flex)`
  padding-left: 28px;
  align-items: center;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.xs} {
    gap: 7px;
    padding-left: 36px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    gap: 15px;
    padding-left: 40px;
  }
`

const InlineLink = styled(Link)`
  display: inline;
`

const ExampleBalls = () => {
  const { isDesktop } = useMatchBreakpoints()
  const ballSize = isDesktop ? '24px' : '32px'
  const fontSize = isDesktop ? '14px' : '16px'
  return (
    <BallsContainer>
      <BallWithNumber size={ballSize} fontSize={fontSize} color="yellow" number="9" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="green" number="1" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="aqua" number="3" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="teal" number="6" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="lilac" number="6" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="pink" number="2" />
    </BallsContainer>
  )
}

const MatchExampleContainer = styled(Flex)`
  height: 100%;
  flex-direction: column;
`

const MatchExampleCard = () => {
  const { isDark } = useTheme()
  const { isXs } = useMatchBreakpoints()
  const { t } = useTranslation()
  const exampleWidth = isXs ? '210px' : '258px'
  return (
    <StyledStepCard width={['280px', '330px', '330px']}>
      <StepCardInner height="210px">
        <MatchExampleContainer>
          <ExampleBalls />
          <Flex>
            <Text lineHeight="72px" textAlign="right" color="secondary" bold mr="20px">
              {t('A')}
            </Text>
            <MatchExampleA width={exampleWidth} height="46px" isDark={isDark} />
          </Flex>
          <Flex>
            <Text lineHeight="72px" textAlign="right" color="secondary" bold mr="20px">
              {t('B')}
            </Text>
            <MatchExampleB width={exampleWidth} height="46px" isDark={isDark} />
          </Flex>
        </MatchExampleContainer>
      </StepCardInner>
    </StyledStepCard>
  )
}

const AllocationGrid = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  grid-auto-rows: max-content;
  row-gap: 4px;
`

const AllocationColorCircle = styled.div<{ color: string }>`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  background-color: ${({ color }) => color};
`

const AllocationMatch: React.FC<{ color: string; text: string }> = ({ color, text }) => {
  return (
    <Flex alignItems="center">
      <AllocationColorCircle color={color} />
      <Text color="textSubtle">{text}</Text>
    </Flex>
  )
}

const PoolAllocations = () => {
  const { t } = useTranslation()
  return (
    <StyledStepCard width={['280px', '330px', '380px']}>
      <StepCardInner height="auto">
        <Flex mb="32px" justifyContent="center">
          <PoolAllocationChart width="100px" height="100px" />
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
            {t('Digits matched')}
          </Text>
          <Text fontSize="12px" color="secondary" bold textAlign="right" textTransform="uppercase">
            {t('Prize pool allocation')}
          </Text>
        </Flex>
        <AllocationGrid>
          <AllocationMatch color="#FFE362" text={t('Matches first %digits%', { digits: 1 })} />
          <Text textAlign="right" bold>
            2%
          </Text>
          <AllocationMatch color="#85C54E" text={t('Matches first %digits%', { digits: 2 })} />
          <Text textAlign="right" bold>
            3%
          </Text>
          <AllocationMatch color="#028E75" text={t('Matches first %digits%', { digits: 3 })} />
          <Text textAlign="right" bold>
            5%
          </Text>
          <AllocationMatch color="#36E8F5" text={t('Matches first %digits%', { digits: 4 })} />
          <Text textAlign="right" bold>
            10%
          </Text>
          <AllocationMatch color="#A881FC" text={t('Matches first %digits%', { digits: 5 })} />
          <Text textAlign="right" bold>
            20%
          </Text>
          <AllocationMatch color="#D750B2" text={t('Matches all 6')} />
          <Text textAlign="right" bold>
            40%
          </Text>
          <AllocationMatch color="#BDC2C4" text={t('Burn Pool')} />
          <Text textAlign="right" bold>
            20%
          </Text>
        </AllocationGrid>
      </StepCardInner>
    </StyledStepCard>
  )
}

const GappedFlex = styled(Flex)`
  gap: 24px;
`

const HowToPlay: React.FC = () => {
  const { t } = useTranslation()

  const steps: Step[] = [
    {
      label: t('Step %number%', { number: 1 }),
      title: t('Buy Tickets'),
      subtitle: t('Prices are set when the round starts, equal to 5 USD in CAKE per ticket.'),
    },
    {
      label: t('Step %number%', { number: 2 }),
      title: t('Wait for the Draw'),
      subtitle: t('There is one draw every day alternating between 0 AM UTC and 12 PM UTC.'),
    },
    {
      label: t('Step %number%', { number: 3 }),
      title: t('Check for Prizes'),
      subtitle: t('Once the round’s over, come back to the page and check to see if you’ve won!'),
    },
  ]
  return (
    <Box width="100%">
      <Flex mb="40px" alignItems="center" flexDirection="column">
        <Heading mb="24px" scale="xl" color="secondary">
          {t('How to Play')}
        </Heading>
        <Text textAlign="center">
          {t(
            'If the digits on your tickets match the winning numbers in the correct order, you win a portion of the prize pool.',
          )}
        </Text>
        <Text>{t('Simple!')}</Text>
      </Flex>
      <StepContainer>
        {steps.map((step) => (
          <StepCard key={step.label} step={step} />
        ))}
      </StepContainer>
      <Divider />
      <GappedFlex flexDirection={['column', 'column', 'column', 'row']}>
        <Flex flex="2" flexDirection="column">
          <Heading mb="24px" scale="lg" color="secondary">
            {t('Winning Criteria')}
          </Heading>
          <Heading mb="24px" scale="md">
            {t('The digits on your ticket must match in the correct order to win.')}
          </Heading>
          <Text mb="16px" color="textSubtle">
            {t('Here’s an example lottery draw, with two tickets, A and B.')}
          </Text>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t(
                  'Ticket A: The first 3 digits and the last 2 digits match, but the 4th digit is wrong, so this ticket only wins a “Match first 3” prize.',
                )}
              </Text>
            </li>
            <li>
              <Text display="inline" color="textSubtle">
                {t(
                  'Ticket B: Even though the last 5 digits match, the first digit is wrong, so this ticket doesn’t win a prize.',
                )}
              </Text>
            </li>
          </BulletList>
          <Text mt="16px" color="textSubtle">
            {t(
              'Prize brackets don’t ‘stack’: if you match the first 3 digits in order, you’ll only win prizes from the ‘Match 3’ bracket, and not from ‘Match 1’ and ‘Match 2’.',
            )}
          </Text>
        </Flex>
        <Flex flex="1" justifyContent="center">
          <MatchExampleCard />
        </Flex>
      </GappedFlex>
      <Divider />
      <GappedFlex flexDirection={['column', 'column', 'column', 'row']}>
        <Flex flex="2" flexDirection="column">
          <Heading mb="24px" scale="lg" color="secondary">
            {t('Prize Funds')}
          </Heading>
          <Text color="textSubtle">{t('The prizes for each lottery round come from three sources:')}</Text>
          <Heading my="16px" scale="md">
            {t('Ticket Purchases')}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t('100% of the CAKE paid by people buying tickets that round goes back into the prize pools.')}
              </Text>
            </li>
          </BulletList>
          <Heading my="16px" scale="md">
            {t('Rollover Prizes')}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t(
                  'After every round, if nobody wins in one of the prize brackets, the unclaimed CAKE for that bracket rolls over into the next round and are redistributed among the prize pools.',
                )}
              </Text>
            </li>
          </BulletList>
          <Heading my="16px" scale="md">
            {t('CAKE Injections')}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t(
                  'An average total of 35,000 CAKE from the treasury is added to lottery rounds over the course of a week. This CAKE is of course also included in rollovers! Read more in our guide to ',
                )}
                <InlineLink href="https://docs.pancakeswap.finance/tokenomics/cake/cake-tokenomics">
                  {t('CAKE Tokenomics')}
                </InlineLink>
              </Text>
            </li>
          </BulletList>
        </Flex>
        <Flex flex="1" justifyContent="center">
          <PoolAllocations />
        </Flex>
      </GappedFlex>
      <Divider />
      <Flex justifyContent="center" alignItems="center" flexDirection={['column', 'column', 'row']}>
        <Image width={240} height={172} src="/images/lottery/tombola.png" alt="tombola bunny" mr="8px" mb="16px" />
        <Flex maxWidth="300px" flexDirection="column">
          <Heading mb="16px" scale="md">
            {t('Still got questions?')}
          </Heading>
          <Text>
            {t('Check our in-depth guide on')}{' '}
            <InlineLink href="https://docs.pancakeswap.finance/products/lottery/lottery-guide">
              {t('how to play the PancakeSwap lottery!')}
            </InlineLink>
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export default HowToPlay
