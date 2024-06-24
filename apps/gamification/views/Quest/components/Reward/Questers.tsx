import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useCallback, useMemo } from 'react'
import Jazzicon from 'react-jazzicon'
import styled from 'styled-components'
import { useGetAllUserIdsByQuestId } from 'views/Quest/hooks/useGetAllUserIdsByQuestId'

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

export const Questers = ({ questId }: { questId: string }) => {
  const { t } = useTranslation()
  const { allUserIdsByQuestId } = useGetAllUserIdsByQuestId(questId)

  const totalLength = allUserIdsByQuestId.users.length
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

  if (totalLength === 0) {
    return null
  }

  return (
    <Flex position="relative" overflow="hidden">
      <Flex padding="12px">
        <AssetSetContainer>
          {allUserIdsByQuestId.users.map((user, index) => (
            <Box
              key={user}
              width={SIZE}
              height={SIZE}
              position="absolute"
              style={{
                left: `${leftOffsetFor(index)}px`,
                zIndex: `${index - totalLength}`,
              }}
            >
              <Jazzicon seed={index} diameter={SIZE} />
            </Box>
          ))}
        </AssetSetContainer>

        <TextBlock m="auto">
          <Text bold>{t('%total%+ questers', { total: totalLength })}</Text>
        </TextBlock>
      </Flex>
    </Flex>
  )
}
