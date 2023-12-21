import { useMatchBreakpoints } from '@pancakeswap/uikit'
import Image from 'next/image'
import styled, { css } from 'styled-components'

function createCSS(isMobile?: boolean) {
  let styles = ''
  const dotCounts = 60
  for (let i = 0; i < dotCounts; i += 1) {
    const randomX = Math.floor(Math.random() * 1000000) * 0.0001 // vw
    const randomOffset = Math.ceil(Math.random() * 1000000) * (Math.round(Math.random()) ? 1 : -1) * 0.0001 // vw
    const randomXEnd = randomX + randomOffset // vw
    const randomXEndYoyo = randomX + randomOffset / 2
    const RandomYoyoTime = (Math.random() * 50000 + 30000) / 100000
    const randomYoyoY = RandomYoyoTime * 100 // vh
    const randomScale = Math.random() * 10000 * 0.0002 * (isMobile ? 0.8 : 1)
    const fallDuration = Math.random() * 20 + 20 // s
    const fallDelay = Math.random() * 30 * -1 // s
    const opacity = Math.random() * 10000 * 0.0005
    const percentage = RandomYoyoTime * 100
    styles += `
      > :nth-child(${i}) {
        opacity: ${opacity};
        transform: translate(${randomX}vw, -10px) scale(${randomScale});
        animation: fall${i} ${fallDuration}s ${fallDelay}s linear infinite;
      }
      @keyframes fall${i} {
        ${percentage}% {
          transform: translate(${randomXEnd}vw, ${randomYoyoY}vh) scale(${randomScale});
        }
        to {
          transform: translate(${randomXEndYoyo}vw, 100vh) scale(${randomScale});
        }
      }
    `
  }

  return css`
    ${styles}
  `
}

const SnowWrapper = styled.div<{ isMobile?: boolean }>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 10000;
  pointer-events: none;
  overflow: hidden;
  filter: drop-shadow(0 0 10px white);

  ${({ isMobile }) => {
    return createCSS(isMobile)
  }}
`

const ImagesList = [
  'flakes-1.png',
  'flakes-2.png',
  'flakes-3.png',
  'flakes-4.png',
  'flakes-5.png',
  'flakes-6.png',
  'flakes-7.png',
  'xmas-1.png',
  'xmas-2.png',
  'xmas-3.png',
]

export const XmasEffect = () => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <SnowWrapper isMobile={isMobile}>
      {ImagesList.map((d) => (
        <Image key={`snowEffectItems-${d}`} src={`/images/x-mas-2023/${d}`} width={20} height={20} alt="" />
      ))}
    </SnowWrapper>
  )
}
