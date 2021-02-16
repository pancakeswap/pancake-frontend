import React from 'react'
import { Flex, FlexProps, PrizeIcon, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

interface PointsLabelProps extends FlexProps {
  points: number
}

const PointsLabel: React.FC<PointsLabelProps> = ({ points, ...props }) => {
  const TranslateString = useI18n()
  const localePoints = points.toLocaleString()

  return (
    <Flex alignItems="center" {...props}>
      <PrizeIcon mr="4px" color="textSubtle" />
      <Text color="textSubtle">{TranslateString(999, `${localePoints} points`, { num: localePoints })}</Text>
    </Flex>
  )
}

export default PointsLabel
