import { useTranslation } from '@pancakeswap/localization'
import { Card, CardBody, CardHeader, Flex, Heading, Link, PageSection, Text } from '@pancakeswap/uikit'
import FoldableText from 'components/FoldableSection/FoldableText'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'

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
              {t('FAQ')}
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
            <FoldableText title={t('How do I earn commissions as an affiliate?')} mt="24px">
              <StyledListText color="textSubtle">
                {t('You earn commissions from most trading fees paid by your invitees for a limited period of time')}
              </StyledListText>
              <StyledListText color="textSubtle">
                {t('Trading pairs must meet the following eligibility criteria:')}
              </StyledListText>
              <StyledListText ml="16px" color="textSubtle">
                {t('Pairs must be in the PancakeSwap Token list for the following chains (')}
                <Link
                  external
                  style={{ display: 'inline-block' }}
                  href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-extended.json"
                >
                  <Text color="primary" ml="4px" as="span">
                    {t('BNB Chain')},
                  </Text>
                </Link>
                <Link
                  external
                  style={{ display: 'inline-block' }}
                  href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-arbitrum-default.json"
                >
                  <Text color="primary" ml="4px" as="span">
                    {t('Arbitrum One')},
                  </Text>
                </Link>
                <Link
                  external
                  style={{ display: 'inline-block' }}
                  href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-base-default.json"
                >
                  <Text color="primary" ml="4px" as="span">
                    {t('Base')},
                  </Text>
                </Link>
                <Link
                  external
                  style={{ display: 'inline-block' }}
                  href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-eth-default.json"
                >
                  <Text color="primary" ml="4px" as="span">
                    {t('Ethereum')},
                  </Text>
                </Link>
                <Link
                  external
                  style={{ display: 'inline-block' }}
                  href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-linea-default.json"
                >
                  <Text color="primary" ml="4px" as="span">
                    {t('Linea')},
                  </Text>
                </Link>
                <Link
                  external
                  style={{ display: 'inline-block' }}
                  href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-polygon-zkevm-default.json"
                >
                  <Text color="primary" ml="4px" as="span">
                    {t('Polygon zkEVM')},
                  </Text>
                </Link>
                <Link
                  external
                  style={{ display: 'inline-block' }}
                  href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-zksync-default.json"
                >
                  <Text color="primary" ml="4px" as="span">
                    {t('zkSync Era')}
                  </Text>
                </Link>
                <Text color="textSubtle" as="span">
                  {' '}
                  )
                </Text>
              </StyledListText>
              <StyledListText ml="16px" color="textSubtle">
                {t(
                  'Pairs must include at least 1 major token (i.e., BNB, BTC, BUSD, ETH, MATIC, ARB, DAI, USDT and/or USDC)',
                )}
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
