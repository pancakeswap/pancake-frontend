import { useTranslation } from '@pancakeswap/localization'
import { Grid, Heading, useMatchBreakpoints } from '@pancakeswap/uikit'
import { LockCakeForm } from '../LockCakeForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { StyledCard } from './styled'

export const Migrate = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  return (
    <StyledCard innerCardProps={{ padding: ['24px 16px', '24px 16px', '24px'] }}>
      <Heading scale="md">{t('Migrate to get veCAKE')}</Heading>

      <Grid gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'} mt={32} gridColumnGap="24px" gridRowGap="24px">
        <LockCakeForm disabled />
        <LockWeeksForm disabled />
      </Grid>
    </StyledCard>
  )
}
