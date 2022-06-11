import styled from 'styled-components'
import { Card, CardBody, CardHeader, Heading, Text, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import FoldableText from 'components/FoldableSection/FoldableText'

const Wrapper = styled(Flex)`
  width: 100%;
  margin: auto;
  padding: 0 48px 72px 48px;
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
  background: url(/images/syruppot/honey.png);
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
              {t('no Text')}
            </Text>
          </FoldableText>
          <FoldableText title={t('Is there any risk associated with depositing and playing Syrup Pot?')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              {t('You can choose one or both at the same time!')}
            </Text>
            <Text fontSize="14px" color="textSubtle">
              {t(
                'We recommend using the Basic Sale first for most users, because the amount of tokens you can get for your LP Tokens should be a little higher than in the Unlimited Sale.',
              )}
            </Text>
          </FoldableText>
          <FoldableText title={t('Where can I read the documentation about Syrup Pot?')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              {t(
                'Response to open question goes here. Here is text answering the question which is open. Response to open question goes here. Here is text answering the question which is open. ',
              )}
            </Text>
          </FoldableText>
        </StyledCardbody>
      </Card>
    </Wrapper>
  )
}

export default FAQ
