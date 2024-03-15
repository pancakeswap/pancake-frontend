import { useTranslation } from '@pancakeswap/localization'
import { BoxProps, Button, Card, Flex, FlexGap, Link, OpenNewIcon, Tag, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'
import { useSelectorConfig } from 'views/LandingV4/config/filterOptions'
import { HooksType } from 'views/LandingV4/config/types'

const StyledBlogCard = styled(Link)`
  display: flex;
  align-self: flex-start;

  .title {
    > div {
      transition: 0.3s;
    }

    svg {
      animation-delay: 0.3s;
      transition: 0.3s;
    }
  }

  &:hover {
    text-decoration: initial;

    .title {
      > div {
        color: ${({ theme }) => theme.colors.primary};
      }

      svg {
        opacity: 1;
      }
    }
  }
`

const StyledLineClamp = styled(Text)<{ line?: number }>`
  display: -webkit-box;
  white-space: initial;
  -webkit-line-clamp: ${({ line }) => line ?? 1};
  -webkit-box-orient: vertical;
`

const StyledTag = styled(Tag)`
  > svg {
    margin-right: 4px;
    fill: ${({ theme }) => theme.colors.secondary};
  }
`

interface HookCardProps extends BoxProps {
  hook: HooksType
}

export const HookCard: React.FC<React.PropsWithChildren<HookCardProps>> = ({ hook, ...props }) => {
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)
  const selectorConfig = useSelectorConfig()

  return (
    <StyledBlogCard {...props} external href={hook.githubLink}>
      <Card>
        <Flex padding={['15px', '15px', '20px']} width="100%" flexDirection={['column']}>
          <Flex flexDirection="column">
            <Flex className="title">
              <StyledLineClamp ellipsis line={2} bold fontSize={['20px']} lineHeight={['24px']}>
                {hook.title}
              </StyledLineClamp>
              <OpenNewIcon width={24} height={24} opacity="0" marginLeft="4px" color="primary" />
            </Flex>
            <StyledLineClamp
              bold
              ellipsis
              line={showMore ? 100 : 3}
              color="textSubtle"
              m={['8px 0']}
              fontSize={['12px']}
              lineHeight={['18px']}
            >
              {hook.desc}
            </StyledLineClamp>
            {!showMore && (
              <Button
                width="fit-content"
                pl="0"
                scale="xs"
                variant="text"
                onClick={(e) => {
                  e.preventDefault()
                  setShowMore(true)
                }}
              >
                {t('Show More')}
              </Button>
            )}
            <FlexGap mt="20px" gap="6px" flexWrap="wrap">
              {hook.tags.map((tag, index) => {
                const icon = selectorConfig.find((i) => i.value === hook.tagsValue[index])?.icon ?? null
                return (
                  <StyledTag key={tag} outline variant="secondary" scale="sm" startIcon={icon}>
                    {t(tag)}
                  </StyledTag>
                )
              })}
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
