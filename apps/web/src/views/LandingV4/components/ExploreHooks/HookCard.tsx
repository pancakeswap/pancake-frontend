import { useTranslation } from '@pancakeswap/localization'
import { BoxProps, Card, Flex, FlexGap, Link, Tag, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { HooksType } from 'views/LandingV4/config/types'

const StyledBlogCard = styled(Link)`
  cursor: pointer;
  &:hover {
    text-decoration: initial;
  }
`

const StyledLineClamp = styled(Text)<{ line?: number }>`
  display: -webkit-box;
  white-space: initial;
  -webkit-line-clamp: ${({ line }) => line ?? 1};
  -webkit-box-orient: vertical;
`

interface HookCardProps extends BoxProps {
  hook: HooksType
}

export const HookCard: React.FC<React.PropsWithChildren<HookCardProps>> = ({ hook, ...props }) => {
  const { t } = useTranslation()
  return (
    <StyledBlogCard {...props} external href={hook.githubLink}>
      <Card>
        <Flex padding={['15px', '15px', '20px']} width="100%" flexDirection={['column']}>
          <Flex flexDirection="column">
            <StyledLineClamp ellipsis line={2} bold fontSize={['20px']} lineHeight={['24px']}>
              {hook.title}
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
              {hook.desc}
            </StyledLineClamp>
            <FlexGap gap="6px" flexWrap="wrap">
              {hook.tags.map((tag) => (
                <Tag key={tag} outline variant="secondary" scale="sm">
                  {t(tag)}
                </Tag>
              ))}
            </FlexGap>
            <Flex mt="20px" flexDirection={['column', 'row']}>
              <Text bold fontSize={['12px']} color="textSubtle">
                {`${t('Published on:')} ${hook.createDate}`}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </StyledBlogCard>
  )
}
