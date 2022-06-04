import styled from 'styled-components'
import { Flex, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import StakeToWinButton from 'views/SyrupPot/components/Banner/StakeToWinButton'
import { BannerTimer } from 'views/SyrupPot/components/Timer'

const SyrupPotBanner = styled(Flex)`
  position: relative;
  height: calc(100% - 130px);
  background: linear-gradient(180deg, #ffd800 0%, #fdab32 100%);
`

const Decorations = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(/images/syruppot/bg-star.svg);
  background-repeat: no-repeat;
  background-position: center 0;
  background-size: cover;
  pointer-events: none;
`

const BannerBunny = styled.div`
  width: 355px;
  height: 531px;
  background: url(/images/syruppot/banner-bunny.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const OutlineText = styled(Text)<{ defaultType?: boolean }>`
  padding: 0 2px;
  color: ${({ theme, defaultType }) => (defaultType ? '#ffffff' : theme.colors.secondary)};
  background: ${({ theme, defaultType }) => (defaultType ? theme.colors.secondary : '#ffffff')};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 4px transparent;
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 4px 12px rgba(14, 14, 44, 0.1);
`

const TextStyle = styled(Text)<{ isBlack?: boolean }>`
  color: ${({ isBlack }) => (isBlack ? '#280D5F' : '#ffffff')};
`

const Banner: React.FC = () => {
  const { t } = useTranslation()

  return (
    <SyrupPotBanner>
      <Decorations />
      <Flex margin="auto">
        <BannerBunny />
        <Flex ml="46px" flexDirection="column">
          <Flex>
            <OutlineText fontSize="24px" bold defaultType>
              The PancakeSwap
            </OutlineText>
            <OutlineText fontSize="24px" bold ml="4px">
              {t('Syrup Pot')}
            </OutlineText>
          </Flex>
          <OutlineText fontSize="64px">$24,232,232</OutlineText>
          <TextStyle isBlack m="-20px 0 0 0" fontSize="40px" bold>
            To be won !
          </TextStyle>
          <StakeToWinButton />
          <Box style={{ marginTop: '30px' }}>
            <TextStyle bold as="span">
              Deposit CAKE for
            </TextStyle>
            <TextStyle isBlack ml="3px" bold as="span">
              10 Weeks to earn
            </TextStyle>
          </Box>
          <Box>
            <TextStyle bold as="span">
              to earn
            </TextStyle>
            <TextStyle isBlack m="0 3px" bold as="span">
              43.23%
            </TextStyle>
            <TextStyle bold as="span">
              APY
            </TextStyle>
          </Box>
          <Box>
            <TextStyle bold as="span">
              And a chance to
            </TextStyle>
            <TextStyle isBlack ml="3px" bold as="span">
              win prize pot!
            </TextStyle>
          </Box>
          <BannerTimer />
        </Flex>
      </Flex>
    </SyrupPotBanner>
  )
}

export default Banner
