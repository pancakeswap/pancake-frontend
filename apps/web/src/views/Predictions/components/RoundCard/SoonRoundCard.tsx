import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { Card, CardBody, Text, WaitIcon } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { NodeRound } from 'state/types'
import { formatRoundTime } from '../../helpers'
import useCountdown from '../../hooks/useCountdown'
import { RoundResultBox } from '../RoundResult'
import CardHeader, { getBorderBackground } from './CardHeader'
import MultiplierArrow from './MultiplierArrow'

interface SoonRoundCardProps {
  round: NodeRound
}

const SoonRoundCard: React.FC<React.PropsWithChildren<SoonRoundCardProps>> = ({ round }) => {
  const { secondsRemaining } = useCountdown(round?.startTimestamp ?? 0)
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
