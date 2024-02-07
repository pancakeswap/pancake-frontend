import { useTranslation } from '@pancakeswap/localization'
import { TooltipText } from '@pancakeswap/uikit'
import { getBalanceAmount, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import { useLockCakeData } from 'state/vecake/hooks'
import { getVeCakeAmount } from 'utils/getVeCakeAmount'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { Tooltips } from '../Tooltips'
import { DataBox, DataHeader, DataRow } from './DataBox'
import { formatDate } from './format'

interface LockCakeDataSetProps {
  hideLockCakeDataSetStyle?: boolean
}

export const LockCakeDataSet: React.FC<React.PropsWithChildren<LockCakeDataSetProps>> = ({
  hideLockCakeDataSetStyle,
}) => {
  const { t } = useTranslation()
  const { balance: veCakeBalance } = useVeCakeBalance()
  const { cakeUnlockTime, cakeLockedAmount } = useCakeLockStatus()
  const { cakeLockAmount } = useLockCakeData()
  const amountInputBN = useMemo(() => getDecimalAmount(new BN(cakeLockAmount || 0)), [cakeLockAmount])
  const amountLockedBN = useMemo(() => getBalanceAmount(new BN(cakeLockedAmount.toString() || '0')), [cakeLockedAmount])
  const amount = useMemo(() => {
    return getBalanceAmount(amountInputBN.plus(amountLockedBN))
  }, [amountInputBN, amountLockedBN])
  const currentTimestamp = useCurrentBlockTimestamp()
  const veCakeAmount = useMemo(() => {
    return getBalanceAmount(veCakeBalance).plus(getVeCakeAmount(cakeLockAmount, cakeUnlockTime - currentTimestamp))
  }, [cakeLockAmount, cakeUnlockTime, currentTimestamp, veCakeBalance])

  const unlockTime = useMemo(() => {
    return formatDate(dayjs.unix(Number(cakeUnlockTime)))
  }, [cakeUnlockTime])

  return (
    <DataBox $hideStyle={hideLockCakeDataSetStyle} gap="8px" mt="16px">
      <DataHeader value={veCakeAmount} hideVeCakeIcon={hideLockCakeDataSetStyle} />
      <DataRow label={t('CAKE to be locked')} value={amount.toFixed(2)} />
      <DataRow
        label={
          <Tooltips
            content={t(
              'Once locked, your CAKE will be staked in veCAKE contract until this date. Early withdrawal is not available.',
            )}
          >
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('Unlock on')}
            </TooltipText>
          </Tooltips>
        }
        value={unlockTime}
      />
    </DataBox>
  )
}
