import { Heading } from '@pancakeswap-libs/uikit'
import styled, { DefaultTheme } from 'styled-components'
import React from 'react'

const H1SizeStyles = (theme: DefaultTheme) => `
  font-size: 48px;
  line-height: 110%;
  white-space: nowrap;

  ${theme.mediaQueries.sm} {
    font-size: 64px;
  }
`

const H2SizeStyles = (theme: DefaultTheme) => `
  font-size: 32px;
  line-height: 110%;
  white-space: nowrap;

  ${theme.mediaQueries.sm} {
    font-size: 40px
  }
`

const sharedStyles = (props: HeadingProps) => `
  color: ${props.textColor ? props.textColor : '#ffffff'};
  background:  ${props.background ? props.background : 'linear-gradient(#7645d9 0%, #452a7a 100%)'};
  background-clip: text;
  -webkit-background-clip: text;
  ${
    props.fill
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
  textColor?: string
  background?: string
  fill?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HeadingUi = ({ textColor, background, fill, ...props }) => <Heading {...props} />

export const Heading1Text = styled(HeadingUi)<HeadingProps>`
  ${({ theme }) => H1SizeStyles(theme)}
  ${(props) => sharedStyles(props)}
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Heading2Text = styled(HeadingUi)<HeadingProps>`
  ${({ theme }) => H2SizeStyles(theme)}
  ${(props) => sharedStyles(props)}
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const VisuallyHiddenHeading1Text = styled(HeadingUi)`
  ${({ theme }) => H1SizeStyles(theme)}
  ${sharedVisiblyHiddenStyles}
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const VisuallyHiddenHeading2Text = styled(HeadingUi)`
  ${({ theme }) => H2SizeStyles(theme)}
  ${sharedVisiblyHiddenStyles}
`

export default Heading1Text
