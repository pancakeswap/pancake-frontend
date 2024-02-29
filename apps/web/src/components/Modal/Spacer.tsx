import { styled } from 'styled-components'

const Spacer: React.FC<React.PropsWithChildren> = () => {
  return <StyledSpacer size="24px" />
}

interface StyledSpacerProps {
  size: string
}

const StyledSpacer = styled.div<StyledSpacerProps>`
  height: ${(props) => props.size};
  width: ${(props) => props.size};
`

export default Spacer
