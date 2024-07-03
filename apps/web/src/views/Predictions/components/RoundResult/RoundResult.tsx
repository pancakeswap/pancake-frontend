import { useTranslation } from '@pancakeswap/localization'
import { BoxProps, Text } from '@pancakeswap/uikit'
import { NodeRound } from 'state/types'
import { getRoundPosition } from '../../helpers'
import { LockPriceRow, PrizePoolRow, RoundPrice, RoundResultBox } from './styles'

interface RoundResultProps extends BoxProps {
  round: NodeRound
  hasFailed?: boolean
}

const RoundResult: React.FC<React.PropsWithChildren<RoundResultProps>> = ({
  round,
  hasFailed = false,
  children,
  ...props
}) => {
  const { lockPrice, closePrice, AIPrice, totalAmount } = round
  const betPosition = getRoundPosition(lockPrice, closePrice) // Need to show UP/DOWN and not related to AI's bet
  const { t } = useTranslation()

  return (
    <RoundResultBox betPosition={betPosition ?? undefined} {...props}>
      <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
        {t('Closed Price')}
      </Text>
      {hasFailed ? (
        <Text bold textTransform="uppercase" color="textDisabled" mb="16px" fontSize="24px">
          {t('Cancelled')}
        </Text>
      ) : (
        <RoundPrice lockPrice={lockPrice} closePrice={closePrice} AIPrice={AIPrice} />
      )}
      {lockPrice ? <LockPriceRow lockPrice={lockPrice} /> : null}
      <PrizePoolRow totalAmount={totalAmount} />
      {children}
    </RoundResultBox>
  )
}

export default RoundResult
