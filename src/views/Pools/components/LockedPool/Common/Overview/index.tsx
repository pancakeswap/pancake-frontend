import { useMemo } from 'react'
import { IconButton, CalculateIcon } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { addSeconds } from 'date-fns'
import { useVaultApy } from 'hooks/useVaultApy'
import { useTranslation } from 'contexts/Localization'
import formatSecondsToWeeks from '../../utils/formatSecondsToWeeks'
import TextRow from './TextRow'
import BalanceRow from './BalanceRow'
import DateRow from './DateRow'
import formatRoi from '../../utils/formatRoi'
import convertLockTimeToSeconds from '../../utils/convertLockTimeToSeconds'
import { OverviewPropsType } from '../../types'

const Overview: React.FC<OverviewPropsType> = ({
  usdValueStaked,
  lockedAmount,
  openCalculator,
  duration,
  isValidDuration,
  newDuration,
  newLockedAmount,
  lockStartTime,
}) => {
  const { getLockedApy } = useVaultApy()
  const { t } = useTranslation()

  const lockedApy = useMemo(() => getLockedApy(duration), [getLockedApy, duration])
  const newLockedApy = useMemo(() => newDuration && getLockedApy(newDuration), [getLockedApy, newDuration])

  const formattedRoi = useMemo(() => {
    return formatRoi({ usdValueStaked, lockedApy })
  }, [lockedApy, usdValueStaked])

  const newFormattedRoi = useMemo(() => {
    return newLockedApy && formatRoi({ usdValueStaked, lockedApy: newLockedApy })
  }, [newLockedApy, usdValueStaked])

  const unlockDate = newDuration
    ? addSeconds(Number(lockStartTime) ? new Date(convertLockTimeToSeconds(lockStartTime)) : new Date(), newDuration)
    : addSeconds(new Date(), duration)

  return (
    <LightGreyCard>
      <BalanceRow title={t('Cake to be locked')} value={lockedAmount} newValue={newLockedAmount} decimals={2} />
      <BalanceRow title="apy" unit="%" value={Number(lockedApy)} decimals={2} newValue={Number(newLockedApy)} />
      <TextRow
        title={t('duration')}
        value={isValidDuration && formatSecondsToWeeks(duration)}
        newValue={isValidDuration && newDuration && formatSecondsToWeeks(newDuration)}
      />
      <DateRow title={t('Unlock on')} value={isValidDuration && unlockDate} />
      <BalanceRow
        title={t('Expected ROI')}
        value={Number(formattedRoi)}
        newValue={Number(newFormattedRoi)}
        unit="$"
        decimals={2}
        suffix={
          <IconButton variant="text" scale="sm" mr="-8px" onClick={openCalculator}>
            <CalculateIcon color="textSubtle" width="18px" />
          </IconButton>
        }
      />
    </LightGreyCard>
  )
}

export default Overview
