import React from 'react'
import { Box, ChevronLeftIcon, Flex } from '@pancakeswap/uikit'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import SearchBar from '../components/SearchBar'

const BackLink = styled(RouterLink)`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  font-weight: 600;
`

const TopBar: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Flex alignItems="center" justifyContent="space-between" mb="24px">
      <BackLink to={`${nftsBaseUrl}/collections`}>
        <ChevronLeftIcon color="primary" width="24px" />
        {t('All Collections')}
      </BackLink>
      <Box>
        <SearchBar />
      </Box>
    </Flex>
  )
}

export default TopBar
