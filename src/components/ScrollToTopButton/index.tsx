import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon } from '@pancakeswap/uikit'

const FixedContainer = styled.div`
  position: fixed;
  right: 5%;
  bottom: 60px;
`

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop
    if (scrolled > 700) {
      setVisible(true)
    } else if (scrolled <= 700) {
      setVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 400,
      behavior: 'auto',
    })
  }

  window.addEventListener('scroll', toggleVisible)

  return (
    <FixedContainer style={{ display: visible ? 'inline' : 'none' }}>
      <Button variant="subtle" endIcon={<ChevronUpIcon color="invertedContrast" />} onClick={scrollToTop}>
        Top
      </Button>
    </FixedContainer>
  )
}

export default ScrollToTopButton
