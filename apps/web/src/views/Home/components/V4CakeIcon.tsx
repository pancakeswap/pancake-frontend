import { Image, StyledLink } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import throttle from 'lodash/throttle'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import NextLink from 'next/link'

const Container = styled(StyledLink)<{ hasScrollToTopButton: boolean }>`
  position: fixed;
  right: 18px;
  transition: 0.2s;
  width: 48px;
  height: 48px;
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
    <NextLink href="/v4">
      <Container hasScrollToTopButton={hasScrollToTopButton}>
        <Image src={`${ASSET_CDN}/web/v4-landing/v4-icon.png`} alt="introducing-v4-icon" width={48} height={48} />
      </Container>
    </NextLink>
  )
}
