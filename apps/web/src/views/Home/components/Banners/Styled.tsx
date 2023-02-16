import { Flex, Heading } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledSubheading = styled(Heading)`
  background: -webkit-linear-gradient(#ffd800, #eb8c00);
  font-size: 20px;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.5);
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 24px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    -webkit-text-stroke: unset;
  }
  margin-bottom: 8px;
`

export const StyledHeading = styled(Heading)`
  color: #ffffff;
  background: -webkit-linear-gradient(#7645d9 0%, #452a7a 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 6px transparent;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-transform: uppercase;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 16px;
  }
`
export const Wrapper = styled.div`
  position: relative;
  border-radius: 32px;
  width: 100%;
  max-height: max-content;
  overflow: visible;
  ${({ theme }) => theme.mediaQueries.sm} {
    overflow: visible;
  }
`

export const Inner = styled(Flex)`
  position: relative;
  padding: 24px;
  flex-direction: row;
  justify-content: space-between;
  max-height: 192px;
  min-height: 181px;
  &::-webkit-scrollbar {
    display: none;
  }
`

export const LeftWrapper = styled(Flex)`
  z-index: 1;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 40px;
    padding-bottom: 40px;
  }
`

export const RightWrapper = styled.div`
  position: absolute;
  right: -17px;
  opacity: 0.9;
  transform: translate(0, -50%);
  top: 50%;

  img {
    height: 100%;
    width: 500px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    right: 24px;
    bottom: 0;
    transform: unset;
    opacity: 1;
    top: unset;
    height: 211px;
  }
`
