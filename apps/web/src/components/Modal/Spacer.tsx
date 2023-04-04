import { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

interface SpacerProps {
  size?: 'sm' | 'md' | 'lg'
}

const Spacer: React.FC<React.PropsWithChildren<SpacerProps>> = ({ size = 'md' }) => {
  const { spacing } = useContext(ThemeContext)

  let s: string
  switch (size) {
    case 'lg':
      s = spacing['32px']
      break
    case 'sm':
      s = spacing['12px']
      break
    case 'md':
    default:
      s = spacing['24px']
  }

  return <StyledSpacer size={s} />
}

interface StyledSpacerProps {
  size: string
}

const StyledSpacer = styled.div<StyledSpacerProps>`
  height: ${(props) => props.size};
  width: ${(props) => props.size};
`

export default Spacer
