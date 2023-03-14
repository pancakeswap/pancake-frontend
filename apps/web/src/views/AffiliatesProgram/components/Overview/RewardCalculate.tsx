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
  display: none;
  z-index: -1;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }

  > img {
    position: absolute;
    z-index: -1;
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
      clipFill={{
        light: 'linear-gradient(139.73deg, #E2FCFF 0%, #EBF3FF 100%)',
        dark: 'linear-gradient(139.73deg, #313D5C 0%, #383258 100%)',
      }}
      innerProps={{ style: { padding: '0 16px' } }}
    >
      <Decorations>
        <img src="/images/affiliates-program/m-1.png" width="110px" height="79px" alt="" />
        <img src="/images/affiliates-program/m-2.png" width="295.89px" height="226px" alt="" />
        <img src="/images/affiliates-program/m-3.png" width="42px" height="29px" alt="" />
        <img src="/images/affiliates-program/m-4.png" width="210px" height="210px" alt="" />
        <img src="/images/affiliates-program/m-5.png" width="72px" height="63px" alt="" />
      </Decorations>
      <Flex mt={['20px', '40px', '60px', '150px']} flexDirection={['column', 'column', 'column', 'column', 'row']}>
        <Flex width={['100%', '100%', '447px']} alignSelf={['center']} flexDirection="column">
          <Box m={['32px 0']}>
            <Text fontSize={['40px']} lineHeight="110%" color="body" bold>
              {t('Unleash Your Earning Potential with PancakeSwap')}
            </Text>
          </Box>
          <Text color="textSubtle" mb="32px">
            {t(
              'Join our community of top-earning affiliates and make the most of every referral, with market-leading commission rates and endless earning opportunities.',
            )}
          </Text>
          <Button width="fit-content">{t('Join Now!')}</Button>
        </Flex>
        <Calculator />
      </Flex>
      <CommissionStructure />
    </PageSection>
  )
}

export default RewardCalculate
