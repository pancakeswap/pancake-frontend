import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useCallback } from 'react'
import Jazzicon from 'react-jazzicon'
import styled from 'styled-components'
import { useGetAllUserIdsByQuestId } from 'views/Quest/hooks/useGetAllUserIdsByQuestId'

const Container = styled(Flex)`
  position: relative;
`

const AssetSetContainer = styled(Box)`
  position: relative;
  z-index: 1;
  height: 26px;
  width: 90%;
  max-width: 100%;

  &:before {
    content: '';
    position: absolute;
    top: -6px;
    right: -10px;
    width: 58px;
    height: 100%;
    z-index: 2;
    background: ${({ theme }) =>
      `linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, ${theme.colors.backgroundAlt} 100%)`};
  }
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
      <Text width="100%" maxWidth="fit-content" fontSize={fontSize} bold={bold} mr="8px">
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
            <Jazzicon seed={index} diameter={size} />
          </Box>
        ))}
      </AssetSetContainer>
    </Container>
  )
}
