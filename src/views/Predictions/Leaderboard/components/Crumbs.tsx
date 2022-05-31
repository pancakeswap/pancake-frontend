/* eslint-disable jsx-a11y/anchor-is-valid */
import NextLink from 'next/link'
import { Box, Breadcrumbs, Text, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const Crumbs = () => {
  const { t } = useTranslation()

  return (
    <Box mb="24px">
      <Breadcrumbs>
        <NextLink href="/" passHref prefetch={false}>
          <Link>{t('Home')}</Link>
        </NextLink>
        <NextLink href="/prediction" passHref prefetch={false}>
          <Link>{t('Prediction')}</Link>
        </NextLink>
        <Text>{t('Leaderboard')}</Text>
      </Breadcrumbs>
    </Box>
  )
}

export default Crumbs
