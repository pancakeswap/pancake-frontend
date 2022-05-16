import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import throttle from 'lodash/throttle'

const FixedContainer = styled.div`
  position: fixed;
  right: 5%;
  bottom: 110px;
`

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 400,
      behavior: 'auto',
    })
  }, [])

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop
      if (scrolled > 700) {
        setVisible(true)
      } else if (scrolled <= 700) {
        setVisible(false)
      }
    }

    const throttledToggleVisible = throttle(toggleVisible, 200)

    window.addEventListener('scroll', throttledToggleVisible)

    return () => window.removeEventListener('scroll', throttledToggleVisible)
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
