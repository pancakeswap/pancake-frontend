import { useTranslation } from '@pancakeswap/localization'
import { Text, TextProps } from '@pancakeswap/uikit'
import { MarketEvent } from 'hooks/useProfile/nft/types'

interface ActivityEventTextProps extends TextProps {
  marketEvent: MarketEvent
}

const ActivityEventText: React.FC<React.PropsWithChildren<ActivityEventTextProps>> = ({ marketEvent, ...props }) => {
  const { t } = useTranslation()

  const events = {
    [MarketEvent.NEW]: {
      text: t('Listed'),
      color: 'textSubtle',
    },
    [MarketEvent.CANCEL]: {
      text: t('Delisted'),
      color: 'textSubtle',
    },
    [MarketEvent.MODIFY]: {
      text: t('Modified'),
      color: 'textSubtle',
    },
    [MarketEvent.BUY]: {
      text: t('Bought'),
      color: 'success',
    },
    [MarketEvent.SELL]: {
      text: t('Sold'),
      color: 'failure',
    },
  }

  return (
    <Text {...props} color={events[marketEvent].color}>
      {events[marketEvent].text}
    </Text>
  )
}

export default ActivityEventText
