import React from 'react'
import mpService from '@binance/mp-service'
import { Box, Flex, Image, Text, WalletIcon } from '@pancakeswap/uikit'
import styled, { useTheme } from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useThemeManager } from 'state/user/hooks'
import titleLight from '../../../../../public/images/nav-title-light.png'
import titleDark from '../../../../../public/images/nav-title-dark.png'

type Tprops = {
  top?: number
  height?: number
}

const title = {
  dark: titleDark,
  light: titleLight,
}
const StyledWallet = styled(Flex)<{ isActive: boolean }>`
  padding: 6px 11px;
  position: absolute;
  left: 18px;
  align-items: center;
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.dropdown : 'transparent')};
  border-radius: 20px;
`
const Wallet = () => {
  const { account } = useActiveWeb3React()
  const isActive = !!account
  const handleWalletClick = () => {
    mpService.navigateToMiniProgram({
      appId: 'hhL98uho2A4sGYSHCEdCCo',
    })
  }
  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 2)}` : null
  return (
    <StyledWallet isActive={isActive} onClick={handleWalletClick}>
      <WalletIcon color={isActive ? '#7A6EAA' : '#929AA5'} />
      <Text style={{ marginLeft: '4px' }} color="textSubtle">
        {accountEllipsis}
      </Text>
    </StyledWallet>
  )
}
function CustomNav({ top = 0, height = 44 }: Tprops) {
  const theme = useTheme()
  const [isDark] = useThemeManager()
  return (
    <Box className="CustomNav">
      <Box
        style={{
          display: 'flex',
          height: `${height}px`,
          alignItems: 'center',
          // px: '24px',
          position: 'fixed',
          top: '0px',
          left: '0px',
          right: '0px',
          justifyContent: 'center',
          width: '100vw',
          zIndex: '10',
          background: theme.colors.backgroundAlt,
          paddingTop: `${top}px`,
          boxSizing: 'content-box',
        }}
      >
        <Wallet />
        <Image height={20} width={130} src={isDark ? title.dark : title.light} />
      </Box>
      <Box className="fill" sx={{ height: `${height + top}px` }} />
    </Box>
  )
}

export default React.memo(CustomNav)
