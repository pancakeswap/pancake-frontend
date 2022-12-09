import {
  ChartDisableIcon,
  ChartIcon,
  Flex,
  HistoryIcon,
  HotIcon,
  HotDisableIcon,
  IconButton,
  NotificationDot,
  Swap,
  useModal,
} from '@pancakeswap/uikit'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import GlobalSettings from 'components/Menu/GlobalSettings'
import RefreshIcon from 'components/Svg/RefreshIcon'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { ReactElement, useCallback, useContext } from 'react'
import { useExpertModeManager } from 'state/user/hooks'
import styled from 'styled-components'
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
`

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = ({
  subtitle,
  hasAmount,
  onRefreshPrice,
  title,
}) => {
  const { isChartSupported, isChartDisplayed, setIsChartDisplayed } = useContext(SwapFeaturesContext)
  const [expertMode] = useExpertModeManager()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  const handleOnClick = useCallback(() => onRefreshPrice?.(), [onRefreshPrice])
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()

  return (
    <Swap.CurrencyInputHeader
      title={
        <Flex width="100%" alignItems="center" justifyContent="space-between" flexDirection="column">
          <Flex flexDirection="column" alignItems="flex-start" width="100%" marginBottom={15}>
            <Swap.CurrencyInputHeaderTitle>{title}</Swap.CurrencyInputHeaderTitle>
          </Flex>
          <Flex justifyContent="start" width="100%" height="17px" alignItems="center" mb="14px">
            <Swap.CurrencyInputHeaderSubTitle>{subtitle}</Swap.CurrencyInputHeaderSubTitle>
          </Flex>
          <Flex width="100%" justifyContent="end">
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
                {isChartDisplayed ? (
                  <ChartDisableIcon color="textSubtle" />
                ) : (
                  <ChartIcon width="24px" color="textSubtle" />
                )}
              </ColoredIconButton>
            )}
            {isChartSupported && (
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
                  <HotIcon color="textSubtle" width="24px" />
                )}
              </ColoredIconButton>
            )}
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
      }
      subtitle={<></>}
    />
  )
}

export default CurrencyInputHeader
