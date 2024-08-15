import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { Box, BoxProps, CalenderIcon, Card, Flex, InfoIcon, Tag, Text, useTooltip } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { TokenWithChain } from 'components/TokenWithChain'
import { useFindTokens } from 'hooks/useFindTokens'
import { useRouter } from 'next/router'
import { styled } from 'styled-components'
import { Address } from 'viem'
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
  customRedirectUrl?: string
}

export const Quest: React.FC<QuestProps> = ({ quest, showStatus, hideClick, customRedirectUrl, ...props }) => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleClick = () => {
    router.push(customRedirectUrl || `/quests/${quest.id}`)
  }

  const {
    targetRef: rewardTargetRef,
    tooltip: rewardTooltip,
    tooltipVisible: rewardTooltipVisible,
  } = useTooltip(
    t('When the Quest time expires, the users who are eligible to get the reward will be randomly drawn'),
    {
      placement: 'top',
    },
  )

  const {
    targetRef: rewardTypeTargetRef,
    tooltip: rewardTypeTooltip,
    tooltipVisible: rewardTypeTooltipVisible,
  } = useTooltip(
    t(
      'Rewards will be distributed by randomly selecting a specified number of users who have completed the tasks. Only those who have finished the required tasks will be eligible for the lucky draw.',
    ),
    {
      placement: 'top',
    },
  )

  const currency = useFindTokens(
    quest?.reward?.currency?.network as ChainId,
    quest?.reward?.currency?.address as Address,
  )

  return (
    <Box {...props} style={{ cursor: hideClick ? 'initial' : 'pointer' }} onClick={hideClick ? undefined : handleClick}>
      <Card>
        <Flex flexDirection="column" padding="16px">
          <Flex mb="16px">
            {showStatus && (
              <Box mr="auto">
                {quest?.completionStatus === CompletionStatus.DRAFTED && (
                  <Tag outline variant="textDisabled">
                    {t('Drafted')}
                  </Tag>
                )}
                {quest?.completionStatus === CompletionStatus.SCHEDULED && (
                  <Tag outline variant="secondary">
                    {t('Schedule')}
                  </Tag>
                )}
                {quest?.completionStatus === CompletionStatus.ONGOING && (
                  <Text bold color="secondary">
                    {t('Ongoing')}
                  </Text>
                )}
                {quest?.completionStatus === CompletionStatus.FINISHED && (
                  <Text bold color="textDisabled">
                    {t('Finished')}
                  </Text>
                )}
              </Box>
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
          {quest?.reward?.currency && (
            <Card isActive style={{ width: 'fit-content', padding: '2px', marginTop: '16px' }}>
              <Flex padding="8px">
                <TokenWithChain currency={currency} width={24} height={24} />
                <Flex ml="8px">
                  <Text bold fontSize="20px" lineHeight="24px">
                    {getFullDisplayBalance(new BigNumber(quest?.reward?.totalRewardAmount ?? 0), currency.decimals, 2)}
                  </Text>
                  <Text bold fontSize="14px" style={{ alignSelf: 'flex-end' }} ml="2px">
                    {currency.symbol}
                  </Text>
                </Flex>
                <></>
              </Flex>
            </Card>
          )}
          <DetailContainer>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                {t('%total% Tasks', { total: quest?.tasks?.length ?? 0 })}
              </Text>
            </Detail>
            {quest?.reward?.currency && (
              <>
                <Detail>
                  <Text fontSize="12px" color="textSubtle">
                    {t('%total% winners max.', { total: quest?.reward?.amountOfWinners?.toFixed(0) ?? 0 })}
                  </Text>
                  <Box mt="2px" ref={rewardTargetRef}>
                    <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
                  </Box>
                  {rewardTooltipVisible && rewardTooltip}
                </Detail>
                <Detail>
                  <Text fontSize="12px" color="textSubtle">
                    {t('Lucky Draw')}
                  </Text>
                  <Box mt="2px" ref={rewardTypeTargetRef}>
                    <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
                  </Box>
                  {rewardTypeTooltipVisible && rewardTypeTooltip}
                </Detail>
              </>
            )}
          </DetailContainer>
        </Flex>
      </Card>
    </Box>
  )
}
