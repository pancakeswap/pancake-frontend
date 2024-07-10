import { Token } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { Box } from '@pancakeswap/uikit'
import { TokenImage } from 'components/TokenImage'
import { useCallback, useMemo } from 'react'
import { styled } from 'styled-components'

const AssetSetContainer = styled(Box)`
  position: relative;
  z-index: 1;
`

const Circle = styled(Box)`
  position: absolute;
  border-radius: 50%;
  border: solid 2px white;
`

interface AssetSetProps {
  size?: number
}

export const AssetSet: React.FC<React.PropsWithChildren<AssetSetProps>> = ({ size }) => {
  const imageSize = size || 16

  const tokens: Array<Token> = [
    bscTokens.cake,
    bscTokens.alpa,
    bscTokens.ada,
    bscTokens.aioz,
    bscTokens.csix,
    bscTokens.chat,
  ]
  const totalLength = tokens.length

  const width = useMemo(() => imageSize * totalLength, [totalLength, imageSize])

  const leftOffsetFor = useCallback(
    (i: number): number => {
      const maxCount = 10
      const radius = imageSize / 1.8
      const spacer = (maxCount / totalLength - 1) * (radius * 1.8)
      return ((width - radius * 1.8 + spacer) / (maxCount - 1)) * i
    },
    [totalLength, imageSize, width],
  )

  return (
    <AssetSetContainer style={{ width: `${width - (imageSize + 5)}px`, height: `${imageSize}px` }}>
      {tokens.map((token, i) => (
        <Circle
          key={token.address}
          width={imageSize}
          height={imageSize}
          style={{ left: `${leftOffsetFor(i)}px`, zIndex: `${i - totalLength}` }}
        >
          <TokenImage token={token} width={imageSize} height={imageSize} />
        </Circle>
      ))}
    </AssetSetContainer>
  )
}
