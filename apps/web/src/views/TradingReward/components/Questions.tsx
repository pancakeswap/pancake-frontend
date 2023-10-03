import { styled } from 'styled-components'
import { Card, CardBody, Text, Flex, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import FoldableText from 'components/FoldableSection/FoldableText'

const Container = styled(Flex)`
  padding: 48px 16px;
  background: ${({ theme }) => theme.colors.gradientInverseBubblegum};
`

const Wrapper = styled(Flex)`
  width: 100%;
  margin: auto;
  flex-direction: column;
  align-items: center;
  max-width: calc(100%) - 38px;

  ${({ theme }) => theme.mediaQueries.xl} {
    max-width: 1140px;
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

const Questions = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <Wrapper>
        <Text color="secondary" fontSize={['32px', '32px', '40px']} mb={['64px']} bold textAlign="center">
          {t('Still Got Questions?')}
        </Text>
        <Card style={{ width: '100%' }}>
          <StyledCardBody>
            <FoldableText title={t('Why my traded volume was not tracked?')} mt="24px">
              <StyledListText color="textSubtle">
                {t('Volume numbers take time to update and are subject to SubGraph delays. Please check back later')}
              </StyledListText>
              <StyledListText color="textSubtle">
                {t(
                  'Please ensure your trade is routed through the trading pairs eligible for trading rewards.Check out',
                )}
                <Link
                  style={{ display: 'inline-block' }}
                  external
                  href="https://docs.pancakeswap.finance/products/pancakeswap-exchange/fees-and-routes#check-the-fee-rate-and-fee-amount-that-is-currently-applied"
                >
                  <Text color="primary" ml="4px" as="span">
                    {t('this tutorial')}
                  </Text>
                </Link>
                <Text color="textSubtle" ml="4px" as="span">
                  {t('for how to view your trading routes')}
                </Text>
              </StyledListText>
              <StyledListText color="textSubtle">
                {t(
                  'If you are trading on Ethereum, please use the same wallet address eligible for the trading reward program',
                )}
              </StyledListText>
              <StyledListText color="textSubtle">
                {t('If your trading volume within a pair is too small, you may not be eligible to claim any rewards')}
              </StyledListText>
              <StyledListText color="textSubtle">
                {t(
                  'Using third-party trading aggregators may result in trades being routed through other liquidity providers and not being tracked',
                )}
              </StyledListText>
            </FoldableText>
            <FoldableText title={t('Why I traded a lot but only received a very small amount of rewards')} mt="24px">
              <StyledListText color="textSubtle">
                {t(
                  'The amount of the trading reward is based on the trading fee paid in those trades.If your trades are routed through pairs with a low fee tier, for example, 0.01%, you are paying a very small fee for your trade. Therefore the number of rewards will become lower accordingly.',
                )}
              </StyledListText>
            </FoldableText>
            <FoldableText
              title={t('My address was previously eligible. Why is it showing not eligible now?')}
              mt="24px"
            >
              <StyledListText color="textSubtle">
                {t(
                  'Each campaign has its own eligibility requirements, like the unlock time of the CAKE staking position.',
                )}
              </StyledListText>
              <StyledListText color="textSubtle">
                {t(
                  'You may need to extend your locked CAKE staking position. Please follow the instructions on the page.',
                )}
              </StyledListText>
            </FoldableText>
          </StyledCardBody>
        </Card>
      </Wrapper>
    </Container>
  )
}

export default Questions
