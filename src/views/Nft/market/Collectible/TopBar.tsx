import React from 'react'
import { Box, ChevronLeftIcon, Flex } from '@pancakeswap/uikit'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import AddressInputSelect from 'components/AddressInputSelect'
import { nftsBaseUrl } from 'views/Nft/market'

const BackLink = styled(RouterLink)`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  font-weight: 600;
`

const TopBar: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()

  const handleAddressClick = (value: string) => {
    history.push(`${nftsBaseUrl}/profile/${value}`)
  }

  return (
    <Flex alignItems="center" justifyContent="space-between" mb="24px">
      <BackLink to="/collectibles">
        <ChevronLeftIcon color="primary" width="24px" />
        {t('All Collections')}
      </BackLink>
      <Box>
        <AddressInputSelect onAddressClick={handleAddressClick} />
      </Box>
    </Flex>
  )
}

export default TopBar
