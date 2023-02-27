import styled from 'styled-components'
import { Card, CardBody, CardHeader, Heading, Text, Flex, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import FoldableText from 'components/FoldableSection/FoldableText'

const Wrapper = styled(Flex)`
  width: 100%;
  margin: auto;
  padding: 0 24px 72px 24px;
  flex-direction: column-reverse;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
    max-width: 1140px;
  }
`
const HoneyImage = styled.div`
  width: 200px;
  height: 224.67px;
  margin: 40px auto auto auto;
  align-self: flex-start;
  background: url(/images/pottery/honey.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 291px;
    min-width: 291px;
    height: 326.89px;
    min-height: 326.89px;
    margin: 40px 40px 0 0;
  }
`

const StyledCardbody = styled(CardBody)`
  div:first-child {
    margin-top: 0px;
  }
`

const InlineLink = styled(Link)`
  display: inline-block;
  margin: 0 4px;
`

const FAQ = () => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <HoneyImage />
      <Card>
        <CardHeader>
          <Heading color="secondary" scale="lg">
            {t('FAQ')}
          </Heading>
        </CardHeader>
        <StyledCardbody>
          <FoldableText title={t('How is odds calculated?')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              {t(
                "All CAKE deposits will be locked for the same duration, the odds of your address winning the prize pool is simply proportional to your CAKE deposit over the total CAKE deposit of the whole Pottery. Each week, eight (8) addresses are drawn randomly based on their odds. Simply put, if user A deposited 1 CAKE, user B deposited 2 CAKE, then user B's odds of winning is twice of user A's.",
              )}
            </Text>
          </FoldableText>
          <FoldableText title={t('Is there any risk associated with depositing and playing Pottery?')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              {t(
                "You will be locking your CAKE deposit for 10 weeks and you will not be able to withdraw early in any circumstances. Your principal (i.e. your deposit) will be returned to your 100% after 10 weeks. Only the staking rewards of your deposit will be used to fill and operate the Pottery. Simply put, you're only risking the staking rewards of your deposit.",
              )}
            </Text>
          </FoldableText>
          <FoldableText title={t('Where can I learn more about this new Pottery format?')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              {t('Please feel free to reach out to us on')}
              <InlineLink fontSize="14px" external href="https://t.me/pancakeswap">
                {t('Telegram')}
              </InlineLink>
              {t('or')}
              <InlineLink fontSize="14px" external href="https://discord.gg/pancakeswap">
                {t('Discord')}
              </InlineLink>
              {t(
                "if you're still unsure about the format! Please also let us know if you have any feedback for us to improve this further.",
              )}
            </Text>
          </FoldableText>
        </StyledCardbody>
      </Card>
    </Wrapper>
  )
}

export default FAQ
