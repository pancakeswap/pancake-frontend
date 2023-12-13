import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { useState, useMemo } from 'react'
import { Flex, Button, useModal } from '@pancakeswap/uikit'
import { TabToggle } from 'components/TabToggle'
import { GameType } from '@pancakeswap/games'
import { YoutubeList } from 'components/Game/Project/YoutubeList'
import { QuickAccessModal } from 'components/Game/Project/QuickAccessModal'

const Gutter = styled.div`
  position: relative;
  width: 100%;
  margin-top: 40px;
`

const ExpandButtonGroup = styled(Flex)`
  max-width: 254px;
  margin: auto;
  border-radius: 24px 24px 0 0;
  background-color: ${({ theme }) => theme.colors.input};
`

const VideoPane = styled.div`
  overflow: auto;
  position: relative;
  background: ${({ theme }) => theme.colors.background};
`

interface OnMouseDownType {
  stopPropagation: () => void
  preventDefault: () => void
}

interface MobileViewViewProps {
  gameData: GameType
}

export const MobileView: React.FC<React.PropsWithChildren<MobileViewViewProps>> = ({ gameData }) => {
  const { t } = useTranslation()
  const [isPaneOpen, setIsPaneOpen] = useState(false)
  const [onPresentQuickAccessModal] = useModal(<QuickAccessModal game={gameData} />, true, true, 'quick-access-modal')

  const openPane = () => {
    if (hasPlayList) {
      setIsPaneOpen(!isPaneOpen)
    }
  }

  const hasPlayList = useMemo(() => Number(gameData?.playlist?.length) > 0, [gameData])

  return (
    <>
      <Gutter>
        <ExpandButtonGroup>
          {hasPlayList && (
            <TabToggle
              borderRadius="0"
              height="42px"
              as={Button}
              style={{ whiteSpace: 'nowrap', alignItems: 'center' }}
              isActive
              onClick={openPane}
            >
              {t('Learn More')}
            </TabToggle>
          )}
          <TabToggle
            borderRadius="0"
            height="42px"
            as={Button}
            style={{ whiteSpace: 'nowrap', alignItems: 'center' }}
            onMouseDown={(e: OnMouseDownType) => {
              e.stopPropagation()
              e.preventDefault()
              onPresentQuickAccessModal()
            }}
          >
            {t('Quick Access')}
          </TabToggle>
        </ExpandButtonGroup>
      </Gutter>
      <VideoPane>{isPaneOpen && <YoutubeList playlist={gameData.playlist} />}</VideoPane>
    </>
  )
}
