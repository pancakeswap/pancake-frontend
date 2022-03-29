import { Text, Flex, IconButton, CalculateIcon } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import Balance from 'components/Balance'
import { addSeconds, format } from 'date-fns'
import { formatNumber } from 'utils/formatBalance'
import { useVaultApy } from 'hooks/useVaultApy'
import formatSecondsToWeeks from '../utils/formatSecondsToWeeks'

const TextRow = ({ title, value }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Flex alignItems="center">
      <Text bold fontSize="16px">
        {value}
      </Text>
    </Flex>
  </Flex>
)

const BalanceRow = ({ title, value, unit = '', decimals, suffix = null }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Flex alignItems="center">
      <Balance bold fontSize="16px" value={parseFloat(value)} decimals={decimals} unit={unit} />
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

const Overview = ({ usdValueStaked, lockedAmount, openCalculator, duration, isValidDuration }) => {
  const { lockedApy } = useVaultApy({ duration: isValidDuration ? duration : null })

  // TODO: check ROI
  const roi = usdValueStaked * Number(lockedApy)

  const formattedRoi = formatNumber(roi, roi > 10000 ? 0 : 2, roi > 10000 ? 0 : 2)

  return (
    <LightGreyCard>
      <BalanceRow title="CAKE TO BE LOCKED" value={lockedAmount} decimals={2} />
      <BalanceRow title="APY" unit="%" value={lockedApy} decimals={2} />
      <TextRow title="DURATION" value={(isValidDuration && formatSecondsToWeeks(duration)) || '-'} />
      <DateRow title="UNLOCK ON" value={isValidDuration && addSeconds(new Date(), duration)} />
      <BalanceRow
        title="EXPECTED ROI"
        value={`${formattedRoi}`}
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
