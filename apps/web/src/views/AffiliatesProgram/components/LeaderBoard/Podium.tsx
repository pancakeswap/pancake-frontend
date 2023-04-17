import styled from 'styled-components'
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
import TeamPodiumIcon from 'views/TradingCompetition/components/TeamRanks/Podium/TeamPodiumIcon'
import NewUsers from 'views/AffiliatesProgram/components/LeaderBoard/NewUsers'

const Podium = () => {
  const { t } = useTranslation()

  return (
    <Wrapper margin="60px auto">
      <Inner>
        <Flex height="132px" position="relative">
          <LeftBox>
            <TeamPodiumIcon teamId={2} teamPosition={2} />
          </LeftBox>
          <MiddleBox>
            <TeamPodiumIcon teamId={1} teamPosition={1} />
          </MiddleBox>
          <RightBox>
            <TeamPodiumIcon teamId={3} teamPosition={3} />
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
