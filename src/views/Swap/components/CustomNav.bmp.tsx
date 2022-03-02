import React from 'react'
import { Box, Image } from '@pancakeswap/uikit'
import { useTheme } from 'styled-components'
import { useThemeManager } from 'state/user/hooks'
import titleLight from '../../../../public/images/nav-title-light.png'
import titleDark from '../../../../public/images/nav-title-dark.png'

type Tprops = {
  top?: number
  height?: number
}

const title = {
  dark: titleDark,
  light: titleLight,
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
        <Image height={20} width={130} src={isDark ? title.dark : title.light} />
      </Box>
      <Box className="fill" sx={{ height: `${height + top}px` }} />
    </Box>
  )
}

export default React.memo(CustomNav)
