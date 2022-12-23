import styled, { css } from 'styled-components'
import { memo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'

function createCSS(isMobile?: boolean) {
  let styles = ''
  const dotCounts = isMobile ? 60 : 200
  for (let i = 0; i < dotCounts; i += 1) {
    const randomX = Math.floor(Math.random() * 1000000) * 0.0001 // vw
    const randomOffset = Math.ceil(Math.random() * 1000000) * (Math.round(Math.random()) ? 1 : -1) * 0.0001 // vw
    const randomXEnd = randomX + randomOffset // vw
    const randomXEndYoyo = randomX + randomOffset / 2
    const RandomYoyoTime = (Math.random() * 50000 + 30000) / 100000
    const randomYoyoY = RandomYoyoTime * 100 // vh
    const randomScale = Math.random() * 10000 * 0.0001 * (isMobile ? 0.8 : 1)
    const fallDuration = Math.random() * 20 + 20 // s
    const fallDelay = Math.random() * 30 * -1 // s
    const opacity = Math.random() * 10000 * 0.0001
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

const SnowItems = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  left: -10px;
  background: white;
  border-radius: 50%;
`
const SnowWrapper = styled.div<{ isMobile?: boolean }>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 6;
  pointer-events: none;
  ${({ isMobile }) => {
    return createCSS(isMobile)
  }}
  overflow: hidden;
  filter: drop-shadow(0 0 10px white);
`
const snowNodes = Array.from(Array(200).keys())
const snowNodesMobile = Array.from(Array(200).keys())

const SnowEffect: React.FC = memo(() => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <SnowWrapper isMobile={isMobile}>
      {(isMobile ? snowNodesMobile : snowNodes).map((d) => (
        <SnowItems key={`snowEffectItems${d}`} />
      ))}
    </SnowWrapper>
  )
})

export default SnowEffect
