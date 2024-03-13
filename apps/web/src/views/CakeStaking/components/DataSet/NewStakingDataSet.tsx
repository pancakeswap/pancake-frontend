import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, Box, Text, TooltipText, useMatchBreakpoints } from '@pancakeswap/uikit'
import { getDecimalAmount, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { WEEK } from 'config/constants/veCake'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { useLockCakeData } from 'state/vecake/hooks'
import styled from 'styled-components'
import { useProxyVeCakeBalance } from 'views/CakeStaking/hooks/useProxyVeCakeBalance'
import { useTargetUnlockTime } from 'views/CakeStaking/hooks/useTargetUnlockTime'
import { useVeCakeAmount } from 'views/CakeStaking/hooks/useVeCakeAmount'
import { MyVeCakeCard } from '../MyVeCakeCard'
import { Tooltips } from '../Tooltips'
import { DataRow } from './DataBox'
import { formatDate } from './format'

const ValueText = styled(Text)`
  font-size: 16px;
  font-weight: 400;
`

interface NewStakingDataSetProps {
  cakeAmount?: number
  customVeCakeCard?: JSX.Element
  customDataRow?: JSX.Element
}

export const NewStakingDataSet: React.FC<React.PropsWithChildren<NewStakingDataSetProps>> = ({
  cakeAmount = 0,
  customVeCakeCard,
  customDataRow,
}) => {
  const { t } = useTranslation()
  const { cakeLockWeeks } = useLockCakeData()
  const unlockTimestamp = useTargetUnlockTime(Number(cakeLockWeeks) * WEEK)
  const cakeAmountBN = useMemo(() => getDecimalAmount(new BN(cakeAmount)).toString(), [cakeAmount])
  const veCakeAmountFromNative = useVeCakeAmount(cakeAmountBN, unlockTimestamp)
  const { balance: proxyVeCakeBalance } = useProxyVeCakeBalance()
  const veCakeAmount = useMemo(
    () => proxyVeCakeBalance.plus(veCakeAmountFromNative),
    [proxyVeCakeBalance, veCakeAmountFromNative],
  )

  const veCake = veCakeAmount ? getFullDisplayBalance(new BN(veCakeAmount), 18, 3) : '0'
  const factor =
    veCakeAmountFromNative && veCakeAmountFromNative
      ? `${new BN(veCakeAmountFromNative).div(cakeAmountBN).toPrecision(2)}x`
      : '0x'
  const { isDesktop } = useMatchBreakpoints()
  const unlockOn = useMemo(() => {
    return formatDate(dayjs.unix(Number(unlockTimestamp)))
  }, [unlockTimestamp])
  return (
    <>
      <Text fontSize={12} bold color={isDesktop ? 'textSubtle' : undefined} textTransform="uppercase">
        {t('lock overview')}
      </Text>
      <Box padding={['16px 0', '16px 0', 12]}>
        {customVeCakeCard ?? <MyVeCakeCard type="row" value={veCake} />}
        <AutoRow px={['0px', '0px', '16px']} py={['16px', '16px', '12px']} gap="8px">
          {customDataRow}
          <DataRow
            label={
              <Text fontSize={14} color="textSubtle" textTransform="uppercase">
                {t('CAKE to be locked')}
              </Text>
            }
            value={<ValueText>{cakeAmount}</ValueText>}
          />
          <DataRow
            label={
              <Tooltips
                content={t(
                  'The ratio factor between the amount of CAKE locked and the final veCAKE number. Extend your lock duration for a higher ratio factor.',
                )}
              >
                <TooltipText fontSize={14} fontWeight={400} color="textSubtle">
                  {t('Factor')}
                </TooltipText>
              </Tooltips>
            }
            value={<ValueText>{factor}</ValueText>}
          />
          <DataRow
            label={
              <Text fontSize={14} color="textSubtle">
                {t('Duration')}
              </Text>
            }
            value={<ValueText>{cakeLockWeeks} weeks</ValueText>}
          />
          <DataRow
            label={
              <Tooltips
                content={t(
                  'Once locked, your CAKE will be staked in veCAKE contract until this date. Early withdrawal is not available.',
                )}
              >
                <TooltipText fontSize={14} fontWeight={400} color="textSubtle">
                  {t('Unlock on')}
                </TooltipText>
              </Tooltips>
            }
            value={<ValueText>{unlockOn}</ValueText>}
          />
        </AutoRow>
      </Box>
    </>
  )
}
