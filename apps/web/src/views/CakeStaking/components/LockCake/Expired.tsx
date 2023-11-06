import { useTranslation } from '@pancakeswap/localization'
import { Box, Heading } from '@pancakeswap/uikit'
import { StyledCard } from './styled'
import { LockWeeksForm } from '../LockWeeksForm'

export const Expired = () => {
  const { t } = useTranslation()
  return (
    <StyledCard innerCardProps={{ padding: '24px' }}>
      <Heading scale="md">{t('Renew to get veCAKE')}</Heading>
      <Box mt={32}>
        <LockWeeksForm expired />
      </Box>
    </StyledCard>
  )
}
