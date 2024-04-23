import jazzicon from '@metamask/jazzicon'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useLayoutEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

const TextBlock = styled(Flex)`
  position: absolute;
  top: calc(50% - 1px);
  right: 12px;
  z-index: 2;
  padding: 2px 0;
  transform: translateY(-50%);
  background-color: ${({ theme }) => theme.colors.backgroundAlt};

  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: -28px;
    width: 28px;
    height: 100%;
    background: ${({ theme }) =>
      `linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, ${theme.colors.backgroundAlt} 100%)`};
  }
`
const AssetSetContainer = styled(Box)`
  position: relative;
  z-index: 1;
  height: 24px;
  overflow: hidden;
`

const TOTAL = 10
const SIZE = 22

function createCSS() {
  let styles = ''
  for (let i = 0; i < TOTAL; i += 1) {
    const width = SIZE * TOTAL
    const maxCount = 10
    const radius = SIZE / 1.8
    const spacer = (maxCount / TOTAL - 1) * (radius * 1.8)
    const leftOffsetFor = ((width - radius * 1.8 + spacer) / (maxCount - 1)) * i

    styles += `
      > :nth-child(${i}) {
        position: absolute;
        left: ${leftOffsetFor}px;
        z-index: ${i - TOTAL};
      }
    `
  }

  return css`
    ${styles}
  `
}

const JazzIcon = styled(Box)`
  ${createCSS()}
`

export const Questers = () => {
  const { t } = useTranslation()
  const iconRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const { current } = iconRef

    for (let i = 0; i < TOTAL; i++) {
      const icon = jazzicon(SIZE, i)
      current?.appendChild(icon)
    }
  }, [])

  return (
    <Flex position="relative">
      <Flex padding="12px">
        <AssetSetContainer>
          <JazzIcon className="Test" ref={iconRef} />
        </AssetSetContainer>

        <TextBlock m="auto">
          <Text bold>{t('%total%+ questers', { total: TOTAL })}</Text>
        </TextBlock>
      </Flex>
    </Flex>
  )
}
