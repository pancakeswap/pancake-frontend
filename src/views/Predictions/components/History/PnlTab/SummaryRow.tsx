import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { formatBnb } from '../helpers'

type SummaryType = 'won' | 'lost' | 'entered'

interface SummaryRowProps {
  type: SummaryType
  summary: any
  bnbBusdPrice: BigNumber
}

const summaryTypeColors = {
  won: 'success',
  lost: 'failure',
  entered: 'text',
}

const summaryTypeSigns = {
  won: '+',
  lost: '-',
  entered: '',
}

const SummaryRow: React.FC<SummaryRowProps> = ({ type, summary, bnbBusdPrice }) => {
  const { t } = useTranslation()

  const color = summaryTypeColors[type]
  const { rounds, amount } = summary[type]
  const totalRounds = summary.entered.rounds
  const roundsInPercents = ((rounds * 100) / totalRounds).toFixed(2)
  const typeTranslationKey = type.charAt(0).toUpperCase() + type.slice(1)
  const displayAmount = type === 'won' ? summary[type].payout : amount

  return (
    <>
      <Text mt="16px" bold color="textSubtle">
        {t(typeTranslationKey)}
      </Text>
      <Flex>
        <Flex flex="2" flexDirection="column">
          <Text bold fontSize="20px" color={color}>
            {rounds} {t('Rounds').toLocaleLowerCase()}
          </Text>
          <Text fontSize="12px" color="textSubtle">
            {type === 'entered' ? t('Total').toLocaleLowerCase() : `${roundsInPercents}%`}
          </Text>
        </Flex>
        <Flex flex="3" flexDirection="column">
          <Text bold fontSize="20px" color={color}>
            {`${summaryTypeSigns[type]}${formatBnb(displayAmount)} BNB`}
          </Text>
          <Text fontSize="12px" color="textSubtle">
            {`~$${formatBnb(bnbBusdPrice.times(displayAmount).toNumber())}`}
          </Text>
        </Flex>
      </Flex>
    </>
  )
}

export default SummaryRow
