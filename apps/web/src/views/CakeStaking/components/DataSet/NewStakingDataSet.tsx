import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, Box, Text, TooltipText } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { MyVeCakeCard } from '../MyVeCakeCard'
import { Tooltips } from '../Tooltips'
import { DataRow } from './DataBox'

const LabelText = styled(Text)`
  fontsize: 14px;
  fontweight: 400;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const ValueText = styled(Text)`
  fontsize: 16px;
  fontweight: 400;
`

export const NewStakingDataSet = () => {
  const { t } = useTranslation()
  return (
    <>
      <Text fontSize={12} bold color="textSubtle" textTransform="uppercase">
        {t('lock overview')}
      </Text>
      <Box padding={12}>
        <MyVeCakeCard type="row" />
        <AutoRow px="16px" py="12px" gap="8px">
          <DataRow
            label={
              <Text fontSize={14} color="textSubtle">
                {t('CAKE to be locked')}
              </Text>
            }
            value={<ValueText>1438.45</ValueText>}
          />
          <DataRow
            label={
              <Text fontSize={14} color="textSubtle">
                {t('CAKE to be locked')}
              </Text>
            }
            value={<ValueText>1438.45</ValueText>}
          />
          <DataRow
            label={
              <Text fontSize={14} color="textSubtle">
                {t('CAKE to be locked')}
              </Text>
            }
            value={<ValueText>1438.45</ValueText>}
          />
          <DataRow
            label={
              <Tooltips content={t('@todo')}>
                <TooltipText fontSize={14} fontWeight={400} color="textSubtle">
                  {t('Unlock on')}
                </TooltipText>
              </Tooltips>
            }
            value={<ValueText>1438.45</ValueText>}
          />
        </AutoRow>
      </Box>
    </>
  )
}
