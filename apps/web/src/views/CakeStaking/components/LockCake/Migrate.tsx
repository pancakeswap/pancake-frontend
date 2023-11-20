import { useTranslation } from '@pancakeswap/localization'
import { Grid, Heading } from '@pancakeswap/uikit'
import { LockWeeksForm } from '../LockWeeksForm'
import { LockCakeForm } from '../LockCakeForm'
import { StyledCard } from './styled'

export const Migrate = () => {
  const { t } = useTranslation()
  return (
    <StyledCard innerCardProps={{ padding: '24px' }}>
      <Heading scale="md">{t('Migrate to get veCAKE')}</Heading>

      <Grid gridTemplateColumns="1fr 1fr" mt={32} gridColumnGap="24px">
        <LockCakeForm disabled />
        <LockWeeksForm disabled />
      </Grid>
    </StyledCard>
  )
}
