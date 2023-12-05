import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { CAKE } from '@pancakeswap/tokens'
import { Flex, FlexGap, Text, TokenImage } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { ApproveAndLockStatus } from 'state/vecake/atoms'
import { useRoundedUnlockTimestamp } from 'views/CakeStaking/hooks/useRoundedUnlockTimestamp'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'

type LockInfoProps = {
  amount: string
  week: string | number
  status: ApproveAndLockStatus
}

export const LockInfo: React.FC<LockInfoProps> = ({ amount, status }) => {
  const { cakeUnlockTime, nativeCakeLockedAmount, cakeLockExpired } = useCakeLockStatus()

  const txAmount = useMemo(() => {
    if ([ApproveAndLockStatus.INCREASE_WEEKS, ApproveAndLockStatus.INCREASE_WEEKS_PENDING].includes(status)) {
      return getBalanceNumber(new BN(nativeCakeLockedAmount.toString()))
    }
    return amount
  }, [status, nativeCakeLockedAmount, amount])

  const roundedUnlockTimestamp = useRoundedUnlockTimestamp(cakeLockExpired ? undefined : Number(cakeUnlockTime))

  const txUnlock = useMemo(() => {
    if ([ApproveAndLockStatus.INCREASE_AMOUNT, ApproveAndLockStatus.INCREASE_AMOUNT_PENDING].includes(status)) {
      return cakeUnlockTime
    }

    return Number(roundedUnlockTimestamp)
  }, [status, roundedUnlockTimestamp, cakeUnlockTime])

  const { t } = useTranslation()
  return (
    <FlexGap flexDirection="column" gap="4px" mt="4px" width="100%" alignItems="center" justifyContent="center">
      <Flex alignItems="center" width="100%" justifyContent="center">
        <TokenImage
          src={`https://pancakeswap.finance/images/tokens/${CAKE[ChainId.BSC].address}.png`}
          height={20}
          width={20}
          mr="4px"
          title={CAKE[ChainId.BSC].symbol}
        />
        <Text fontSize="14px">{`${txAmount} CAKE`}</Text>
      </Flex>

      <Text fontSize={12} color="textSubtle">
        {t('to be locked until')}
      </Text>

      <Text fontSize="14px">{dayjs.unix(txUnlock).format('DD MMM YYYY')}</Text>
    </FlexGap>
  )
}
