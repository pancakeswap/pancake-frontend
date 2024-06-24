import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { CAKE, getTokensByChain } from '@pancakeswap/tokens'
import { Box, BoxProps, CalenderIcon, Card, Flex, InfoIcon, Tag, Text } from '@pancakeswap/uikit'
import { TokenWithChain } from 'components/TokenWithChain'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { convertTimestampToDate } from 'views/DashboardQuestEdit/utils/combineDateAndTime'

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
  showStatus?: boolean
  hideClick?: boolean
  quest: SingleQuestData
}

export const Quest: React.FC<QuestProps> = ({ quest, showStatus, hideClick, ...props }) => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleClick = () => {
    router.push(`/quests/${quest.id}`)
  }

  const currency = useMemo((): Currency => {
    const reward = quest?.reward
    const list = getTokensByChain(reward?.currency?.network)
    const findToken = list.find((i) => i.address.toLowerCase() === reward?.currency?.address?.toLowerCase())
    return findToken || (CAKE as any)?.[ChainId.BSC]
  }, [quest])

  return (
    <Box {...props} style={{ cursor: hideClick ? 'initial' : 'pointer' }} onClick={hideClick ? undefined : handleClick}>
      <Card>
        <Flex flexDirection="column" padding="16px">
          <Flex mb="16px">
            {showStatus && (
              <Tag variant="textDisabled" outline mr="auto">
                {quest.completionStatus === CompletionStatus.DRAFTED && (
                  <Tag variant="textDisabled">{t('Drafted')}</Tag>
                )}
                {quest.completionStatus === CompletionStatus.ONGOING && (
                  <Text bold color="secondary">
                    {t('Ongoing')}
                  </Text>
                )}
                {quest.completionStatus === CompletionStatus.FINISHED && (
                  <Text bold color="textDisabled">
                    {t('Finished')}
                  </Text>
                )}
              </Tag>
            )}
            <Flex>
              <CalenderIcon color="textSubtle" mr="8px" />
              {quest?.startDateTime > 0 && quest?.endDateTime > 0 ? (
                <Text style={{ alignSelf: 'center' }} color="textSubtle" fontSize={['14px']}>
                  {`${convertTimestampToDate(quest.startDateTime, 'YYYY/MM/DD')} - ${convertTimestampToDate(
                    quest.endDateTime,
                    'YYYY/MM/DD',
                  )}`}
                </Text>
              ) : (
                <Text>-</Text>
              )}
            </Flex>
          </Flex>
          <Text ellipsis bold fontSize={['20px']} lineHeight={['24px']}>
            {quest?.title}
          </Text>
          <Card isActive style={{ width: 'fit-content', padding: '2px', marginTop: '16px' }}>
            <Flex padding="8px">
              {quest?.reward ? (
                <>
                  <TokenWithChain currency={currency} width={20} height={20} />
                  <Flex ml="8px">
                    <Text bold fontSize="20px" lineHeight="24px">
                      {quest.reward.totalRewardAmount.toFixed(0)}
                    </Text>
                    <Text bold fontSize="14px" style={{ alignSelf: 'flex-end' }} ml="2px">
                      {currency.symbol}
                    </Text>
                  </Flex>
                </>
              ) : (
                <Text>-</Text>
              )}
            </Flex>
          </Card>
          <DetailContainer>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                {t('%total% Tasks', { total: quest?.task?.length ?? 0 })}
              </Text>
            </Detail>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                {t('%total% rewards', { total: quest?.reward?.totalRewardAmount?.toFixed(2) ?? 0 })}
              </Text>
              <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
            </Detail>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                {t('Lucky Draw')}
              </Text>
              <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
            </Detail>
          </DetailContainer>
        </Flex>
      </Card>
    </Box>
  )
}
