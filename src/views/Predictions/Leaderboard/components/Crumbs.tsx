import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Breadcrumbs, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'

/**
 * TODO: Move this to UI Kit
 */
const BreadcrumbLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryBright};
  }
`

const Crumbs = () => {
  const { t } = useTranslation()

  return (
    <Box mb="24px">
      <Breadcrumbs>
        <BreadcrumbLink to="/">{t('Home')}</BreadcrumbLink>
        <BreadcrumbLink to="/prediction">{t('Prediction')}</BreadcrumbLink>
        <Text>{t('Leaderboard')}</Text>
      </Breadcrumbs>
    </Box>
  )
}

export default Crumbs
