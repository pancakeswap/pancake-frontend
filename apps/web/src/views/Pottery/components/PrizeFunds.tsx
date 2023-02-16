import styled from 'styled-components'
import { Box, Flex, Text, Heading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Divider from 'components/Divider'
import Image from 'next/image'

const PrizeFundsContainer = styled(Flex)`
  width: 100%;
  margin: auto;
  padding: 0 24px;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.xl} {
    max-width: 1140px;
  }
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

const StyledStepCard = styled(Box)`
  display: flex;
  align-self: center;
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

const AllocationMatch: React.FC<React.PropsWithChildren<{ color: string; text: string }>> = ({ color, text }) => {
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
    <StyledStepCard width={['100%', '280px', '330px', '380px']}>
      <StepCardInner height="auto">
        <Flex mb="34px" justifyContent="center">
          <Image alt="pottery-prize-chart" width={103} height={103} src="/images/pottery/chart.svg" />
        </Flex>
        <AllocationGrid>
          <AllocationMatch color="#D750B2" text={t('Prize Pool')} />
          <Text textAlign="right" bold mb="12px">
            73.6%
          </Text>
          <AllocationMatch color="#A881FC" text={t('Rewards')} />
          <Text textAlign="right" bold mb="12px">
            20%
          </Text>
          <AllocationMatch color="#36E8F5" text={t('Fees')} />
          <Text textAlign="right" bold>
            6.4%
          </Text>
        </AllocationGrid>
      </StepCardInner>
    </StyledStepCard>
  )
}

const PrizeFunds: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  return (
    <PrizeFundsContainer>
      <Heading mb="43px" scale="xl" color="secondary">
        {t('Split Breakdown')}
      </Heading>
      <Flex flexDirection={['column', 'column', 'column', 'column', 'row']}>
        <Flex width={['100%', '100%', '100%', '498px']} flexDirection="column">
          <Text color="textSubtle">{t('The staking rewards of funds')}</Text>
          <Heading my="16px" scale="md">
            {t('Prize Pool (80%)')}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t('80% of staking rewards from the funds deposited')}
              </Text>
            </li>
          </BulletList>
          <Heading my="16px" scale="md">
            {t('Rewards (20%)')}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t('20% of the staking rewards from the funds deposited')}
              </Text>
            </li>
          </BulletList>
          <Heading my="16px" scale="md">
            {t('Fees (8%)')}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t('8% of the prize pot distributed each week will be charged as fees')}
              </Text>
            </li>
          </BulletList>
        </Flex>
        <Flex
          ml={['0px', '0px', '0px', '0px', '40px']}
          mt={['40px', '40px', '40px', '40px', '0px']}
          justifyContent="center"
        >
          <PoolAllocations />
        </Flex>
      </Flex>
      <Text maxWidth="918px" mt="20px" fontSize="14px" color="textSubtle">
        {t(
          'Since the rewards from lock-staking are only distributed at the end of the duration, the prize pool to be distributed in each of the 10 weeks upon deposit is borrowed from the CAKE treasury based on the estimated APR. The rewards at the end of the duration from the deposit will be used to repay the treasury and to distribute the 20% staking rewards. Because the APR may change over the duration based on other deposits and their lock-periods in the lock CAKE pool, there may be a small deviance from the above percentages specified (+/- 10%). But, ultimately all staking rewards net of the Pottery fees will be returned to depositors through prize pool or rewards -- the expected value is the same.',
        )}
      </Text>
      <Box width="100%" m="40px 0">
        <Divider />
      </Box>
    </PrizeFundsContainer>
  )
}

export default PrizeFunds
