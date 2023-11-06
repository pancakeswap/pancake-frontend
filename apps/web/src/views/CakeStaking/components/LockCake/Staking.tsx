import { useTranslation } from '@pancakeswap/localization'
import { Grid, Heading } from '@pancakeswap/uikit'
import { StyledCard } from './styled'
import { LockCakeForm } from '../LockCakeForm'
import { LockWeeksForm } from '../LockWeeksForm'

export const Staking = () => {
  const { t } = useTranslation()
  return (
    <StyledCard innerCardProps={{ padding: '24px' }}>
      <Heading scale="md">{t('Increase your veCAKE')}</Heading>
      <Grid gridTemplateColumns="1fr 1fr" mt={32} gridColumnGap="24px">
        <LockCakeForm />
        <LockWeeksForm />
      </Grid>
    </StyledCard>
  )
}
