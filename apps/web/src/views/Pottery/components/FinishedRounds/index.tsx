import styled from 'styled-components'
import { Flex, PageSection } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@pancakeswap/localization'
import { OutlineText } from 'views/Pottery/components/TextStyle'
import { FINISHED_ROUNDS_BG, FINISHED_ROUNDS_BG_DARK } from 'views/Lottery/pageSectionStyles'
import AllHistoryCard from './AllHistoryCard'

const FinishedRoundsBg = styled(Flex)<{ isDark: boolean }>`
  position: relative;
  width: 100%;
  flex-direction: column;
  background: ${({ isDark }) => (isDark ? FINISHED_ROUNDS_BG_DARK : FINISHED_ROUNDS_BG)};
`

const FinishedRoundsContainer = styled(Flex)`
  flex-direction: column;
  margin: auto;
  width: 100%;
`
const COVEX_BG =
  'linear-gradient(90deg,rgba(168,129,252,1) 0%,rgb(160 121 244) 15%,rgb(145 104 226) 30%,rgb(136 95 216) 45%,rgb(139 98 219) 65%,rgb(148 108 230) 80%,rgba(168,129,252,1) 100%)'

const FinishedRounds: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <FinishedRoundsBg isDark={isDark}>
      <PageSection index={1} dividerPosition="top" clipFill={{ light: COVEX_BG, dark: COVEX_BG }}>
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
