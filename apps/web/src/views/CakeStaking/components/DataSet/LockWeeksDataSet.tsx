import { useTranslation } from '@pancakeswap/localization'
import { FlexGap, Text, TooltipText } from '@pancakeswap/uikit'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { MAX_VECAKE_LOCK_WEEKS, WEEK } from 'config/constants/veCake'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useLockCakeData } from 'state/vecake/hooks'
import { getVeCakeAmount } from 'utils/getVeCakeAmount'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useProxyVeCakeBalance } from 'views/CakeStaking/hooks/useProxyVeCakeBalance'
import { useRoundedUnlockTimestamp } from 'views/CakeStaking/hooks/useRoundedUnlockTimestamp'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { Tooltips } from '../Tooltips'
import { DataBox, DataHeader, DataRow } from './DataBox'
import { formatDate } from './format'

export const LockWeeksDataSet = () => {
  const { t } = useTranslation()
  const { cakeLockWeeks } = useLockCakeData()
  const { cakeLockExpired, cakeUnlockTime, nativeCakeLockedAmount } = useCakeLockStatus()
  const { balance: proxyVeCakeBalance } = useProxyVeCakeBalance()
  const currentTimestamp = useCurrentBlockTimestamp()
  const veCakeAmountFromNativeBN = useMemo(() => {
    let duration = cakeUnlockTime - currentTimestamp + Number(cakeLockWeeks || 0) * WEEK
    if (duration > MAX_VECAKE_LOCK_WEEKS * WEEK) duration = MAX_VECAKE_LOCK_WEEKS * WEEK
    return new BN(getVeCakeAmount(nativeCakeLockedAmount.toString(), duration))
  }, [cakeLockWeeks, cakeUnlockTime, currentTimestamp, nativeCakeLockedAmount])

  const veCakeAmountBN = useMemo(() => {
    return proxyVeCakeBalance.plus(veCakeAmountFromNativeBN)
  }, [veCakeAmountFromNativeBN, proxyVeCakeBalance])

  const factor =
    veCakeAmountFromNativeBN && veCakeAmountFromNativeBN.gt(0)
      ? `${veCakeAmountFromNativeBN.div(nativeCakeLockedAmount.toString()).toPrecision(2)}x`
      : '0.00x'

  const newUnlockTimestamp = useRoundedUnlockTimestamp(cakeLockExpired ? undefined : Number(cakeUnlockTime))
  const newUnlockTime = useMemo(() => {
    return formatDate(dayjs.unix(Number(newUnlockTimestamp)))
  }, [newUnlockTimestamp])

  return (
    <DataBox gap="8px">
      <DataHeader value={String(getBalanceAmount(veCakeAmountBN).toFixed(2))} />
      <DataRow
        label={
          <Tooltips
            content={t(
              'The ratio factor between the amount of CAKE locked and the final veCAKE number. Extend your lock duration for a higher ratio factor.',
            )}
          >
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('factor')}
            </TooltipText>
          </Tooltips>
        }
        value={factor}
      />
      <DataRow
        label={
          <Tooltips
            content={t(
              'Once locked, your CAKE will be staked in veCAKE contract until this date. Early withdrawal is not available.',
            )}
          >
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('unlock on')}
            </TooltipText>
          </Tooltips>
        }
        value={cakeLockExpired && !cakeLockWeeks ? <ExpiredUnlockTime time={cakeUnlockTime!} /> : newUnlockTime}
      />
    </DataBox>
  )
}

const ExpiredUnlockTime: React.FC<{
  time: number
}> = ({ time }) => {
  const { t } = useTranslation()
  return (
    <FlexGap gap="2px" alignItems="baseline">
      <Text fontSize={12}>{formatDate(dayjs.unix(time))}</Text>
      <Text fontWeight={700} fontSize={16} color="#D67E0A">
        {t('Unlocked')}
      </Text>
    </FlexGap>
  )
}
