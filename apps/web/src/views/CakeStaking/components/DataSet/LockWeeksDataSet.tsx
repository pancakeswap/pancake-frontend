import { useTranslation } from '@pancakeswap/localization'
import { FlexGap, Text, TooltipText } from '@pancakeswap/uikit'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { WEEK } from 'config/constants/veCake'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useLockCakeData } from 'state/vecake/hooks'
import { useProxyVeCakeBalance } from 'views/CakeStaking/hooks/useProxyVeCakeBalance'
import { useTargetUnlockTime } from 'views/CakeStaking/hooks/useTargetUnlockTime'
import { useVeCakeAmount } from 'views/CakeStaking/hooks/useVeCakeAmount'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { Tooltips } from '../Tooltips'
import { DataBox, DataHeader, DataRow } from './DataBox'
import { formatDate } from './format'

interface LockCakeDataSetProps {
  hideLockWeeksDataSetStyle?: boolean
}

export const LockWeeksDataSet: React.FC<React.PropsWithChildren<LockCakeDataSetProps>> = ({
  hideLockWeeksDataSetStyle,
}) => {
  const { t } = useTranslation()
  const { cakeLockWeeks } = useLockCakeData()
  const { cakeLockExpired, cakeUnlockTime, nativeCakeLockedAmount } = useCakeLockStatus()
  const { balance: proxyVeCakeBalance } = useProxyVeCakeBalance()
  const unlockTimestamp = useTargetUnlockTime(
    Number(cakeLockWeeks) * WEEK,
    cakeLockExpired ? undefined : Number(cakeUnlockTime),
  )
  const veCakeAmountFromNative = useVeCakeAmount(nativeCakeLockedAmount.toString(), unlockTimestamp)
  const veCakeAmountFromNativeBN = useMemo(() => {
    return new BN(veCakeAmountFromNative)
  }, [veCakeAmountFromNative])

  const veCakeAmountBN = useMemo(() => {
    return proxyVeCakeBalance.plus(veCakeAmountFromNativeBN)
  }, [veCakeAmountFromNativeBN, proxyVeCakeBalance])

  const factor =
    veCakeAmountFromNativeBN && veCakeAmountFromNativeBN.gt(0)
      ? `${veCakeAmountFromNativeBN.div(nativeCakeLockedAmount.toString()).toPrecision(2)}x`
      : '0.00x'

  const newUnlockTime = useMemo(() => {
    return formatDate(dayjs.unix(Number(unlockTimestamp)))
  }, [unlockTimestamp])

  return (
    <DataBox $hideStyle={hideLockWeeksDataSetStyle} gap="8px">
      <DataHeader value={getBalanceAmount(veCakeAmountBN)} hideVeCakeIcon={hideLockWeeksDataSetStyle} />
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
