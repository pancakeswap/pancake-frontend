import React from 'react'
import { Box, Image } from '@pancakeswap/uikit'
import { useTheme } from 'styled-components'
import titleLight from '../../../../public/images/nav-title-light.png'
import bunnyLogo from '../../../../public/images/bunny-white.png'

type Tprops = {
  top?: number
  height?: number
}

function CustomNav({ top = 0, height = 44 }: Tprops) {
  const theme = useTheme()
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
        <Image mr="6px" size="20px" src={bunnyLogo} />
        <Image height={14} width={105} src={titleLight} />
      </Box>
      <Box className="fill" sx={{ height: `${height + top}px` }} />
    </Box>
  )
}

export default React.memo(CustomNav)
