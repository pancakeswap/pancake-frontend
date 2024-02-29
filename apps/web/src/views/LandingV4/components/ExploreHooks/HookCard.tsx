import { Box, BoxProps, Card, Flex, HooksIcon, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const IconContainer = styled(Box)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: solid 4px rgba(118, 69, 217, 0.2);

  display: flex;
  justify-content: center;
`

const StyledBlogCard = styled(Box)`
  cursor: pointer;
`

const StyledLineClamp = styled(Text)<{ line?: number }>`
  display: -webkit-box;
  white-space: initial;
  -webkit-line-clamp: ${({ line }) => line ?? 1};
  -webkit-box-orient: vertical;
`

interface HookCardProps extends BoxProps {}

export const HookCard: React.FC<React.PropsWithChildren<HookCardProps>> = ({ ...props }) => {
  return (
    <StyledBlogCard {...props}>
      <Card>
        <Flex padding={['15px', '15px', '20px']} width="100%" flexDirection={['column']}>
          <IconContainer mb="20px">
            <HooksIcon width={48} height={48} color="secondary" />
          </IconContainer>
          <Flex flexDirection="column">
            <StyledLineClamp ellipsis line={2} bold fontSize={['20px']} lineHeight={['24px']}>
              Hook Name
            </StyledLineClamp>
            <StyledLineClamp
              bold
              ellipsis
              line={3}
              color="textSubtle"
              m={['8px 0 20px 0']}
              fontSize={['12px']}
              lineHeight={['18px']}
            >
              Prepare for an extraordinary celestial display as a surprise meteor shower transforms the night sky into a
              breathtaking cosmic masterpiece
            </StyledLineClamp>
            <Flex mt="auto" flexDirection={['column', 'row']}>
              <Text mr="auto" bold fontSize={['12px']} color="textSubtle">
                From: GIthub Nickname
              </Text>
              <Text bold fontSize={['12px']} color="textSubtle">
                2012-12-23
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </StyledBlogCard>
  )
}
