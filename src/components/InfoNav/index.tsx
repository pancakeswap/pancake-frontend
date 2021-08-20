import React from 'react'
import styled from 'styled-components'
import { Link, useRouteMatch } from 'react-router-dom'
import { Box, Flex, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import SearchSmall from 'components/InfoSearch'
import { useTranslation } from 'contexts/Localization'

const NavWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
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
  const isPools = useRouteMatch(['/info/pools', '/info/pool', '/info/pair'])
  const isTokens = useRouteMatch(['/info/tokens', '/info/token'])
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
          <ButtonMenuItem as={Link} to="/">
            {t('Overview')}
          </ButtonMenuItem>
          <ButtonMenuItem as={Link} to="/pools">
            {t('Pools')}
          </ButtonMenuItem>
          <ButtonMenuItem as={Link} to="/tokens">
            {t('Tokens')}
          </ButtonMenuItem>
        </ButtonMenu>
      </Box>
      <Box width={['100%', '100%', '250px']}>
        <SearchSmall />
      </Box>
    </NavWrapper>
  )
}

export default InfoNav
