import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Breadcrumbs, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const Crumbs = () => {
  const { t } = useTranslation()

  return (
    <Box mb="24px">
      <Breadcrumbs>
        <Link to="/">{t('Home')}</Link>
        <Link to="/prediction">{t('Prediction')}</Link>
        <Text>{t('Leaderboard')}</Text>
      </Breadcrumbs>
    </Box>
  )
}

export default Crumbs
