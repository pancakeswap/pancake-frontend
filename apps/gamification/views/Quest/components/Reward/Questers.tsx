import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useCallback, useMemo } from 'react'
import Jazzicon from 'react-jazzicon'
import styled from 'styled-components'

const TextBlock = styled(Flex)`
  position: absolute;
  top: calc(50% - 1px);
  right: 0px;
  z-index: 2;
  padding: 2px 12px 2px 0;
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
  height: 26px;
`

const TOTAL = 20
const SIZE = 26

export const Questers = () => {
  const { t } = useTranslation()

  const total = useMemo(() => {
    const array = []
    for (let i = 0; i < TOTAL; i++) {
      array.push(i)
    }
    return array
  }, [])

  const totalLength = total.length
  const width = useMemo(() => SIZE * totalLength, [totalLength])

  const leftOffsetFor = useCallback(
    (i: number): number => {
      const maxCount = TOTAL / 0.6
      const radius = SIZE / 1.8
      const spacer = (maxCount / totalLength - 1) * (radius * 1.8)
      return ((width - radius * 1.8 + spacer) / (maxCount - 1)) * i
    },
    [totalLength, width],
  )

  return (
    <Flex position="relative" overflow="hidden">
      <Flex padding="12px">
        <AssetSetContainer>
          {total.map((i) => (
            <Box
              key={i}
              width={SIZE}
              height={SIZE}
              position="absolute"
              style={{
                left: `${leftOffsetFor(i)}px`,
                zIndex: `${i - totalLength}`,
              }}
            >
              <Jazzicon seed={i} diameter={SIZE} />
            </Box>
          ))}
        </AssetSetContainer>

        <TextBlock m="auto">
          <Text bold>{t('%total%+ questers', { total: TOTAL })}</Text>
        </TextBlock>
      </Flex>
    </Flex>
  )
}
