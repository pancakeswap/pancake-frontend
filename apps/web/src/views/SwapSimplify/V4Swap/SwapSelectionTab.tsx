import { useTranslation } from '@pancakeswap/localization'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { styled } from 'styled-components'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'
import { SwapType } from '../../Swap/types'
import { isTwapSupported } from '../../Swap/utils'

// const ColoredIconButton = styled(IconButton)`
//   color: ${({ theme }) => theme.colors.textSubtle};
//   overflow: hidden;
// `

const StyledButtonMenuItem = styled(ButtonMenuItem)`
  height: 40px;
  padding: 0px 16px;
  * ${({ theme }) => theme.mediaQueries.md} {
    width: 124px;
    padding: 0px 24px;
  }
`

const SwapSelectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 4px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.md} {
    gap: 16px;
  }
`

export const SwapSelection = ({
  swapType,
  withToolkit = false,
  style,
}: {
  swapType: SwapType
  withToolkit?: boolean
  style?: React.CSSProperties
}) => {
  const { t } = useTranslation()
  const router = useRouter()

  const onSelect = useCallback(
    (value: SwapType) => {
      let url = ''
      switch (value) {
        case SwapType.LIMIT:
          url = '/swap/limit'
          break
        case SwapType.TWAP:
          url = '/swap/twap'
          break
        case SwapType.MARKET:
          url = '/'
          break
        default:
          break
      }
      router.push(url)
    },
    [router],
  )
  const { chainId } = useActiveChainId()

  // NOTE: Commented out until charts are supported again
  // const { isChartSupported, isChartDisplayed, setIsChartDisplayed, isHotTokenSupported } =
  //   useContext(SwapFeaturesContext)
  // const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
  // const toggleChartDisplayed = () => {
  //   setIsChartDisplayed?.((currentIsChartDisplayed) => !currentIsChartDisplayed)
  // }

  const tSwapProps = useMemo(() => {
    const isTSwapSupported = isTwapSupported(chainId)
    return {
      disabled: !isTSwapSupported,
      style: {
        cursor: isTSwapSupported ? 'pointer' : 'not-allowed',
        pointerEvents: isTSwapSupported ? 'auto' : 'none',
        color: !isTSwapSupported ? 'rgba(0, 0, 0, 0.15)' : undefined,
        userSelect: 'none',
      } as React.CSSProperties,
    }
  }, [chainId])

  return (
    <SwapSelectionWrapper style={style}>
      <ButtonMenu
        scale="md"
        activeIndex={swapType}
        onItemClick={(index) => onSelect(index)}
        variant="subtle"
        noButtonMargin
        fullWidth
      >
        <StyledButtonMenuItem>{t('Swap')}</StyledButtonMenuItem>
        <StyledButtonMenuItem {...tSwapProps}>{t('TWAP')}</StyledButtonMenuItem>
        <StyledButtonMenuItem {...tSwapProps}>{t('Limit')}</StyledButtonMenuItem>
      </ButtonMenu>
      {/* NOTE: Commented out until charts are supported again */}
      {/* {isChartSupported && withToolkit && (
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
          width="24px"
          p="0"
        >
          {isChartDisplayed ? (
            <ChartDisableIcon width="24px" color="textSubtle" />
          ) : (
            <ChartIcon width="24px" color="textSubtle" />
          )}
        </ColoredIconButton>
      )} */}
      {withToolkit && (
        <GlobalSettings
          color="textSubtle"
          mr="0"
          mode={SettingsMode.SWAP_LIQUIDITY}
          data-dd-action-name="Swap settings button"
          width="24px"
        />
      )}
    </SwapSelectionWrapper>
  )
}
