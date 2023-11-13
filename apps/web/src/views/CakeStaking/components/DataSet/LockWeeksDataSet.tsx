import { useTranslation } from '@pancakeswap/localization'
import { FlexGap, Text, TooltipText } from '@pancakeswap/uikit'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useLockCakeData } from 'state/vecake/hooks'
import { getVeCakeAmount } from 'utils/getVeCakeAmount'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { Tooltips } from '../Tooltips'
import { DataBox, DataHeader, DataRow } from './DataBox'

const formatUnixDate = (time: number) => dayjs.unix(time).format('MMM D YYYY HH:mm')

export const LockWeeksDataSet = () => {
  const { t } = useTranslation()
  const { cakeLockAmount, cakeLockWeeks } = useLockCakeData()
  const { cakeLockExpired, cakeUnlockTime } = useCakeLockStatus()
  const veCakeAmount = useMemo(() => getVeCakeAmount(cakeLockAmount, cakeLockWeeks), [cakeLockAmount, cakeLockWeeks])
  const factor = veCakeAmount && veCakeAmount ? `${new BN(veCakeAmount).div(cakeLockAmount).toPrecision(2)}x` : '0.00x'

  return (
    <DataBox gap="8px">
      <DataHeader value={String(veCakeAmount)} />
      <DataRow
        label={
          <Tooltips content={t('@todo')}>
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('factor')}
            </TooltipText>
          </Tooltips>
        }
        value={factor}
      />
      <DataRow
        label={
          <Tooltips content={t('@todo')}>
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('unlock on')}
            </TooltipText>
          </Tooltips>
        }
        value={
          cakeLockExpired && !cakeLockWeeks ? (
            <ExpiredUnlockTime time={cakeUnlockTime!} />
          ) : (
            formatUnixDate(dayjs().add(Number(cakeLockWeeks), 'weeks').unix())
          )
        }
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
      <Text fontSize={12}>{formatUnixDate(time)}</Text>
      <Text fontWeight={700} fontSize={16} color="#D67E0A">
        {t('Unlocked')}
      </Text>
    </FlexGap>
  )
}
