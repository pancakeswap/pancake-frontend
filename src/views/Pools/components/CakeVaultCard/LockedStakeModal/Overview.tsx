import { Text, Flex, IconButton, CalculateIcon } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import Balance from 'components/Balance'
import { format } from 'date-fns'
import { formatNumber } from 'utils/formatBalance'
import addWeeks from 'date-fns/addWeeks'
import { useVaultApy } from 'hooks/useVaultApy'

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
      {format(value, 'MMM do, yyyy HH:mm')}
    </Text>
  </Flex>
)

const convertWeekToSeconds = (week) => week * 7 * 24 * 60 * 60

const Overview = ({ usdValueStaked, lockedAmount, openCalculator, weekDuration }) => {
  const { lockedApy } = useVaultApy({ duration: convertWeekToSeconds(weekDuration) })

  // TODO: check ROI
  const roi = usdValueStaked * Number(lockedApy)

  const formattedRoi = formatNumber(roi, roi > 10000 ? 0 : 2, roi > 10000 ? 0 : 2)

  return (
    <LightGreyCard>
      <BalanceRow title="CAKE TO BE LOCKED" value={lockedAmount} decimals={2} />
      <BalanceRow title="APY" unit="%" value={lockedApy} decimals={2} />
      <BalanceRow title="DURATION" unit=" week" value={weekDuration} decimals={0} />
      <DateRow title="UNLOCK ON" value={addWeeks(new Date(), weekDuration)} />
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
