import React from 'react'
import styled from 'styled-components'
import { Flex, PrizeIcon, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

interface PointsLabelProps {
  points: number
}

const InlineFlex = styled(Flex)`
  display: inline-flex;
`

const PointsLabel: React.FC<PointsLabelProps> = ({ points }) => {
  const TranslateString = useI18n()
  const localePoints = points.toLocaleString()

  return (
    <InlineFlex alignItems="center">
      <PrizeIcon mr="4px" color="textSubtle" />
      <Text color="textSubtle">{TranslateString(999, `${localePoints} points`, { num: localePoints })}</Text>
    </InlineFlex>
  )
}

export default PointsLabel
