import React from 'react'
import { Flex, FlexProps, PrizeIcon, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface PointsLabelProps extends FlexProps {
  points: number
}

const PointsLabel: React.FC<PointsLabelProps> = ({ points, ...props }) => {
  const { t } = useTranslation()
  const localePoints = points.toLocaleString()

  return (
    <Flex alignItems="center" {...props}>
      <PrizeIcon mr="4px" color="textSubtle" />
      <Text color="textSubtle">{t(`${localePoints} points`, { num: localePoints })}</Text>
    </Flex>
  )
}

export default PointsLabel
