import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useCallback } from 'react'
import styled from 'styled-components'
import { useGetAllUserIdsByQuestId } from 'views/Quest/hooks/useGetAllUserIdsByQuestId'

const Container = styled(Flex)`
  position: relative;
`

const AssetSetContainer = styled(Box)`
  position: relative;
  z-index: 1;
  height: 30px;
  width: 90%;
  max-width: 100%;
`

const BunnyNftIcon = styled(Box)<{ $width: number; $height: number }>`
  height: ${({ $height }) => `${$height}px`};
  width: ${({ $width }) => `${$width}px`};
  border-radius: 50%;
  background-size: contain;
  border: solid 2.4px white;
  background-image: url('https://static-nft.pancakeswap.com/mainnet/0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07/the-bunny-1000.png');
`

export const Questers = ({
  questId,
  size,
  fontSize,
  bold,
}: {
  questId: string
  size: number
  fontSize: number
  bold?: boolean
}) => {
  const { t } = useTranslation()
  const { allUserIdsByQuestId } = useGetAllUserIdsByQuestId(questId)

  const totalLength = allUserIdsByQuestId.users.length

  const leftOffsetFor = useCallback((i: number): number => {
    const space = 16
    return space * i
  }, [])

  if (totalLength === 0) {
    return null
  }

  return (
    <Container width="100%" flexWrap="nowrap" overflow="hidden">
      <Text
        style={{ alignSelf: 'center' }}
        width="100%"
        maxWidth="fit-content"
        fontSize={fontSize}
        bold={bold}
        mr="8px"
      >
        {t('%total%+ questers', { total: totalLength })}
      </Text>

      <AssetSetContainer>
        {allUserIdsByQuestId.users.map((user, index) => (
          <Box
            key={user}
            width={size}
            height={size}
            position="absolute"
            style={{
              left: `${leftOffsetFor(index)}px`,
              zIndex: `${index - totalLength}`,
            }}
          >
            <BunnyNftIcon $width={size} $height={size} />
          </Box>
        ))}
      </AssetSetContainer>
    </Container>
  )
}
