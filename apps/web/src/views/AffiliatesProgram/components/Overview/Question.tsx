import styled from 'styled-components'
import { Card, CardBody, CardHeader, Heading, Text, Flex, PageSection } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import FoldableText from 'components/FoldableSection/FoldableText'
import useTheme from 'hooks/useTheme'

const Wrapper = styled(Flex)`
  width: 100%;
  margin: auto;
  flex-direction: column;
  align-items: center;
  max-width: calc(100%) - 38px;

  ${({ theme }) => theme.mediaQueries.xl} {
    max-width: 1028px;
  }
`

const StyledCardBody = styled(CardBody)`
  div:first-child {
    margin-top: 0px;
  }
`

const StyledListText = styled(Text)`
  position: relative;
  padding-left: 12px;

  &:before {
    content: '-';
    position: absolute;
    top: 0;
    left: 0;
  }
`

const Question = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <PageSection
      index={1}
      dividerPosition="top"
      concaveDivider
      clipFill={{ light: '#CAD6EE', dark: '#434575' }}
      background={theme.colors.gradientVioletAlt}
      innerProps={{ style: { padding: '0 16px' } }}
    >
      <Wrapper>
        <Text fontSize={['32px', '32px', '40px']} mb={['64px']} bold textAlign="center">
          {t('Still Got Questions?')}
        </Text>
        <Card>
          <CardHeader>
            <Heading color="secondary" scale="lg">
              {t('Details')}
            </Heading>
          </CardHeader>
          <StyledCardBody>
            <FoldableText title={t('What is the criteria to become a PancakeSwap affiliate?')} mt="24px">
              <StyledListText color="textSubtle">
                {t(
                  'At least 10,000 followers across social media platforms such as Twitter, Youtube, Discord, Instagram and Telegram',
                )}
              </StyledListText>
              <StyledListText color="textSubtle">
                {t('Proven track record of creating quality content related to crypto and especially DeFi')}
              </StyledListText>
              <StyledListText color="textSubtle">
                {t('Strong understanding of PancakeSwap and our ecosystem')}
              </StyledListText>
            </FoldableText>
            <FoldableText title={t('Pairs must meet the following eligibility criteria:')} mt="24px">
              <StyledListText color="textSubtle">
                {t('Pairs must be in “PancakeSwap Extended” official token list')}
              </StyledListText>
              <StyledListText color="textSubtle">
                {t('Pairs must include 1 major token (BNB, BTC, BUSD, ETH, USDT and USDC)')}
              </StyledListText>
            </FoldableText>
            <FoldableText title={t('How will I receive my commissions and how often will I be paid?')} mt="24px">
              <StyledListText color="textSubtle">
                {t(
                  'You will receive your commissions on a monthly basis. This means that you will receive payments for your commissions earned in the previous month at the beginning of each month.',
                )}
              </StyledListText>
              <StyledListText color="textSubtle">
                {t(
                  'You will be able to redeem your CAKE rewards from the affiliate dashboard page. Once redeemed, PancakeSwap will transfer the commission amount earned to your designated wallet. You will be able to see the details of each payment in your affiliate dashboard, including the amount, date, and status of each payment.',
                )}
              </StyledListText>
            </FoldableText>
            <FoldableText title={t('How do I track my referrals and commissions?')} mt="24px">
              <StyledListText color="textSubtle">
                {t('Affiliates can login to the affiliate dashboard and view your referral and commission information')}
              </StyledListText>
              <StyledListText color="textSubtle">
                {t(
                  'Your referrals will be listed in your affiliate dashboard, along with the date they were made, their status, and the commission amount earned',
                )}
              </StyledListText>
            </FoldableText>
            <FoldableText title={t('Is there a limited number of referrals i can refer?')} mt="24px">
              <StyledListText color="textSubtle">
                {t('No, users can refer as many friends as they wish')}
              </StyledListText>
            </FoldableText>
          </StyledCardBody>
        </Card>
      </Wrapper>
    </PageSection>
  )
}

export default Question
