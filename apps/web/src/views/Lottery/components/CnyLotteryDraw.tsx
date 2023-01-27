import styled from 'styled-components'
import { Box, Flex, Text, PageSection } from '@pancakeswap/uikit'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'
import { useTranslation } from '@pancakeswap/localization'

const Decorations = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  top: 0;
  left: 0;

  > img {
    display: none;
    position: absolute;
  }

  & :nth-child(1) {
    top: 8%;
    left: 22%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(2) {
    top: 44%;
    left: 13%;
    animation: ${floatingStarsLeft} 2.5s ease-in-out infinite;
  }

  & :nth-child(3) {
    left: 25%;
    bottom: 15%;
    animation: ${floatingStarsRight} 6s ease-in-out infinite;
  }

  & :nth-child(4) {
    top: 2%;
    right: 25%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(5) {
    top: 32%;
    right: 33%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(6) {
    top: 25%;
    right: 15%;
    animation: ${floatingStarsLeft} 2.5s ease-in-out infinite;
  }

  & :nth-child(7) {
    right: 30%;
    bottom: 10%;
    animation: ${floatingStarsRight} 6s ease-in-out infinite;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > img {
      display: block;
    }
  }
`

const GoldText = styled(Text)`
  font-weight: 600;
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const WhiteText = styled(Text)`
  color: white;
  font-weight: 600;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const CnyLotteryDraw = () => {
  const { t } = useTranslation()

  return (
    <PageSection
      index={1}
      position="relative"
      dividerPosition="top"
      concaveDivider
      background="linear-gradient(180deg, #7645D9 0%, #5121B1 100%)"
      clipFill={{ light: '#7645D9', dark: '#7645D9' }}
      dividerFill={{ light: '#8D1F0B', dark: '#8D1F0B' }}
    >
      <Decorations>
        <img src="/images/cny-asset/ball-1.png" width="127px" height="127px" alt="" />
        <img src="/images/cny-asset/ball-5.png" width="150px" height="150px" alt="" />
        <img src="/images/cny-asset/ball-3.png" width="88px" height="88px" alt="" />
        <img src="/images/cny-asset/ball-4.png" width="130px" height="130px" alt="" />
        <img src="/images/cny-asset/ball-2.png" width="117px" height="117px" alt="" />
        <img src="/images/cny-asset/ball-6.png" width="158px" height="158px" alt="" />
        <img src="/images/cny-asset/ball-7.png" width="128px" height="128px" alt="" />
      </Decorations>
      <Flex
        position="relative"
        zIndex="1"
        flexDirection="column"
        justifyContent="center"
        width={['100%', '100%', '500px']}
      >
        <WhiteText textAlign="center" fontSize={['20px', '24px', '32px']} bold>
          {t('PancakeSwap CNY Lottery Draw')}
        </WhiteText>
        <Flex flexDirection={['column', 'column', 'row']} alignItems="center" justifyContent="center" mb="12px">
          <WhiteText mr="4px">{t('Draw Date:')}</WhiteText>
          <GoldText>28th Jan, 12:00pm UTC</GoldText>
        </Flex>
        <Flex flexDirection={['column', 'column', 'row']} alignItems="center" justifyContent="center" mb="12px">
          <WhiteText mr="4px">{t('Draw No:')}</WhiteText>
          <GoldText>#792</GoldText>
        </Flex>
        <Flex flexDirection={['column', 'column', 'row']} alignItems="center" justifyContent="center" mb="12px">
          <WhiteText mr="4px" fontSize={['14px', '14px', '16px']}>
            {t('Tickets for this round start selling on:')}
          </WhiteText>
          <GoldText>27th Jan, 12:00am UTC</GoldText>
        </Flex>
        <WhiteText textAlign="center" mb="20px">
          {t('Potential Prize Pot:')}
        </WhiteText>
        <GoldText textAlign="center">{t('Up to')}</GoldText>
        <GoldText fontSize="64px" textAlign="center">
          $150,000
        </GoldText>
        <GoldText textAlign="center">{t('In Prizes!')}</GoldText>
      </Flex>
    </PageSection>
  )
}

export default CnyLotteryDraw
