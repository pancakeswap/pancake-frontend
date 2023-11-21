import { useTranslation } from '@pancakeswap/localization'
import { Grid, Heading, useMatchBreakpoints } from '@pancakeswap/uikit'
import { StyledCard } from './styled'
import { LockWeeksForm } from '../LockWeeksForm'
import { LockCakeForm } from '../LockCakeForm'

export const Expired = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <StyledCard innerCardProps={{ padding: '24px' }}>
      <Heading scale="md">{t('Renew to get veCAKE')}</Heading>
      <Grid gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'} mt={32} gridColumnGap="24px" gridRowGap="24px">
        <LockCakeForm disabled />
        <LockWeeksForm disabled />
      </Grid>
    </StyledCard>
  )
}
