import BigNumber from 'bignumber.js'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { formatToken } from '../helpers'

type SummaryType = 'won' | 'lost' | 'entered'

interface SummaryRowProps {
  type: SummaryType
  summary: any
  tokenPrice: BigNumber
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

const SummaryRow: React.FC<React.PropsWithChildren<SummaryRowProps>> = ({ type, summary, tokenPrice }) => {
  const { t } = useTranslation()

  const color = summaryTypeColors[type]
  const { rounds, amount } = summary[type]
  const totalRounds = summary.entered.rounds
  const roundsInPercents = ((rounds * 100) / totalRounds).toFixed(2)
  const typeTranslationKey = type.charAt(0).toUpperCase() + type.slice(1)
  const displayAmount = type === 'won' ? summary[type].payout : amount
  const amountInUsd = tokenPrice.multipliedBy(displayAmount).toNumber()
  const config = useConfig()
  const roundsInPercentsDisplay = !Number.isNaN(parseFloat(roundsInPercents)) ? `${roundsInPercents}%` : '0%'

  return config?.displayedDecimals && config?.token ? (
    <>
      <Text mt="16px" bold color="textSubtle">
        {t(typeTranslationKey)}
      </Text>
      <Flex>
        <Flex flex="2" flexDirection="column">
          <Text bold fontSize="20px" color={color} textTransform="lowercase">
            {rounds} {t('Rounds')}
          </Text>
          <Text fontSize="12px" color="textSubtle" textTransform="lowercase">
            {type === 'entered' ? t('Total') : roundsInPercentsDisplay}
          </Text>
        </Flex>
        <Flex flex="3" flexDirection="column">
          <Text bold fontSize="20px" color={color}>
            {`${summaryTypeSigns[type]}${formatToken(displayAmount, config?.displayedDecimals)} ${
              config?.token.symbol
            }`}
          </Text>
          <Text fontSize="12px" color="textSubtle">
            {`~$${amountInUsd.toFixed(2)}`}
          </Text>
        </Flex>
      </Flex>
    </>
  ) : null
}

export default SummaryRow
