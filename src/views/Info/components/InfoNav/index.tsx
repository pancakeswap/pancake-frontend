import { Box, ButtonMenu, ButtonMenuItem, Flex } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Search from 'views/Info/components/InfoSearch'

const NavWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  justify-content: space-between;
  padding: 20px 16px;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px 40px;
    flex-direction: row;
  }
`

const InfoNav = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { chainName } = router.query
  const isPools = router.pathname === `/info${chainName && `/[chainName]`}/pools`
  const isTokens = router.pathname === `/info${chainName && `/[chainName]`}/tokens`
  const chianNamePath = chainName ? `/${chainName}` : ''
  let activeIndex = 0
  if (isPools) {
    activeIndex = 1
  }
  if (isTokens) {
    activeIndex = 2
  }
  return (
    <NavWrapper>
      <Box>
        <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
          <ButtonMenuItem as={NextLinkFromReactRouter} to={`/info${chianNamePath}`}>
            {t('Overview')}
          </ButtonMenuItem>
          <ButtonMenuItem as={NextLinkFromReactRouter} to={`/info${chianNamePath}/pools`}>
            {t('Pools')}
          </ButtonMenuItem>
          <ButtonMenuItem as={NextLinkFromReactRouter} to={`/info${chianNamePath}/tokens`}>
            {t('Tokens')}
          </ButtonMenuItem>
        </ButtonMenu>
      </Box>
      <Box width={['100%', '100%', '250px']}>
        <Search />
      </Box>
    </NavWrapper>
  )
}

export default InfoNav
