import styled from 'styled-components'
import { useHttpLocations } from '@pancakeswap/hooks'
import { TokenLogo } from '@pancakeswap/uikit'
import { BAD_SRCS } from './constants'

const StyledListLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export function ListLogo({
  logoURI,
  style,
  size = '24px',
  alt,
}: {
  logoURI: string
  size?: string
  style?: React.CSSProperties
  alt?: string
}) {
  const srcs: string[] = useHttpLocations(logoURI)

  return <StyledListLogo badSrcs={BAD_SRCS} alt={alt} size={size} srcs={srcs} style={style} />
}
