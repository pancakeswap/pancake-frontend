import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, ColumnCenter, Grid, Heading, useMatchBreakpoints } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { useLockCakeData } from 'state/vecake/hooks'
import { useWriteApproveAndLockCallback } from 'views/CakeStaking/hooks/useContractWrite'
import { NewStakingDataSet } from '../DataSet'
import { LockCakeForm } from '../LockCakeForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { StyledCard } from './styled'

export const NotLocking = () => {
  return (
    <>
      <Box maxWidth={['100%', '100%', '72%']} mx="auto">
        <NotLockingCard />
      </Box>
    </>
  )
}

export const NotLockingCard = () => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { cakeLockAmount, cakeLockWeeks } = useLockCakeData()
  const { isDesktop } = useMatchBreakpoints()

  const disabled = useMemo(
    () => Boolean(!Number(cakeLockAmount) || !Number(cakeLockWeeks)),
    [cakeLockAmount, cakeLockWeeks],
  )

  const handleModalOpen = useWriteApproveAndLockCallback()

  return (
    <StyledCard innerCardProps={{ padding: ['24px 16px', '24px 16px', '24px'] }}>
      <Heading scale="md">{t('Lock CAKE to get veCAKE')}</Heading>
      <Grid
        gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'}
        gridColumnGap="24px"
        gridRowGap={isDesktop ? '0' : '24px'}
        padding={[0, 0, 12]}
        mt={32}
        mb={32}
      >
        <LockCakeForm fieldOnly />
        <LockWeeksForm fieldOnly />
      </Grid>
      <NewStakingDataSet cakeAmount={Number(cakeLockAmount)} />
      <ColumnCenter>
        {account ? (
          <Button disabled={disabled} width={['100%', '100%', '50%']} onClick={handleModalOpen}>
            {t('Lock CAKE')}
          </Button>
        ) : (
          <ConnectWalletButton width={['100%', '100%', '50%']} />
        )}
      </ColumnCenter>
    </StyledCard>
  )
}
