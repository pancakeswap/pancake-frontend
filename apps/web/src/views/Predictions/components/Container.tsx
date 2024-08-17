import { memo } from 'react'
import { styled } from 'styled-components'

const Container = styled.div`
  background: ${({ theme }) => theme.colors.gradientVioletAlt};
  @media only screen and (max-width: 575px) and (min-height: 740px) {
    height: calc(100vh - 105px);
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    height: calc(100vh - 55px);
  }
  overflow: hidden;
`

export default memo(Container)
