import { Card, CardBody, Text, WaitIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NodeRound, BetPosition } from 'state/types'
import useTheme from 'hooks/useTheme'
import { formatRoundTime } from '../../helpers'
import useCountdown from '../../hooks/useCountdown'
import { RoundResultBox } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import CardHeader, { getBorderBackground } from './CardHeader'

interface SoonRoundCardProps {
  round: NodeRound
}

const SoonRoundCard: React.FC<React.PropsWithChildren<SoonRoundCardProps>> = ({ round }) => {
  const { secondsRemaining } = useCountdown(round.startTimestamp)
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
