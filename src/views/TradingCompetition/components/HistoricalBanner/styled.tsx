import { Button, ButtonProps, ChevronDownIcon } from '@pancakeswap/uikit'
import 'atropos/css'
import Atropos from 'atropos/react'
import styled from 'styled-components'

export const BannerWrapper = styled(Atropos)`
  position: relative;
  width: 100%;
  height: 130px;
  margin: 33px auto 0px;
  box-sizing: border-box;
  overflow: visible;
  ${({ theme }) => theme.mediaQueries.md} {
    width: calc(735px + 150px);
    height: calc(167px + 50px);
  }
`
export const BannerInner = styled.div`
  position: relative;
  width: 735px;
  margin-left: 75px;
  height: 162px;
  margin-top: 25px;
`

export const BannerBg = styled.div<{ collapsed?: boolean }>`
  width: 100%;
  height: 100%;
  background: gray;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: ${({ collapsed }) => (collapsed ? '32px' : '32px 32px 0px 0px')};
  transition: 0.3s border-radius ease-in-out;
  will-change: border-radius;
  ${({ theme }) => theme.mediaQueries.md} {
    background: radial-gradient(104.13% 227.47% at -4.12% -5.83%, #4bdde7 0%, #5b47b9 82.22%)
      /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
    height: 162px;
  }
`

export const FullLayerImage = styled.img`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`
export const StyledButton = styled(Button)<{ collapsed: boolean }>`
  position: absolute;
  right: 32px;
  top: 57px;
  padding-left: 14px;
  padding-right: 14px;
  svg {
    will-change: transform;
    transition: 0.3s transform ease-in-out;
    transform: rotateZ(${({ collapsed }) => (collapsed ? '0deg' : '-180deg')});
  }
`
export const ContentWrapper = styled.div`
  width: 735px;
  margin: 0px auto;
`

export const BannerFooter = styled.div`
  width: 735px;
  height: 95px;
  border-radius: 0px 0px 32px 32px;
  background: ${({ theme }) => theme.card.background};
`

interface CollapseButtonProps extends ButtonProps {
  collapsed: boolean
}

export const CollapseButton: React.FC<CollapseButtonProps> = (props) => {
  return (
    <StyledButton {...props}>
      <ChevronDownIcon />
    </StyledButton>
  )
}
