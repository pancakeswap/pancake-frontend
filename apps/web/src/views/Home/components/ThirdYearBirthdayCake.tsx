import { styled } from 'styled-components'
import { useState, useEffect } from 'react'
import { Link } from '@pancakeswap/uikit'
import throttle from 'lodash/throttle'
import Image from 'next/image'

const Container = styled(Link)<{ hasScrollToTopButton: boolean }>`
  position: fixed;
  z-index: 100;
  right: 5%;
  transition: 0.2s;
  bottom: ${({ hasScrollToTopButton }) =>
    hasScrollToTopButton ? 'calc(146px + env(safe-area-inset-bottom))' : 'calc(82px + env(safe-area-inset-bottom))'};
`

const ThirdYearBirthdayCake = () => {
  const [hasScrollToTopButton, setHasScrollToTopButton] = useState(false)

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop
      if (scrolled > 500) {
        setHasScrollToTopButton(true)
      } else if (scrolled <= 500) {
        setHasScrollToTopButton(false)
      }
    }

    const throttledToggleVisible = throttle(toggleVisible, 200)

    window.addEventListener('scroll', throttledToggleVisible)

    return () => window.removeEventListener('scroll', throttledToggleVisible)
  }, [])

  return (
    <Container
      external
      hasScrollToTopButton={hasScrollToTopButton}
      href="https://blog.pancakeswap.finance/?category=PancakeSwap%20Birthday"
    >
      <Image src="/images/third-year-cake.png" alt="third-year-cake-icon" width={48} height={48} />
    </Container>
  )
}

export default ThirdYearBirthdayCake
