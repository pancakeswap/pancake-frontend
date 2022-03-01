import styled from 'styled-components'
import { Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import LineChartLoaderSVG from './LineChartLoaderSVG'
import BarChartLoaderSVG from './BarChartLoaderSVG'
import CandleChartLoaderSVG from './CandleChartLoaderSVG'

const LoadingText = styled(Box)`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  left: 0;
  right: 0;
  text-align: center;
`

const LoadingIndicator = styled(Box)`
  height: 100%;
  position: relative;
`

export const BarChartLoader: React.FC = () => {
  const { t } = useTranslation()
  return (
    <LoadingIndicator>
      <BarChartLoaderSVG />
      <LoadingText>
        <Text color="textSubtle" fontSize="20px">
          {t('Loading chart data...')}
        </Text>
      </LoadingText>
    </LoadingIndicator>
  )
}

export const LineChartLoader: React.FC = () => {
  const { t } = useTranslation()
  return (
    <LoadingIndicator>
      <LineChartLoaderSVG />
      <LoadingText>
        <Text color="textSubtle" fontSize="20px">
          {t('Loading chart data...')}
        </Text>
      </LoadingText>
    </LoadingIndicator>
  )
}

export const CandleChartLoader: React.FC = () => {
  const { t } = useTranslation()
  return (
    <LoadingIndicator>
      <CandleChartLoaderSVG />
      <LoadingText>
        <Text color="textSubtle" fontSize="20px">
          {t('Loading chart data...')}
        </Text>
      </LoadingText>
    </LoadingIndicator>
  )
}
