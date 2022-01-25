import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const FixedContainer = styled.div`
  position: fixed;
  right: 5%;
  bottom: 110px;
`

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()

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

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible)

    return () => window.removeEventListener('scroll', toggleVisible)
  }, [])

  return (
    <FixedContainer style={{ display: visible ? 'inline' : 'none' }}>
      <Button variant="subtle" endIcon={<ChevronUpIcon color="invertedContrast" />} onClick={scrollToTop}>
        {t('To Top')}
      </Button>
    </FixedContainer>
  )
}

export default ScrollToTopButton
