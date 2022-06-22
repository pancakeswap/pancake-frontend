import { Button, ButtonProps, ChevronDownIcon } from '@pancakeswap/uikit'
import 'atropos/css'
import Atropos from 'atropos/react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { ChildrenWrapper } from '../../../../components/PageSection'

export const BannerWrapper = styled(Atropos)`
  position: relative;
  width: 100%;
  height: calc(100px + 50px);
  margin: 33px auto 0px;
  box-sizing: border-box;
  overflow: visible;
  ${({ theme }) => theme.mediaQueries.md} {
    width: calc(479px + 150px);
    height: calc(167px + 50px);
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    width: calc(735px + 150px);
    height: calc(167px + 50px);
  }
`
export const BannerInner = styled.div`
  position: relative;
  margin: 0 auto;
  width: 320px;
  height: 100px;
  margin-top: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 479px;
    height: 162px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 735px;
    height: 162px;
  }
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
  background: radial-gradient(104.13% 227.47% at -4.12% -5.83%, #4bdde7 0%, #5b47b9 82.22%);
`

export const FullLayerImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`
export const StyledButton = styled(Button)<{ collapsed: boolean }>`
  position: absolute;
  right: 16px;
  top: 26px;
  padding: 14px;
  ${({ theme }) => theme.mediaQueries.md} {
    right: 32px;
    top: 57px;
  }
  svg {
    will-change: transform;
    transition: 0.3s transform ease-in-out;
    transform: rotateZ(${({ collapsed }) => (collapsed ? '0deg' : '-180deg')});
  }
`

export const StyledFooterButton = styled(Button)`
  svg {
    will-change: transform;
    transition: 0.3s transform ease-in-out;
    transform: rotateZ(${({ collapsed }) => (collapsed ? '0deg' : '-180deg')});
  }
`

export const ContentWrapper = styled.div`
  width: 324px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.md} {
    width: 479px;
    margin: 0px auto;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 735px;
  }
  ${ChildrenWrapper} {
    ${({ theme }) => theme.mediaQueries.xs},${({ theme }) => theme.mediaQueries.sm} {
      box-sizing: border-box;
      padding-left: 0;
      padding-right: 0;
    }
  }
`

export const BannerFooter = styled.div`
  width: 324px;
  height: 95px;
  border-radius: 0px 0px 32px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  background: ${({ theme }) => theme.card.background};
  ${({ theme }) => theme.mediaQueries.md} {
    width: 479px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 735px;
  }
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

export const FooterButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation()
  return (
    <StyledFooterButton {...props}>
      {t('Hide')}
      <ChevronDownIcon />
    </StyledFooterButton>
  )
}
