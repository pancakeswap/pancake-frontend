import { useMemo } from 'react'
import { Text, Flex, IconButton, CalculateIcon } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { BalanceWithLoading } from 'components/Balance'
import { addSeconds, format } from 'date-fns'
import { formatNumber } from 'utils/formatBalance'
import { useVaultApy } from 'hooks/useVaultApy'
import formatSecondsToWeeks from '../utils/formatSecondsToWeeks'

const DiffText = ({ value, newValue = null }) => {
  if (!newValue || !value || value === newValue) {
    return (
      <Text bold fontSize="16px">
        {value || '-'}
      </Text>
    )
  }

  return (
    <>
      <Text
        style={{
          textDecoration: 'line-through',
        }}
        bold
        fontSize="16px"
        mr="4px"
      >
        {value}
      </Text>
      {`->`}
      <Text bold color="textSubtle" ml="4px" fontSize="16px">
        {newValue}
      </Text>
    </>
  )
}

const TextRow = ({ title, value, newValue = null }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Flex alignItems="center">
      <DiffText value={value} newValue={newValue} />
    </Flex>
  </Flex>
)

const DiffBalance = ({ value, newValue = null, decimals, unit }) => {
  if (newValue === null || value === newValue) {
    return <BalanceWithLoading bold fontSize="16px" value={value} decimals={decimals} unit={unit} />
  }

  return (
    <>
      <BalanceWithLoading
        style={{
          textDecoration: 'line-through',
        }}
        bold
        fontSize="16px"
        mr="4px"
        value={value}
        decimals={decimals}
        unit={unit}
      />
      {`->`}
      <BalanceWithLoading bold fontSize="16px" ml="4px" value={newValue} decimals={decimals} unit={unit} />
    </>
  )
}

const BalanceRow = ({ title, value, newValue = null, unit = '', decimals, suffix = null }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Flex alignItems="center">
      <DiffBalance newValue={newValue} value={value} decimals={decimals} unit={unit} />
      {suffix}
    </Flex>
  </Flex>
)

const DateRow = ({ title, value }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Text bold color="text">
      {value ? format(value, 'MMM do, yyyy HH:mm') : '-'}
    </Text>
  </Flex>
)

const Overview = ({
  usdValueStaked,
  lockedAmount,
  openCalculator,
  duration,
  newDuration = 0,
  newLockedAmount = null,
  isValidDuration,
  lockStartTime = null,
}) => {
  const { getLockedApy } = useVaultApy()

  const lockedApy = useMemo(() => getLockedApy(duration), [getLockedApy, duration])
  const newLockedApy = useMemo(() => getLockedApy(newDuration), [getLockedApy, newDuration])

  const formattedRoi = useMemo(() => {
    const roi = usdValueStaked * (Number(lockedApy) / 100)

    return formatNumber(roi, roi > 10000 ? 0 : 2, roi > 10000 ? 0 : 2)
  }, [lockedApy, usdValueStaked])

  const newFormattedRoi = useMemo(() => {
    const roi = usdValueStaked * (Number(newLockedApy) / 100)

    return formatNumber(roi, roi > 10000 ? 0 : 2, roi > 10000 ? 0 : 2)
  }, [newLockedApy, usdValueStaked])

  const unlockDate = newDuration
    ? addSeconds(lockStartTime ? new Date(parseInt(lockStartTime) * 1000) : new Date(), newDuration)
    : addSeconds(new Date(), duration)

  return (
    <LightGreyCard>
      <BalanceRow title="CAKE TO BE LOCKED" value={lockedAmount} newValue={newLockedAmount} decimals={2} />
      <BalanceRow title="APY" unit="%" value={lockedApy} decimals={2} newValue={newLockedApy} />
      <TextRow
        title="DURATION"
        value={isValidDuration && formatSecondsToWeeks(duration)}
        newValue={formatSecondsToWeeks(newDuration)}
      />
      <DateRow title="UNLOCK ON" value={isValidDuration && unlockDate} />
      <BalanceRow
        title="EXPECTED ROI"
        value={formattedRoi}
        newValue={newFormattedRoi}
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
