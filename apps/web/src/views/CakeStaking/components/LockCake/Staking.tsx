import { useTranslation } from '@pancakeswap/localization'
import { Grid, Heading, useMatchBreakpoints } from '@pancakeswap/uikit'
import { StyledCard } from './styled'
import { LockCakeForm } from '../LockCakeForm'
import { LockWeeksForm } from '../LockWeeksForm'

export const Staking = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  return (
    <StyledCard innerCardProps={{ padding: '24px' }}>
      <Heading scale="md">{t('Increase your veCAKE')}</Heading>
      <Grid gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'} mt={32} gridColumnGap="24px" gridRowGap="24px">
        <LockCakeForm />
        <LockWeeksForm />
      </Grid>
    </StyledCard>
  )
}
