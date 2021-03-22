import { Heading } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

const sharedH1Styles = (theme) => `
font-size: 48px;
line-height: 110%;

${theme.mediaQueries.sm} {
  font-size: 64px;
}
`

const sharedH2Styles = (theme) => `
font-size: 32px;
line-height: 110%;

${theme.mediaQueries.sm} {
  font-size: 40px
}
`

export const Heading1Text = styled(Heading)`
  ${({ theme }) => sharedH1Styles(theme)}
  color: #ffffff;
  background: -webkit-linear-gradient(#7645d9 0%, #452a7a 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 4px transparent;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
`

export const Heading2Text = styled(Heading)`
  ${({ theme }) => sharedH2Styles(theme)}
  color: #FFFFFF;
  background: -webkit-linear-gradient(#7645d9 0%, #452a7a 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 4px transparent;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
`

export const VisuallyHiddenHeading1Text = styled(Heading)`
  ${({ theme }) => sharedH1Styles(theme)}
  visibility: hidden;
  height: 0px;
`

export const VisuallyHiddenHeading2Text = styled(Heading)`
  ${({ theme }) => sharedH2Styles(theme)}
  visibility: hidden;
  height: 0px;
`

export default Heading1Text
