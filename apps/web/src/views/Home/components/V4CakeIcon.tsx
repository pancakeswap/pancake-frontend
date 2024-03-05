import { Link } from '@pancakeswap/uikit'
import throttle from 'lodash/throttle'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'

const Container = styled(Link)<{ hasScrollToTopButton: boolean }>`
  position: fixed;
  right: 18px;
  transition: 0.2s;
  bottom: ${({ hasScrollToTopButton }) =>
    hasScrollToTopButton ? 'calc(170px + env(safe-area-inset-bottom))' : 'calc(82px + env(safe-area-inset-bottom))'};
`

export const V4CakeIcon = () => {
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
    <Container hasScrollToTopButton={hasScrollToTopButton} href="/introducing-v4">
      <Image src="/images/v4-landing/v4-icon.png" alt="introducing-v4-icon" width={48} height={58} />
    </Container>
  )
}
