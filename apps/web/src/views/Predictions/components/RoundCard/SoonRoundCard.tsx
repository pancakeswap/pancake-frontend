import { Card, CardBody, Text, WaitIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NodeRound, BetPosition } from 'state/types'
import useTheme from 'hooks/useTheme'
import { useGetIntervalSeconds } from 'state/predictions/hooks'
import { ROUND_BUFFER } from 'state/predictions/config'
import { formatRoundTime } from '../../helpers'
import useCountdown from '../../hooks/useCountdown'
import { RoundResultBox } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import CardHeader, { getBorderBackground } from './CardHeader'

interface SoonRoundCardProps {
  round: NodeRound
}

const SoonRoundCard: React.FC<SoonRoundCardProps> = ({ round }) => {
  const intervalSeconds = useGetIntervalSeconds()
  const { secondsRemaining } = useCountdown(round.startTimestamp + intervalSeconds + ROUND_BUFFER)
  const countdown = formatRoundTime(secondsRemaining)
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Card borderBackground={getBorderBackground(theme, 'soon')}>
      <CardHeader status="soon" icon={<WaitIcon mr="4px" width="21px" />} title={t('Later')} epoch={round.epoch} />
      <CardBody p="16px">
        <MultiplierArrow isDisabled />
        <RoundResultBox>
          <Text textAlign="center">
            <Text bold>{t('Entry starts')}</Text>
            <Text fontSize="24px" bold>
              {`~${countdown}`}
            </Text>
          </Text>
        </RoundResultBox>
        <MultiplierArrow betPosition={BetPosition.BEAR} isDisabled />
      </CardBody>
    </Card>
  )
}

export default SoonRoundCard
