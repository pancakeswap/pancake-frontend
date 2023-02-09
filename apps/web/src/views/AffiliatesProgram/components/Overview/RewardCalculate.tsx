import { Flex, Text, Button, Box, PageSection } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import Calculator from 'views/AffiliatesProgram/components/Overview/Calculator'
import CommissionStructure from 'views/AffiliatesProgram/components/Overview/CommissionStructure'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'

const Decorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;

  > img {
    position: absolute;
  }

  & :nth-child(1) {
    left: 20%;
    top: 5%;
    animation: ${floatingStarsLeft} 3s ease-in-out infinite;
  }
  & :nth-child(2) {
    left: 0;
    bottom: 5%;
    animation: ${floatingStarsRight} 3.5s ease-in-out infinite;
  }
  & :nth-child(3) {
    right: 10%;
    top: 5%;
    animation: ${floatingStarsRight} 4s ease-in-out infinite;
  }
  & :nth-child(4) {
    right: 0;
    top: 15%;
    animation: ${floatingStarsLeft} 6s ease-in-out infinite;
  }
  & :nth-child(5) {
    right: 10%;
    bottom: 5%;
    animation: ${floatingStarsRight} 6s ease-in-out infinite;
  }
}`

const RewardCalculate = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <PageSection
      index={1}
      dividerPosition="top"
      concaveDivider
      background={theme.colors.gradientBubblegum}
      clipFill={{ light: theme.colors.gradientBubblegum }}
    >
      <Decorations>
        <img src="/images/affiliates-program/m-1.png" width="110px" height="79px" alt="" />
        <img src="/images/affiliates-program/m-2.png" width="295.89px" height="226px" alt="" />
        <img src="/images/affiliates-program/m-3.png" width="42px" height="29px" alt="" />
        <img src="/images/affiliates-program/m-4.png" width="210px" height="210px" alt="" />
        <img src="/images/affiliates-program/m-5.png" width="72px" height="63px" alt="" />
      </Decorations>
      <Flex>
        <Flex width={['447px']} alignSelf={['center']} flexDirection="column">
          <Box m={['32px 0']}>
            <Text fontSize={['40px']} lineHeight="110%" color="body" bold>
              {t('Earn generous commissions on every referral')}
            </Text>
          </Box>
          <Text color="textSubtle" mb="32px">
            {t(
              "As a member of our affiliate program, you'll have access to a range of marketing materials, personalized support, and real-time reporting to help you maximize your earnings.",
            )}
          </Text>
          <Button width="fit-content">{t('Apply now!')}</Button>
        </Flex>
        <Calculator />
      </Flex>
      <CommissionStructure />
    </PageSection>
  )
}

export default RewardCalculate
