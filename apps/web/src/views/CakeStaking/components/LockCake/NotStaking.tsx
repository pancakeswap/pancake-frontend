import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, ColumnCenter, Grid, Heading } from '@pancakeswap/uikit'
import { useState } from 'react'
import { getVeCakeAmount } from 'utils/getVeCakeAmount'
import { NewStakingDataSet } from '../DataSet'
import { LockCakeFormV2 } from '../LockCakeForm'
import { LockWeeksFormV2 } from '../LockWeeksForm'
import { StyledCard } from './styled'

export const NotStaking = () => {
  const { t } = useTranslation()
  const [cakeValue, setCakeValue] = useState('0')
  const [lockWeeks, setLockWeeks] = useState('52')
  return (
    <Box maxWidth={['100%', '72%']} mx="auto">
      <StyledCard innerCardProps={{ padding: '24px' }}>
        <Heading scale="md">{t('Lock CAKE to get veCAKE')}</Heading>
        <Grid gridTemplateColumns="1fr 1fr" mt={32} gridColumnGap="24px" padding={12} mb={32}>
          <LockCakeFormV2 fieldOnly value={cakeValue} onChange={setCakeValue} />
          <LockWeeksFormV2 fieldOnly value={lockWeeks} onChange={setLockWeeks} />
        </Grid>
        <NewStakingDataSet
          veCakeAmount={getVeCakeAmount(cakeValue, lockWeeks)}
          cakeAmount={Number(cakeValue)}
          duration={Number(lockWeeks)}
        />
        <ColumnCenter>
          <Button width="50%">{t('Lock CAKE')}</Button>
        </ColumnCenter>
      </StyledCard>
    </Box>
  )
}
