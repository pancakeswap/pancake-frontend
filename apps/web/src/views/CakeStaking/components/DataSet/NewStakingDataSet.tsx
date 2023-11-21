import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, Box, Text, TooltipText } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import React from 'react'
import styled from 'styled-components'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { MyVeCakeCard } from '../MyVeCakeCard'
import { Tooltips } from '../Tooltips'
import { DataRow } from './DataBox'

const ValueText = styled(Text)`
  fontsize: 16px;
  fontweight: 400;
`

export const NewStakingDataSet: React.FC<{
  veCakeAmount?: number
  cakeAmount?: number
  duration?: number
}> = ({ veCakeAmount = 0, cakeAmount = 0, duration = 0 }) => {
  const { t } = useTranslation()
  const currentTimestamp = useCurrentBlockTimestamp()
  const veCake = veCakeAmount ? getFullDisplayBalance(new BN(veCakeAmount), 0, 3) : '0'
  const factor = veCakeAmount && veCakeAmount ? `${new BN(veCakeAmount).div(cakeAmount).toPrecision(2)}x` : ''
  const unlockOn = duration ? dayjs.unix(currentTimestamp).add(duration, 'week').format('MMM D YYYY HH:mm') : ''
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
              <Tooltips content={t('@todo')}>
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
            value={<ValueText>{duration} weeks</ValueText>}
          />
          <DataRow
            label={
              <Tooltips content={t('@todo')}>
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
