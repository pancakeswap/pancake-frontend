import NextLink from 'next/link'
import { Box, Breadcrumbs, Text, StyledLink } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const Crumbs = () => {
  const { t } = useTranslation()

  return (
    <Box mb="24px">
      <Breadcrumbs>
        <NextLink href="/">
          <StyledLink color="primary">{t('Home')}</StyledLink>
        </NextLink>
        <NextLink href="/prediction">
          <StyledLink color="primary">{t('Prediction')}</StyledLink>
        </NextLink>
        <Text>{t('Leaderboard')}</Text>
      </Breadcrumbs>
    </Box>
  )
}

export default Crumbs
