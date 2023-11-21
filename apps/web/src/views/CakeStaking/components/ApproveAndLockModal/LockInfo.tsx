import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { CAKE } from '@pancakeswap/tokens'
import { FlexGap, Text, TokenImage } from '@pancakeswap/uikit'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useMemo } from 'react'
import { ApproveAndLockStatus } from 'state/vecake/atoms'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'

type LockInfoProps = {
  amount: string
  week: string | number
  status: ApproveAndLockStatus
}

export const LockInfo: React.FC<LockInfoProps> = ({ amount, week, status }) => {
  const { cakeUnlockTime, nativeCakeLockedAmount } = useCakeLockStatus()
  const currentTimestamp = useCurrentBlockTimestamp()

  const txAmount = useMemo(() => {
    if ([ApproveAndLockStatus.INCREASE_WEEKS, ApproveAndLockStatus.INCREASE_WEEKS_PENDING].includes(status)) {
      return getBalanceNumber(new BN(nativeCakeLockedAmount.toString()))
    }
    return amount
  }, [status, nativeCakeLockedAmount, amount])

  const txUnlock = useMemo(() => {
    if ([ApproveAndLockStatus.INCREASE_AMOUNT, ApproveAndLockStatus.INCREASE_AMOUNT_PENDING].includes(status)) {
      return cakeUnlockTime
    }

    return dayjs
      .unix(cakeUnlockTime || currentTimestamp)
      .add(Number(week), 'weeks')
      .unix()
  }, [status, currentTimestamp, week, cakeUnlockTime])

  const { t } = useTranslation()
  return (
    <FlexGap gap="4px" width="100%" alignItems="center" justifyContent="center">
      <TokenImage
        src={`https://pancakeswap.finance/images/tokens/${CAKE[ChainId.BSC].address}.png`}
        height={20}
        width={20}
        title={CAKE[ChainId.BSC].symbol}
      />
      <Text fontSize="14px">{`${txAmount} CAKE`}</Text>

      <Text fontSize={12} color="textSubtle">
        {t('to be locked')}
      </Text>

      <Text fontSize="14px">{dayjs.unix(txUnlock).format('DD MMM YYYY')}</Text>
    </FlexGap>
  )
}
