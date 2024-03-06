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
import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'
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

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = memo(({ title, hasAmount, onRefreshPrice }) => {
  const { t } = useTranslation()
  const [mobileTooltipShowOnce, setMobileTooltipShowOnce] = useAtom(mobileShowOnceTokenHighlightAtom)
  const [mobileTooltipShow, setMobileTooltipShow] = useState(false)

  const [expertMode] = useExpertMode()
  const [isRoutingSettingChange] = useRoutingSettingChanged()
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)

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
    <Flex width="100%" alignItems="center" justifyContent="space-between">
      <Flex flexDirection="column" alignItems="flex-start" width="100%">
        <Swap.CurrencyInputHeaderTitle>{title}</Swap.CurrencyInputHeaderTitle>
      </Flex>
      <Flex width="100%" justifyContent="end">
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
      </Flex>
    </Flex>
  )

  return <Swap.CurrencyInputHeader title={titleContent} subtitle={<></>} />
})

export default CurrencyInputHeader
