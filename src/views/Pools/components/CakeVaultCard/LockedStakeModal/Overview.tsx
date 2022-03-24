import { Text, Flex, IconButton, CalculateIcon } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import Balance from 'components/Balance'
import { format } from 'date-fns'
import BigNumber from 'bignumber.js'
import { formatNumber } from 'utils/formatBalance'

const BalanceRow = ({ title, value, unit = '', decimals, suffix = null }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Flex alignItems="center">
      <Balance fontSize="16px" value={parseFloat(value)} decimals={decimals} unit={unit} />
      {suffix}
    </Flex>
  </Flex>
)

const DateRow = ({ title, value }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Text color="text">{format(value, 'MMM do, yyyy HH:mm')}</Text>
  </Flex>
)

const Overview = ({ stakeAmount, cakePriceBusd, apy, openCalculator }) => {
  const usdValueStaked = new BigNumber(stakeAmount).times(cakePriceBusd).toNumber()
  const roi = (usdValueStaked * apy) / 100
  const formattedRoi = formatNumber(roi, roi > 10000 ? 0 : 2, roi > 10000 ? 0 : 2)

  return (
    <LightGreyCard>
      <BalanceRow title="CAKE TO BE LOCKED" value={stakeAmount} decimals={2} />
      <BalanceRow title="APY" unit="%" value={apy} decimals={2} />
      <BalanceRow title="DURATION" unit=" week" value="1" decimals={0} />
      <DateRow title="UNLOCK ON" value={1648465751778} />
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
