import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, ColumnCenter, Grid, Heading } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useLockCakeData } from 'state/vecake/hooks'
import { getVeCakeAmount } from 'utils/getVeCakeAmount'
import { useWriteApproveAndLockCallback } from 'views/CakeStaking/hooks/useContractWrite/useWriteApproveAndLockCallback'
import { NewStakingDataSet } from '../DataSet'
import { LockCakeForm } from '../LockCakeForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { StyledCard } from './styled'

export const NotLocking = () => {
  const { t } = useTranslation()
  const { cakeLockAmount, cakeLockWeeks } = useLockCakeData()

  const disabled = useMemo(
    () => Boolean(!Number(cakeLockAmount) || !Number(cakeLockWeeks)),
    [cakeLockAmount, cakeLockWeeks],
  )

  const handleModalOpen = useWriteApproveAndLockCallback()

  return (
    <>
      <Box maxWidth={['100%', '72%']} mx="auto">
        <StyledCard innerCardProps={{ padding: '24px' }}>
          <Heading scale="md">{t('Lock CAKE to get veCAKE')}</Heading>
          <Grid gridTemplateColumns="1fr 1fr" mt={32} gridColumnGap="24px" padding={12} mb={32}>
            <LockCakeForm fieldOnly />
            <LockWeeksForm fieldOnly />
          </Grid>
          <NewStakingDataSet
            veCakeAmount={getVeCakeAmount(cakeLockAmount, cakeLockWeeks)}
            cakeAmount={Number(cakeLockAmount)}
            duration={Number(cakeLockWeeks)}
          />
          <ColumnCenter>
            <Button disabled={disabled} width="50%" onClick={handleModalOpen}>
              {t('Lock CAKE')}
            </Button>
          </ColumnCenter>
        </StyledCard>
      </Box>
    </>
  )
}
