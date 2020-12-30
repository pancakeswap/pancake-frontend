import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouteMatch } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap-libs/uikit'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 39px;
`

const IfoTabButtons = () => {
  const match = useRouteMatch('/ifo/past-ifos')
  const [index, setIndex] = useState(match ? 1 : 0)
  const handleClick = (newIndex) => setIndex(newIndex)

  return (
    <Wrapper>
      <ButtonMenu activeIndex={index} onClick={handleClick} size="sm">
        <ButtonMenuItem as="a" href="/ifo">
          Next IFO
        </ButtonMenuItem>
        <ButtonMenuItem as="a" href="/ifo/past-ifos">
          Past IFOs
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

export default IfoTabButtons
