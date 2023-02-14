import styled from 'styled-components'
import { Card, CardBody, CardHeader, Heading, Text, Flex, Link, PageSection } from '@pancakeswap/uikit'
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

const InlineLink = styled(Link)`
  display: inline-block;
  margin: 0 4px;
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
            <FoldableText title={t('What does the “1x” or “0.5x” multiplier on a farm mean?')} mt="24px">
              <Text color="textSubtle">
                {t(
                  'The multiplier represents the amount of CAKE rewards each farm gets.For example, if a 1x farm was getting 1 CAKE per block, a 40x farm would be getting 40 CAKE per block.',
                )}
              </Text>
            </FoldableText>
            <FoldableText title={t('Where can I apply for a farm for my project?')} mt="24px">
              <Text color="textSubtle">
                {t('Visit our')}
                <InlineLink external href="https://docs.pancakeswap.finance/contact-us/business-partnerships">
                  {t('business contacts')}
                </InlineLink>
                {t('page.')}
              </Text>
            </FoldableText>
          </StyledCardBody>
        </Card>
      </Wrapper>
    </PageSection>
  )
}

export default Question
