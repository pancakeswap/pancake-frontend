import { useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Flex, Box, Text } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { usePriceCakeBusd } from 'state/farms/hooks'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import { PotteryWithdrawAbleData } from 'state/types'
import WithdrawButton from 'views/Pottery/components/Pot/Claim/WithdrawButton'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { calculateCakeAmount } from 'views/Pottery/helpers'

interface AvailableWithdrawProps {
  withdrawData: PotteryWithdrawAbleData
}

const AvailableWithdraw: React.FC<AvailableWithdrawProps> = ({ withdrawData }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const cakePriceBusd = usePriceCakeBusd()
  const { previewRedeem, depositDate, shares, status, potteryVaultAddress, totalSupply, totalLockCake } = withdrawData

  const cakeNumber = useMemo(() => new BigNumber(previewRedeem), [previewRedeem])
  const amountAsBn = calculateCakeAmount({
    status,
    previewRedeem,
    shares,
    totalSupply: new BigNumber(totalSupply),
    totalLockCake: new BigNumber(totalLockCake),
  })

  const amount = getBalanceNumber(amountAsBn)
  const amountInBusd = new BigNumber(amount).times(cakePriceBusd).toNumber()

  const lockDate = useMemo(() => {
    const lockDateTimeSeconds = convertTimeToSeconds(depositDate)
    return new Date(lockDateTimeSeconds).toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [depositDate, locale])

  return (
    <Box>
      <Text fontSize="12px" color="secondary" bold as="span" textTransform="uppercase">
        {t('stake withdraw')}
      </Text>
      <Text fontSize="12px" color="textSubtle" bold as="span" ml="4px" textTransform="uppercase">
        {t('available')}
      </Text>
      <Flex mb="11px">
        <Box>
          <Balance fontSize="20px" lineHeight="110%" value={amount} decimals={2} bold />
          <Balance fontSize="12px" lineHeight="110%" color="textSubtle" value={amountInBusd} decimals={2} unit=" USD" />
          <Text fontSize="12px" lineHeight="110%" color="textSubtle">
            {t('Deposited %date%', { date: lockDate })}
          </Text>
        </Box>
        <WithdrawButton cakeNumber={cakeNumber} redeemShare={shares} potteryVaultAddress={potteryVaultAddress} />
      </Flex>
    </Box>
  )
}

export default AvailableWithdraw
