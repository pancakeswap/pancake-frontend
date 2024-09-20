import { ButtonMenu, ButtonMenuItem, ChartDisableIcon, ChartIcon, IconButton } from '@pancakeswap/uikit'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { useRouter } from 'next/router'

import { useCallback, useContext } from 'react'
import { styled } from 'styled-components'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'
import { SwapFeaturesContext } from '../../Swap/SwapFeaturesContext'
import { SwapType } from '../../Swap/types'
import { isTwapSupported } from '../../Swap/utils'

const ColoredIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textSubtle};
  overflow: hidden;
`

const SwapSelectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

export const SwapSelection = ({ swapType }: { swapType: SwapType }) => {
  const router = useRouter()

  const onSelect = useCallback(
    (value: SwapType) => {
      let url = ''
      switch (value) {
        case SwapType.LIMIT:
          url = '/revamp-swap/limit'
          break
        case SwapType.TWAP:
          url = '/revamp-swap/twap'
          break
        case SwapType.MARKET:
          url = '/revamp-swap'
          break
        default:
          break
      }
      router.push(url)
    },
    [router],
  )
  const { chainId } = useActiveChainId()
  const { isChartSupported, isChartDisplayed, setIsChartDisplayed, isHotTokenSupported } =
    useContext(SwapFeaturesContext)
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed?.((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }
  if (!isTwapSupported(chainId)) return null

  return (
    <SwapSelectionWrapper>
      <ButtonMenu scale="md" fullWidth activeIndex={swapType} onItemClick={(index) => onSelect(index)} variant="subtle">
        <ButtonMenuItem>MARKET</ButtonMenuItem>
        <ButtonMenuItem>TWAP</ButtonMenuItem>
        <ButtonMenuItem>LIMIT</ButtonMenuItem>
      </ButtonMenu>
      {isChartSupported && (
        <ColoredIconButton
          onClick={() => {
            if (!isChartDisplayed && isSwapHotTokenDisplay) {
              setIsSwapHotTokenDisplay(false)
            }
            toggleChartDisplayed()
          }}
          variant="text"
          scale="sm"
          data-dd-action-name="Price chart button"
        >
          {isChartDisplayed ? <ChartDisableIcon color="textSubtle" /> : <ChartIcon width="24px" color="textSubtle" />}
        </ColoredIconButton>
      )}
      <GlobalSettings
        color="textSubtle"
        mr="0"
        mode={SettingsMode.SWAP_LIQUIDITY}
        data-dd-action-name="Swap settings button"
      />
    </SwapSelectionWrapper>
  )
}
