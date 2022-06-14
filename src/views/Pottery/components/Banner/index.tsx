import styled from 'styled-components'
import { Flex, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import StakeToWinButton from 'views/Pottery/components/Banner/StakeToWinButton'
import { BannerTimer } from 'views/Pottery/components/Timer'
import { OutlineText, DarkTextStyle } from 'views/Pottery/components/TextStyle'
import TicketsDecorations from 'views/Pottery/components/Banner/TicketsDecorations'

const PotteryBanner = styled(Flex)`
  position: relative;
  overflow: hidden;
  padding: 64px 0 75px 0;
  background: linear-gradient(180deg, #ffd800 0%, #fdab32 100%);

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 87px 0 148px 0;
  }
`

const Decorations = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(/images/pottery/bg-star.svg);
  background-repeat: no-repeat;
  background-position: center 0;
  background-size: cover;
  pointer-events: none;
`

const BannerBunny = styled.div`
  width: 221px;
  height: 348px;
  margin: 63px auto auto auto;
  background: url(/images/pottery/banner-bunny.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 370px;
    height: 549px;
    margin-top: 0;
  }
`

const Banner: React.FC = () => {
  const { t } = useTranslation()

  return (
    <PotteryBanner>
      <Decorations />
      <TicketsDecorations />
      <Flex
        margin="auto"
        style={{ zIndex: '1' }}
        flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'row']}
      >
        <BannerBunny />
        <Flex
          ml={['0', '0', '0', '46px']}
          flexDirection="column"
          alignItems={['center', 'center', 'center', 'flex-start']}
        >
          <Flex>
            <OutlineText
              fontSize={['20px', '20px', '20px', '20px', '24px']}
              style={{ alignSelf: 'flex-end' }}
              bold
              defaultType
            >
              {t('The PancakeSwap')}
            </OutlineText>
            <OutlineText fontSize={['24px', '24px', '24px', '24px', '32px']} bold ml="4px">
              {t('Pottery')}
            </OutlineText>
          </Flex>
          <OutlineText fontSize={['40px', '64px']}>$24,232,232</OutlineText>
          <DarkTextStyle m="-20px 0 0 0" fontSize={['32px', '40px']} bold>
            {t('To be won !')}
          </DarkTextStyle>
          <StakeToWinButton />
          <Box style={{ marginTop: '30px' }}>
            <Text color="white" bold as="span">
              {t('Deposit CAKE for')}
            </Text>
            <DarkTextStyle ml="3px" bold as="span">
              {t('10 Weeks to earn')}
            </DarkTextStyle>
          </Box>
          <Box>
            <Text color="white" bold as="span">
              {t('to earn')}
            </Text>
            <DarkTextStyle m="0 3px" bold as="span">
              43.23%
            </DarkTextStyle>
            <Text color="white" bold as="span">
              {t('APY')}
            </Text>
          </Box>
          <Box>
            <Text color="white" bold as="span">
              {t('And a chance to')}
            </Text>
            <DarkTextStyle ml="3px" bold as="span">
              {t('win prize pot!')}
            </DarkTextStyle>
          </Box>
          <BannerTimer />
        </Flex>
      </Flex>
    </PotteryBanner>
  )
}

export default Banner
