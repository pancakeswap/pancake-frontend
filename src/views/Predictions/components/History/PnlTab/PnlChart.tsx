import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text } from '@tovaswapui/uikit'
import { SVG, WonSlice, LostSlice, Wrapper, Info } from './PnlChartStyles'

/**
 * Bare minimum chart that doesn't require any external dependencies
 * For details read here - https://www.smashingmagazine.com/2015/07/designing-simple-pie-charts-with-css/
 */

interface PnlChartProps {
  won: number
  lost: number
}

// 2 * Pi * R
const CIRCUMFERENCE = 339.292

const PnlChart: React.FC<PnlChartProps> = ({ lost, won }) => {
  const { t } = useTranslation()
  const percentageWon = ((won * 100) / (lost + won)).toFixed(2)
  const paintLost = (lost / (won + lost)) * CIRCUMFERENCE
  const paintWon = CIRCUMFERENCE - paintLost
  return (
    <Wrapper>
      <SVG viewBox="0 0 128 128">
        <LostSlice r="54" cx="64" cy="64" length={paintLost} />
        <WonSlice r="54" cx="64" cy="64" length={paintWon} offset={paintLost} />
      </SVG>
      <Info>
        <Text small lineHeight="1">
          {t('Won')}
        </Text>
        <Text bold fontSize="20px" lineHeight="1">
          {won}/{won + lost}
        </Text>
        <Text small lineHeight="1" color="textSubtle">
          {percentageWon}%
        </Text>
      </Info>
    </Wrapper>
  )
}

export default PnlChart
