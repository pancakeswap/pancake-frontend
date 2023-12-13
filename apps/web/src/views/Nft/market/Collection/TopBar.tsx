import { Box, ChevronLeftIcon, Flex } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import SearchBar from '../components/SearchBar'

const BackLink = styled(NextLinkFromReactRouter)`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  font-weight: 600;
`

const TopBar: React.FC<React.PropsWithChildren> = () => {
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
