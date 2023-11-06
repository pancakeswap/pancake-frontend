import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, ColumnCenter, Grid, Heading } from '@pancakeswap/uikit'
import { StyledCard } from './styled'
import { LockCakeForm } from '../LockCakeForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { NewStakingDataSet } from '../DataSet'

export const NotStaking = () => {
  const { t } = useTranslation()
  return (
    <Box maxWidth={['100%', '72%']} mx="auto">
      <StyledCard innerCardProps={{ padding: '24px' }}>
        <Heading scale="md">{t('Lock CAKE to get veCAKE')}</Heading>
        <Grid gridTemplateColumns="1fr 1fr" mt={32} gridColumnGap="24px" padding={12} mb={32}>
          <LockCakeForm fieldOnly />
          <LockWeeksForm fieldOnly />
        </Grid>
        <NewStakingDataSet />
        <ColumnCenter>
          <Button width="50%">{t('Lock CAKE')}</Button>
        </ColumnCenter>
      </StyledCard>
    </Box>
  )
}
