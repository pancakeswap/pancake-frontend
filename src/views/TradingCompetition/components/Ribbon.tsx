import React from 'react'
import styled from 'styled-components'
import { ReactComponent as RibbonDownMid } from '../svgs/ribbon-down-mid.svg'
import { ReactComponent as RibbonUpMid } from '../svgs/ribbon-up-mid.svg'
import { ReactComponent as RibbonUpSide } from '../svgs/ribbon-up-side.svg'
import { ReactComponent as RibbonDownSide } from '../svgs/ribbon-down-side.svg'

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`

const RibbonDownSideRight = styled(RibbonDownSide)`
  transform: scaleX(-1);
`

export const RibbonDown = () => {
  return (
    <Wrapper>
      <RibbonDownSide />
      <RibbonDownMid />
      <RibbonDownSideRight />
    </Wrapper>
  )
}

export default RibbonDown
