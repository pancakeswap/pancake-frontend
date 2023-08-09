import { ReactNode } from 'react'
import { Box, ICakeIcon, ChainLogo, LogoRoundIcon } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import styled from 'styled-components'

type Props = {
  iconTop: ReactNode
  iconBottom: ReactNode
}

const DoubleContainer = styled(Box)`
  position: relative;
`

const IconBottomContainer = styled(Box)`
  position: relative;
  z-index: 1;
`

const IconTopContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
`

export function DoubleIcon({ iconTop, iconBottom }: Props) {
  return (
    <DoubleContainer>
      <IconBottomContainer>{iconBottom}</IconBottomContainer>
      <IconTopContainer>{iconTop}</IconTopContainer>
    </DoubleContainer>
  )
}

type IfoIconProps = {
  chainId?: ChainId
}

export function IfoIcon({ chainId }: IfoIconProps) {
  return (
    <DoubleIcon
      iconBottom={<ICakeIcon width="24px" height="24px" />}
      iconTop={<ChainLogo chainId={chainId} width={16} height={16} />}
    />
  )
}

export function ICakeLogo() {
  return (
    <DoubleIcon
      iconBottom={<LogoRoundIcon width="32px" height="32px" />}
      iconTop={<ICakeIcon width="24px" height="24px" />}
    />
  )
}
