import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text } from '@pancakeswap/uikit'
import {
  StyledVolumeText,
  RightBox,
  MiddleBox,
  LeftBox,
  Wrapper,
  Inner,
  StyledVolumeFlex,
} from 'views/TradingCompetition/components/TeamRanks/Podium/styles'
import { PodiumBase } from 'views/TradingCompetition/svgs'
import PodiumAvatar from 'views/AffiliatesProgram/components/LeaderBoard/PodiumAvatar'
import NewUsers from 'views/AffiliatesProgram/components/LeaderBoard/NewUsers'

const IMAGE_URL = ''

const Podium = () => {
  const { t } = useTranslation()

  return (
    <Wrapper margin="60px auto">
      <Inner>
        <Flex height="132px" position="relative">
          <LeftBox>
            <PodiumAvatar position={2} imageUrl={IMAGE_URL} />
            <Text margin="auto auto 10px auto" maxWidth="80px" color="primary" bold textAlign="center" ellipsis>
              123123
            </Text>
          </LeftBox>
          <MiddleBox>
            <PodiumAvatar position={1} imageUrl={IMAGE_URL} />
            <Text margin="auto auto 10px auto" maxWidth="80px" color="primary" bold textAlign="center" ellipsis>
              123123
            </Text>
          </MiddleBox>
          <RightBox>
            <PodiumAvatar position={3} imageUrl={IMAGE_URL} />
            <Text margin="auto auto 10px auto" maxWidth="80px" color="primary" bold textAlign="center" ellipsis>
              123123
            </Text>
          </RightBox>
        </Flex>
        <PodiumBase />
        <Flex justifyContent="space-between" mt="8px">
          <StyledVolumeFlex>
            <StyledVolumeText bold>$102,020</StyledVolumeText>
            <Text mb="12px" fontSize="12px" color="textSubtle">
              {t('Total Volume')}
            </Text>
            <NewUsers totalUsers={42020} />
            <StyledVolumeText bold>$102,020</StyledVolumeText>
            <Text fontSize="12px" color="textSubtle">
              {t('Commission')}
            </Text>
          </StyledVolumeFlex>
          <StyledVolumeFlex>
            <StyledVolumeText bold>$102,020</StyledVolumeText>
            <Text mb="12px" fontSize="12px" color="textSubtle">
              {t('Total Volume')}
            </Text>
            <NewUsers totalUsers={42020} />
            <StyledVolumeText bold>$102,020</StyledVolumeText>
            <Text fontSize="12px" color="textSubtle">
              {t('Commission')}
            </Text>
          </StyledVolumeFlex>
          <StyledVolumeFlex>
            <StyledVolumeText bold>$102,020</StyledVolumeText>
            <Text mb="12px" fontSize="12px" color="textSubtle">
              {t('Total Volume')}
            </Text>
            <NewUsers totalUsers={42020} />
            <StyledVolumeText bold>$102,020</StyledVolumeText>
            <Text fontSize="12px" color="textSubtle">
              {t('Commission')}
            </Text>
          </StyledVolumeFlex>
        </Flex>
      </Inner>
    </Wrapper>
  )
}

export default Podium
