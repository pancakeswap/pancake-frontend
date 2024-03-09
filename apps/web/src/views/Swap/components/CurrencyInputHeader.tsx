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
  Text,
  TooltipText,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import { useExpertMode } from '@pancakeswap/utils/user'
import { Swap } from '@pancakeswap/widgets-internal'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import InternalLink from 'components/Links'
import GlobalSettings from 'components/Menu/GlobalSettings'
import RefreshIcon from 'components/Svg/RefreshIcon'
import { CHAIN_REFRESH_TIME } from 'config/constants/exchange'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { ReactElement, memo, useCallback, useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useRoutingSettingChanged } from 'state/user/smartRouter'
import { styled } from 'styled-components'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import BuyCryptoIcon from '../../../../public/images/moneyBangs.svg'
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

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = memo(
  ({ subtitle, title, hasAmount, onRefreshPrice }) => {
    const { t } = useTranslation()
    const { chainId } = useActiveChainId()
    const [mobileTooltipShowOnce, setMobileTooltipShowOnce] = useAtom(mobileShowOnceTokenHighlightAtom)
    const [mobileTooltipShow, setMobileTooltipShow] = useState(false)

    const { tooltip, tooltipVisible, targetRef } = useTooltip(<Text>{t('Check out the top traded tokens')}</Text>, {
      placement: isMobile ? 'top' : 'bottom',
      trigger: isMobile ? 'focus' : 'hover',
      ...(isMobile && { manualVisible: mobileTooltipShow }),
    })
    const {
      tooltip: buyCryptoTooltip,
      tooltipVisible: buyCryptoTooltipVisible,
      targetRef: buyCryptoTargetRef,
    } = useTooltip(<Text>{t('Buy crypto with fiat.')}</Text>, {
      placement: isMobile ? 'top' : 'bottom',
      trigger: isMobile ? 'focus' : 'hover',
      ...(isMobile && { manualVisible: mobileTooltipShow }),
    })

    const { isChartSupported, isChartDisplayed, setIsChartDisplayed, isHotTokenSupported } =
      useContext(SwapFeaturesContext)
    const [expertMode] = useExpertMode()
    const [isRoutingSettingChange] = useRoutingSettingChanged()
    const toggleChartDisplayed = () => {
      setIsChartDisplayed?.((currentIsChartDisplayed) => !currentIsChartDisplayed)
    }
    const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
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
          {chainId ? (
            <Flex alignItems="center" justifyContent="center" px="4px" mt="5px">
              <TooltipText
                ref={buyCryptoTargetRef}
                onClick={() => setMobileTooltipShow(false)}
                display="flex"
                style={{ justifyContent: 'center' }}
              >
                <InternalLink href="/buy-crypto" data-dd-action-name="Swap buy crypto button">
                  <Image src={BuyCryptoIcon} alt="#" style={{ justifyContent: 'center' }} />
                </InternalLink>
              </TooltipText>
              {buyCryptoTooltipVisible && (!isMobile || mobileTooltipShow) && buyCryptoTooltip}
            </Flex>
          ) : null}
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
              {isChartDisplayed ? (
                <ChartDisableIcon color="textSubtle" />
              ) : (
                <ChartIcon width="24px" color="textSubtle" />
              )}
            </ColoredIconButton>
          )}
          {isHotTokenSupported && (
            <ColoredIconButton
              variant="text"
              scale="sm"
              onClick={() => {
                if (!isSwapHotTokenDisplay && isChartDisplayed) {
                  toggleChartDisplayed()
                }
                setIsSwapHotTokenDisplay(!isSwapHotTokenDisplay)
              }}
              data-dd-action-name="Hot token list button"
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
          )}
          <NotificationDot show={expertMode || isRoutingSettingChange}>
            <GlobalSettings
              color="textSubtle"
              mr="0"
              mode={SettingsMode.SWAP_LIQUIDITY}
              data-dd-action-name="Swap settings button"
            />
          </NotificationDot>
          <IconButton
            onClick={onPresentTransactionsModal}
            variant="text"
            scale="sm"
            data-dd-action-name="Swap history button"
          >
            <HistoryIcon color="textSubtle" width="24px" />
          </IconButton>
          <IconButton variant="text" scale="sm" onClick={onRefreshPrice} data-dd-action-name="Swap refresh button">
            <RefreshIcon
              disabled={!hasAmount}
              color="textSubtle"
              width="27px"
              duration={chainId && CHAIN_REFRESH_TIME[chainId] ? CHAIN_REFRESH_TIME[chainId] / 1000 : undefined}
            />
          </IconButton>
        </Flex>
      </Flex>
    )

    return <Swap.CurrencyInputHeader title={titleContent} subtitle={<></>} />
  },
)

export default CurrencyInputHeader
