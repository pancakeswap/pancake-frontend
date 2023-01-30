import styled from 'styled-components'
import { Flex, PageSection, Box } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@pancakeswap/localization'
import { OutlineText } from 'views/Pottery/components/TextStyle'
import { CNY_POTTERY_FINISHED_ROUNDS_BG } from 'views/Lottery/pageSectionStyles'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'
import AllHistoryCard from './AllHistoryCard'

const FinishedRoundsBg = styled(Flex)<{ isDark: boolean }>`
  position: relative;
  width: 100%;
  flex-direction: column;
  background: ${CNY_POTTERY_FINISHED_ROUNDS_BG};
`

const FinishedRoundsContainer = styled(Flex)`
  flex-direction: column;
  margin: auto;
  width: 100%;
`

const CnyDecorations = styled(Box)`
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
    left: 10%;
    bottom: 15%;
    animation: ${floatingStarsRight} 3.5s ease-in-out infinite;
  }

  & :nth-child(2) {
    left: 8%;
    bottom: 50%;
    animation: ${floatingStarsLeft} 6s ease-in-out infinite;
  }

  & :nth-child(3) {
    top: 5%;
    right: 10%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(4) {
    top: 30%;
    right: 8%;
    animation: ${floatingStarsRight} 6s ease-in-out infinite;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > img {
      display: block;
    }
  }
`

const CNY_COVEX_BG = '#ED6D42'

const FinishedRounds: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <FinishedRoundsBg isDark={isDark}>
      <CnyDecorations>
        <img src="/images/cny-asset/cny-lantern-1.png" width="200px" height="280px" alt="" />
        <img src="/images/cny-asset/p-2.png" width="30px" height="30px" alt="" />
        <img src="/images/cny-asset/cny-lantern-2.png" width="184px" height="210px" alt="" />
        <img src="/images/cny-asset/p-2.png" width="30px" height="30px" alt="" />
      </CnyDecorations>
      <PageSection index={1} dividerPosition="top" clipFill={{ light: CNY_COVEX_BG, dark: CNY_COVEX_BG }}>
        <FinishedRoundsContainer>
          <OutlineText fontSize="40px" mb="32px" bold textAlign="center">
            {t('Finished Rounds')}
          </OutlineText>
          <AllHistoryCard />
        </FinishedRoundsContainer>
      </PageSection>
    </FinishedRoundsBg>
  )
}

export default FinishedRounds
