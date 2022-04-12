import { useMemo } from 'react'
import { LightGreyCard } from 'components/Card'
import { addSeconds } from 'date-fns'
import { useVaultApy } from 'hooks/useVaultApy'
import { useTranslation } from 'contexts/Localization'
import _toNumber from 'lodash/toNumber'
import { convertTimeToSeconds } from 'utils/timeHelper'
import formatSecondsToWeeks from '../../utils/formatSecondsToWeeks'
import TextRow from './TextRow'
import BalanceRow from './BalanceRow'
import DateRow from './DateRow'
import formatRoi from '../../utils/formatRoi'
import { OverviewPropsType } from '../../types'
import CalculatorButton from '../../Buttons/CalculatorButton'

const Overview: React.FC<OverviewPropsType> = ({
  usdValueStaked,
  lockedAmount,
  duration,
  isValidDuration,
  newDuration,
  newLockedAmount,
  lockStartTime,
  lockEndTime,
}) => {
  const { getLockedApy } = useVaultApy()
  const { t } = useTranslation()

  const lockedApy = useMemo(() => getLockedApy(duration), [getLockedApy, duration])
  const newLockedApy = useMemo(() => (newDuration && getLockedApy(newDuration)) || 0, [getLockedApy, newDuration])

  const formattedRoi = useMemo(() => {
    return formatRoi({ usdValueStaked, lockedApy })
  }, [lockedApy, usdValueStaked])

  const newFormattedRoi = useMemo(() => {
    return newLockedApy && formatRoi({ usdValueStaked, lockedApy: newLockedApy })
  }, [newLockedApy, usdValueStaked])

  const now = new Date()

  const unlockDate = newDuration
    ? addSeconds(Number(lockStartTime) ? new Date(convertTimeToSeconds(lockStartTime)) : now, newDuration)
    : Number(lockEndTime)
    ? new Date(convertTimeToSeconds(lockEndTime))
    : addSeconds(now, duration)

  return (
    <LightGreyCard>
      <BalanceRow title={t('Cake to be locked')} value={lockedAmount} newValue={newLockedAmount} decimals={2} />
      <BalanceRow title="apy" unit="%" value={_toNumber(lockedApy)} decimals={2} newValue={_toNumber(newLockedApy)} />
      <TextRow
        title={t('duration')}
        value={isValidDuration && formatSecondsToWeeks(duration)}
        newValue={isValidDuration && newDuration && formatSecondsToWeeks(newDuration)}
      />
      <DateRow
        color={_toNumber(newDuration) ? 'textSubtle' : 'text'}
        title={t('Unlock on')}
        value={isValidDuration && unlockDate}
      />
      <BalanceRow
        title={t('Expected ROI')}
        value={formattedRoi}
        newValue={newFormattedRoi}
        unit="$"
        decimals={2}
        suffix={<CalculatorButton />}
      />
    </LightGreyCard>
  )
}

export default Overview
