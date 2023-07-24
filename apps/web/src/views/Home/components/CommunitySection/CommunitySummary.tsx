import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text } from '@pancakeswap/uikit'

import styled from 'styled-components'

const Wrapper = styled.div`
  width: 337px;
  transform: rotate(-2deg);
  border-radius: 32px;
  border: 2px solid #3c1786;
  background: var(--linear, linear-gradient(180deg, #7645d9 0%, #5121b1 100%));
  box-shadow: 0px 4px 0px 0px #3c1786;
  padding: 24px 0px 24px 60px;
  box-sizing: border-box;
`

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.warning};
  font-weight: 600;
  line-height: 110%;
  font-size: 40px;
`

const LotteryCardContent = () => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Flex flexDirection="column">
        <Text color="white" bold fontSize="16px">
          {t('Community Members')}
        </Text>
        <StyledText fontSize="40px" bold mb="27px">
          1.7M +
        </StyledText>
        <Text color="white" bold fontSize="16px">
          {t('Multilingual Communities')}
        </Text>
        <StyledText fontSize="40px" bold mb="27px">
          15 +
        </StyledText>
        <Text color="white" bold fontSize="16px">
          {t('Community Members')}
        </Text>
        <StyledText fontSize="40px" bold mb="27px">
          30 +
        </StyledText>
      </Flex>
    </Wrapper>
  )
}

export default LotteryCardContent
