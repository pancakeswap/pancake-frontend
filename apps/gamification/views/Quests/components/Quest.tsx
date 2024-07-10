import { useTranslation } from '@pancakeswap/localization'
import { Box, BoxProps, CalenderIcon, Card, Flex, InfoIcon, LogoRoundIcon, Tag, Text } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { styled } from 'styled-components'

const Detail = styled(Flex)`
  padding: 0 5px;
  border-right: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

const DetailContainer = styled(Flex)`
  margin-top: 16px;

  ${Detail} {
    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      border: 0;
    }
  }
`

interface QuestProps extends BoxProps {
  isDraft?: boolean
  showStatus?: boolean
  hideClick?: boolean
}

export const Quest: React.FC<QuestProps> = ({ isDraft, showStatus, hideClick, ...props }) => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleClick = () => {
    const url = '/quests/1'
    router.push(url)
  }

  return (
    <Box {...props} style={{ cursor: hideClick ? 'initial' : 'pointer' }} onClick={hideClick ? undefined : handleClick}>
      <Card>
        <Flex flexDirection="column" padding="16px">
          <Flex mb="16px">
            {isDraft && (
              <Tag variant="textDisabled" mr="auto">
                {t('Drafted')}
              </Tag>
            )}
            {showStatus && (
              <Tag variant="textDisabled" outline mr="auto">
                <Text bold color="textSubtle">
                  {t('Upcoming')}
                </Text>
                {/* <Text bold color="success">
                    {t('Completed')}
                  </Text>
                  <Text bold color="secondary">
                    {t('Ongoing')}
                  </Text>
                  <Text bold color="textDisabled">
                    {t('Finished')}
                  </Text> */}
              </Tag>
            )}
            <Flex>
              <CalenderIcon color="textSubtle" mr="8px" />
              <Text style={{ alignSelf: 'center' }} color="textSubtle" fontSize={['14px']}>
                Apr 10 - Apr 21
              </Text>
            </Flex>
          </Flex>
          <Text ellipsis bold fontSize={['20px']} lineHeight={['24px']}>
            Swap and Share $10,000 on Ethereum PancakeSwap
          </Text>
          <Card isActive style={{ width: 'fit-content', padding: '2px', marginTop: '16px' }}>
            <Flex padding="8px">
              <LogoRoundIcon width={24} height={24} />
              <Flex ml="8px">
                <Text bold fontSize="20px" lineHeight="24px">
                  100
                </Text>
                <Text bold fontSize="14px" style={{ alignSelf: 'flex-end' }} ml="2px">
                  USDT
                </Text>
              </Flex>
            </Flex>
          </Card>
          <DetailContainer>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                6 Tasks
              </Text>
            </Detail>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                50 rewards
              </Text>
              <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
            </Detail>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                Lucky Draw
              </Text>
              <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
            </Detail>
          </DetailContainer>
        </Flex>
      </Card>
    </Box>
  )
}
