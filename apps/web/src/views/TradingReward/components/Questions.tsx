import styled from 'styled-components'
import { Card, CardBody, Text, Flex } from '@pancakeswap/uikit'
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
            <FoldableText title={t('Eligible trading pairs')} mt="24px">
              <StyledListText color="textSubtle">123</StyledListText>
            </FoldableText>
            <FoldableText title={t('Calculating team ranks and winners')} mt="24px">
              <StyledListText color="textSubtle">123</StyledListText>
            </FoldableText>
          </StyledCardBody>
        </Card>
      </Wrapper>
    </Container>
  )
}

export default Questions
