import { useTranslation } from '@pancakeswap/localization'
import { PredictionsChartView } from '@pancakeswap/prediction'
import { Flex } from '@pancakeswap/uikit'
import { TabToggle, TabToggleGroup } from 'components/TabToggle'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { setChartView } from 'state/predictions'
import { useChartView } from 'state/predictions/hooks'
import { styled } from 'styled-components'
import Menu from './components/Menu'
import TradingView from './components/TradingView'
import { useConfig } from './context/ConfigProvider'

const ChainlinkChart = dynamic(() => import('./components/ChainlinkChart'), { ssr: false })

const MenuWrapper = styled.div`
  flex: none;
`

const ChartWrapper = styled.div`
  flex: 1;
  height: 100%;
  background-color: ${({ theme }) => theme.card.background};
`

const MobileChartWrapper = styled(Flex)`
  flex-direction: column;
  height: 100%;
  @media only screen and (max-width: 575px) and (max-height: 739px) {
    height: 100vh;
  }
`

const MobileChart = () => {
  const chartView = useChartView()
  const dispatch = useLocalDispatch()
  const { t } = useTranslation()
  const config = useConfig()

  useEffect(() => {
    if (config?.galetoOracleAddress || config?.ai) {
      dispatch(setChartView(PredictionsChartView.TradingView))
    }
  }, [config, dispatch])

  return (
    <MobileChartWrapper>
      <MenuWrapper>
        <Menu />
      </MenuWrapper>
      <div style={{ height: 'min-content' }}>
        <TabToggleGroup>
          <TabToggle
            isActive={chartView === PredictionsChartView.TradingView}
            onClick={() => dispatch(setChartView(PredictionsChartView.TradingView))}
          >
            TradingView {t('Chart')}
          </TabToggle>
          <>
            {config?.chainlinkOracleAddress && (
              <TabToggle
                isActive={chartView === PredictionsChartView.Chainlink}
                onClick={() => dispatch(setChartView(PredictionsChartView.Chainlink))}
              >
                Chainlink {t('Chart')}
              </TabToggle>
            )}
          </>
        </TabToggleGroup>
      </div>
      <ChartWrapper>
        {chartView === PredictionsChartView.TradingView ? <TradingView /> : <ChainlinkChart pt="8px" isMobile />}
      </ChartWrapper>
    </MobileChartWrapper>
  )
}

export default MobileChart
