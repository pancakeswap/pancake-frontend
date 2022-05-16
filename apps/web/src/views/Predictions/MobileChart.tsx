import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useChartView } from 'state/predictions/hooks'
import { setChartView } from 'state/predictions'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import dynamic from 'next/dynamic'
import { PredictionsChartView } from 'state/types'
import { TabToggleGroup, TabToggle } from 'components/TabToggle'
import { useTranslation } from 'contexts/Localization'
import Menu from './components/Menu'
import TradingView from './components/TradingView'

const ChainlinkChart = dynamic(() => import('./components/ChainlinkChart'), { ssr: false })

const MenuWrapper = styled.div`
  flex: none;
`

const ChartWrapper = styled.div`
  flex: 1;
  height: 100%;
  background-color: ${({ theme }) => theme.card.background};
`

const MobileChart = () => {
  const chartView = useChartView()
  const dispatch = useLocalDispatch()
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column" height="100%">
      <MenuWrapper>
        <Menu />
      </MenuWrapper>
      <TabToggleGroup>
        <TabToggle
          isActive={chartView === PredictionsChartView.TradingView}
          onClick={() => dispatch(setChartView(PredictionsChartView.TradingView))}
        >
          TradingView {t('Chart')}
        </TabToggle>
        <TabToggle
          isActive={chartView === PredictionsChartView.Chainlink}
          onClick={() => dispatch(setChartView(PredictionsChartView.Chainlink))}
        >
          Chainlink {t('Chart')}
        </TabToggle>
      </TabToggleGroup>
      <ChartWrapper>
        {chartView === PredictionsChartView.TradingView ? (
          <TradingView />
        ) : (
          <ChainlinkChart pt="8px" background="background" isMobile />
        )}
      </ChartWrapper>
    </Flex>
  )
}

export default MobileChart
