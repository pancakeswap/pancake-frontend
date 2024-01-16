import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text } from '@pancakeswap/uikit'

import { css, styled } from 'styled-components'

export const sharedCss = css`
  @media screen and (max-width: 396px) {
    width: calc(100vw - 70px);
  }
  @media screen and (max-width: 762px) and (min-width: 700px) {
    width: calc(50vw - 50px);
  }
`

const Wrapper = styled.div`
  border-radius: 32px;
  border: 2px solid #3c1786;
  background: var(--linear, linear-gradient(180deg, #7645d9 0%, #5121b1 100%));
  box-shadow: 0px 4px 0px 0px #3c1786;
  padding: 24px;
  box-sizing: border-box;
  width: 340px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 340px;
    padding: 24px 0px 24px 60px;
    height: 340px;
  }
  ${sharedCss}
`

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.warning};
  font-weight: 600;
  line-height: 110%;
  font-size: 40px;
`

const CommunitySummary = () => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Flex flexDirection="column">
        <Text color="white" bold fontSize="16px">
          {t('Community Members')}
        </Text>
        <StyledText fontSize="40px" bold mb="27px">
          2.0M +
        </StyledText>
        <Text color="white" bold fontSize="16px">
          {t('Multilingual Communities')}
        </Text>
        <StyledText fontSize="40px" bold mb="27px">
          15 +
        </StyledText>
        <Text color="white" bold fontSize="16px">
          {t('Community Ambassadors')}
        </Text>
        <StyledText fontSize="40px" bold mb="27px">
          35 +
        </StyledText>
      </Flex>
    </Wrapper>
  )
}

export default CommunitySummary
