import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, Box, Text, TooltipText } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { useLockCakeData } from 'state/vecake/hooks'
import styled from 'styled-components'
import { useRoundedUnlockTimestamp } from 'views/CakeStaking/hooks/useRoundedUnlockTimestamp'
import { MyVeCakeCard } from '../MyVeCakeCard'
import { Tooltips } from '../Tooltips'
import { DataRow } from './DataBox'
import { formatDate } from './format'

const ValueText = styled(Text)`
  fontsize: 16px;
  fontweight: 400;
`

export const NewStakingDataSet: React.FC<{
  veCakeAmount?: number
  cakeAmount?: number
}> = ({ veCakeAmount = 0, cakeAmount = 0 }) => {
  const { t } = useTranslation()
  const veCake = veCakeAmount ? getFullDisplayBalance(new BN(veCakeAmount), 0, 3) : '0'
  const factor = veCakeAmount && veCakeAmount ? `${new BN(veCakeAmount).div(cakeAmount).toPrecision(2)}x` : '0x'
  const { cakeLockWeeks } = useLockCakeData()
  const unlockTimestamp = useRoundedUnlockTimestamp()
  const unlockOn = useMemo(() => {
    return formatDate(dayjs.unix(Number(unlockTimestamp)))
  }, [unlockTimestamp])
  return (
    <>
      <Text fontSize={12} bold color="textSubtle" textTransform="uppercase">
        {t('lock overview')}
      </Text>
      <Box padding={12}>
        <MyVeCakeCard type="row" value={veCake} />
        <AutoRow px="16px" py="12px" gap="8px">
          <DataRow
            label={
              <Text fontSize={14} color="textSubtle">
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
