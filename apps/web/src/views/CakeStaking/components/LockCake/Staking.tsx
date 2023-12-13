import { useTranslation } from '@pancakeswap/localization'
import { Grid, Heading, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { LockCakeForm } from '../LockCakeForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { NotLockingCard } from './NotLocking'
import { StyledCard } from './styled'

export const Staking = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { cakeLocked } = useCakeLockStatus()

  if (!cakeLocked) return <NotLockingCard />

  return (
    <StyledCard innerCardProps={{ padding: ['24px 16px', '24px 16px', '24px'] }}>
      <Heading scale="md">{t('Increase your veCAKE')}</Heading>

      <Grid gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'} mt={32} gridColumnGap="24px" gridRowGap="24px">
        <LockCakeForm />
        <LockWeeksForm />
      </Grid>
    </StyledCard>
  )
}
