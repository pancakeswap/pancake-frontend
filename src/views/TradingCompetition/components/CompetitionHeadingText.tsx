import { Heading } from '@tovaswapui/uikit'
import styled, { DefaultTheme } from 'styled-components'

const H1SizeStyles = (theme: DefaultTheme) => `
  font-size: 48px;
  white-space: nowrap;

  ${theme.mediaQueries.sm} {
    font-size: 64px;
  }
`

const H2SizeStyles = (theme: DefaultTheme) => `
  font-size: 32px;
  white-space: nowrap;

  ${theme.mediaQueries.sm} {
    font-size: 40px
  }
`

const sharedStyles = (props: HeadingProps) => `
  text-align: center;
  line-height: 110%;
  color: #ffffff;
  background:  ${props.background ? props.background : 'linear-gradient(#7645d9 0%, #452a7a 100%)'};
  background-clip: text;
  -webkit-background-clip: text;
  ${
    props.$fill
      ? `-webkit-text-fill-color: transparent;`
      : `-webkit-text-stroke: 4px transparent;
       text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);`
  }
`

const sharedVisiblyHiddenStyles = `
  visibility: hidden;
  height: 0px;
`

interface HeadingProps {
  background?: string
  $fill?: boolean
}

export const Heading1Text = styled(Heading)<HeadingProps>`
  ${({ theme }) => H1SizeStyles(theme)}
  ${(props) => sharedStyles(props)}
`

export const Heading2Text = styled(Heading)<HeadingProps>`
  ${({ theme }) => H2SizeStyles(theme)}
  ${(props) => sharedStyles(props)}
`

export const VisuallyHiddenHeading1Text = styled(Heading)`
  ${({ theme }) => H1SizeStyles(theme)}
  ${sharedVisiblyHiddenStyles}
`

export const VisuallyHiddenHeading2Text = styled(Heading)`
  ${({ theme }) => H2SizeStyles(theme)}
  ${sharedVisiblyHiddenStyles}
`

export default Heading1Text
