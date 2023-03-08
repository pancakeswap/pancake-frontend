import { useTranslation } from '@pancakeswap/localization'
import {
  ChartDisableIcon,
  ChartIcon,
  Flex,
  HistoryIcon,
  HotDisableIcon,
  HotIcon,
  IconButton,
  NotificationDot,
  Swap,
  Text,
  TooltipText,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'

import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import GlobalSettings from 'components/Menu/GlobalSettings'
import RefreshIcon from 'components/Svg/RefreshIcon'
import { V3SwapPromotionIcon } from 'components/V3SwapPromotionIcon'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { useAtom } from 'jotai'
import { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useExpertModeManager } from 'state/user/hooks'
import styled from 'styled-components'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'
import { SwapFeaturesContext } from '../SwapFeaturesContext'

interface Props {
  title: string | ReactElement
  subtitle: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  hasAmount: boolean
  onRefreshPrice: () => void
}

const ColoredIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textSubtle};
  overflow: hidden;
`

//  disable this during the v3 campaign
const mobileShowOnceTokenHighlightAtom = atomWithStorageWithErrorCatch('pcs::mobileShowOnceTokenHighlightV2', true)

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = ({
  subtitle,
  hasAmount,
  onRefreshPrice,
  title,
}) => {
  const { t } = useTranslation()
  const [mobileTooltipShowOnce, setMobileTooltipShowOnce] = useAtom(mobileShowOnceTokenHighlightAtom)
  const [mobileTooltipShow, setMobileTooltipShow] = useState(false)

  const { tooltip, tooltipVisible, targetRef } = useTooltip(<Text>{t('Check out the top traded tokens')}</Text>, {
    placement: isMobile ? 'top' : 'bottom',
    trigger: isMobile ? 'focus' : 'hover',
    ...(isMobile && { manualVisible: mobileTooltipShow }),
  })

  const { isChartSupported, isChartDisplayed, setIsChartDisplayed } = useContext(SwapFeaturesContext)
  const [expertMode] = useExpertModeManager()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  const handleOnClick = useCallback(() => onRefreshPrice?.(), [onRefreshPrice])
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()

  const mobileTooltipClickOutside = useCallback(() => {
    setMobileTooltipShow(false)
  }, [])

  useEffect(() => {
    if (isMobile && !mobileTooltipShowOnce) {
      setMobileTooltipShow(true)
      setMobileTooltipShowOnce(true)
    }
  }, [mobileTooltipShowOnce, setMobileTooltipShowOnce])

  useEffect(() => {
    document.body.addEventListener('click', mobileTooltipClickOutside)
    return () => {
      document.body.removeEventListener('click', mobileTooltipClickOutside)
    }
  }, [mobileTooltipClickOutside])

  const titleContent = (
    <Flex width="100%" alignItems="center" justifyContent="space-between" flexDirection="column">
      <Flex flexDirection="column" alignItems="flex-start" width="100%" marginBottom={15}>
        <Swap.CurrencyInputHeaderTitle>{title}</Swap.CurrencyInputHeaderTitle>
      </Flex>
      <Flex justifyContent="start" width="100%" height="17px" alignItems="center" mb="14px">
        <Swap.CurrencyInputHeaderSubTitle>{subtitle}</Swap.CurrencyInputHeaderSubTitle>
      </Flex>
      <Flex width="100%" justifyContent="end">
        <V3SwapPromotionIcon />
        {isChartSupported && setIsChartDisplayed && (
          <ColoredIconButton
            onClick={() => {
              if (!isChartDisplayed && isSwapHotTokenDisplay) {
                setIsSwapHotTokenDisplay(false)
              }
              toggleChartDisplayed()
            }}
            variant="text"
            scale="sm"
          >
            {isChartDisplayed ? <ChartDisableIcon color="textSubtle" /> : <ChartIcon width="24px" color="textSubtle" />}
          </ColoredIconButton>
        )}
        <ColoredIconButton
          variant="text"
          scale="sm"
          onClick={() => {
            if (!isSwapHotTokenDisplay && isChartDisplayed) {
              toggleChartDisplayed()
            }
            setIsSwapHotTokenDisplay(!isSwapHotTokenDisplay)
          }}
        >
          {isSwapHotTokenDisplay ? (
            <HotDisableIcon color="textSubtle" width="24px" />
          ) : (
            <>
              <TooltipText
                ref={targetRef}
                onClick={() => setMobileTooltipShow(false)}
                display="flex"
                style={{ justifyContent: 'center' }}
              >
                <HotIcon color="textSubtle" width="24px" />
              </TooltipText>
              {tooltipVisible && (!isMobile || mobileTooltipShow) && tooltip}
            </>
          )}
        </ColoredIconButton>
        <NotificationDot show={expertMode}>
          <GlobalSettings color="textSubtle" mr="0" mode={SettingsMode.SWAP_LIQUIDITY} />
        </NotificationDot>
        <IconButton onClick={onPresentTransactionsModal} variant="text" scale="sm">
          <HistoryIcon color="textSubtle" width="24px" />
        </IconButton>
        <IconButton variant="text" scale="sm" onClick={handleOnClick}>
          <RefreshIcon disabled={!hasAmount} color="textSubtle" width="27px" />
        </IconButton>
      </Flex>
    </Flex>
  )

  return <Swap.CurrencyInputHeader title={titleContent} subtitle={<></>} />
}

export default CurrencyInputHeader
